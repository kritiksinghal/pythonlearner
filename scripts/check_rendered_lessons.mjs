#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawn } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const lessonRoot = join(root, "content", "lessons");
const builtRoot = join(root, ".next", "server", "app", "learn");

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#96;/g, "`")
    .replace(/&#x60;/gi, "`")
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function inspectParts(preBlocks, visibleText, label) {
  const errors = [];
  
  for (const [index, block] of preBlocks.entries()) {
    for (const [lineIndex, line] of block.split(/\r?\n/).entries()) {
      if (/^\s*##\s/.test(line) || /^\s*###\s/.test(line) || /^\s*:::/.test(line)) {
        errors.push(`code block ${index + 1}, line ${lineIndex + 1} contains a Markdown heading/callout: ${line.trim()}`);
      }
    }
  }

  const text = visibleText;
  if (/python\s+run\b/i.test(text)) errors.push("visible text contains 'python run' outside code elements");
  if (text.includes("```")) errors.push("visible text contains triple backticks outside code elements");
  if (text.includes(":::")) errors.push("visible text contains ':::' outside code elements");
  if (text.includes("$\\")) errors.push("visible text contains a LaTeX-style '$\\' sequence");
  if (errors.length) {
    console.error(`[FAIL] ${label}`);
    for (const error of errors) console.error(`  ${error}`);
    return false;
  }
  console.log(`[OK] ${label}`);
  return true;
}

function inspectHtml(html, label) {
  // Next.js embeds the original Markdown in Flight scripts. It is not visible page text.
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const visible = [];
  const preBlocks = [];
  let preDepth = 0;
  let codeDepth = 0;
  let ignoredDepth = 0;
  let currentPre = "";
  const tokens = html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || [];
  for (const token of tokens) {
    if (token.startsWith("<!--")) continue;
    if (token.startsWith("<")) {
      const close = /^<\s*\/\s*([a-z0-9-]+)/i.exec(token);
      const open = /^<\s*([a-z0-9-]+)/i.exec(token);
      const name = (close?.[1] || open?.[1] || "").toLowerCase();
      if (close) {
        if (name === "pre" && preDepth > 0) {
          preDepth -= 1;
          if (preDepth === 0) preBlocks.push(currentPre);
        } else if (name === "code" && codeDepth > 0) codeDepth -= 1;
        if ((name === "script" || name === "style") && ignoredDepth > 0) ignoredDepth -= 1;
      } else if (open) {
        if (name === "pre") {
          if (preDepth === 0) currentPre = "";
          preDepth += 1;
        } else if (name === "code") codeDepth += 1;
        if (name === "script" || name === "style") ignoredDepth += 1;
      }
      continue;
    }
    if (ignoredDepth > 0) continue;
    const text = decodeHtml(token);
    if (preDepth > 0) currentPre += text;
    if (preDepth === 0 && codeDepth === 0) visible.push(text);
  }

  return inspectParts(preBlocks, visible.join(""), label);
}

const lessons = readdirSync(lessonRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== "README.md")
  .map((entry) => entry.name)
  .sort();
let failures = 0;
for (const slug of lessons) {
  const path = join(builtRoot, `${slug}.html`);
  try {
    if (!inspectHtml(readFileSync(path, "utf8"), slug)) failures += 1;
  } catch (error) {
    failures += 1;
    console.error(`[FAIL] ${slug}: built HTML missing or unreadable (${error.message})`);
  }
}
console.log(`\nBuilt lesson HTML: ${lessons.length} checked, ${failures} failures.`);

let playwright;
try {
  playwright = await import("playwright");
} catch {
  console.log("needs human check: Playwright is not installed, so the live DOM was not checked.");
}

if (playwright) {
  let server;
  let browser;
  const port = Number(process.env.LESSON_PREVIEW_PORT || 3187);
  try {
    server = spawn(process.execPath, [join(root, "node_modules", "next", "dist", "bin", "next"), "start", "-p", String(port)], {
      cwd: root,
      stdio: "ignore",
      env: { ...process.env, PORT: String(port) },
    });
    let ready = false;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (server.exitCode !== null) throw new Error("next start exited before becoming ready");
      try {
        const response = await fetch(`http://127.0.0.1:${port}/learn/${lessons[0]}`);
        if (response.ok) { ready = true; break; }
      } catch {}
      await new Promise((resolveWait) => setTimeout(resolveWait, 250));
    }
    if (!ready) throw new Error("production preview did not become reachable");
    browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
    for (const slug of lessons) {
      await page.goto(`http://127.0.0.1:${port}/learn/${slug}`, { waitUntil: "domcontentloaded" });
      const result = await page.evaluate(() => {
        const preBlocks = [...document.querySelectorAll("pre")].map((element) => element.textContent || "");
        const clone = document.body.cloneNode(true);
        clone.querySelectorAll("pre, code, script, style").forEach((element) => element.remove());
        return { preBlocks, visibleText: clone.textContent || "" };
      });
      if (!inspectParts(result.preBlocks, result.visibleText, `live DOM ${slug}`)) failures += 1;
    }
  } catch (error) {
    console.log(`needs human check: Playwright was available, but live DOM checking could not complete (${error.message}).`);
  } finally {
    await browser?.close();
    server?.kill("SIGTERM");
  }
}

process.exitCode = failures ? 1 : 0;
