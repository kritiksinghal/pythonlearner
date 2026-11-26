import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const staticDir = path.resolve(".next/static");
const requiredSelectors = [".flex", ".grid", ".hidden", ".items-center"];

async function findCssFiles(directory) {
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findCssFiles(entryPath);
      return entry.isFile() && entry.name.endsWith(".css") ? [entryPath] : [];
    }),
  );

  return nested.flat();
}

function countSelector(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...css.matchAll(new RegExp(`${escaped}(?=[\\s,{.:#\\[])`, "g"))]
    .length;
}

const cssFiles = (await findCssFiles(staticDir)).sort();
if (cssFiles.length === 0) {
  console.error("CSS guard failed: no compiled CSS files found in .next/static.");
  process.exit(1);
}

let totalBytes = 0;
let combinedCss = "";
for (const file of cssFiles) {
  const [contents, fileStat] = await Promise.all([readFile(file, "utf8"), stat(file)]);
  totalBytes += fileStat.size;
  combinedCss += `${contents}\n`;
  console.log(`CSS: ${path.relative(process.cwd(), file)} — ${fileStat.size} bytes`);
}

const counts = Object.fromEntries(
  requiredSelectors.map((selector) => [selector, countSelector(combinedCss, selector)]),
);
const missing = Object.entries(counts)
  .filter(([, count]) => count === 0)
  .map(([selector]) => selector);

console.log(`CSS total: ${totalBytes} bytes across ${cssFiles.length} file(s)`);
for (const [selector, count] of Object.entries(counts)) {
  console.log(`${selector}: ${count}`);
}

if (totalBytes < 15_000) {
  console.error(`CSS guard failed: compiled CSS is ${totalBytes} bytes; expected at least 15000 bytes.`);
  process.exitCode = 1;
}

if (missing.length > 0) {
  console.error(`CSS guard failed: missing required Tailwind utilities: ${missing.join(", ")}.`);
  process.exitCode = 1;
}

if (process.exitCode) process.exitCode = 1;
else console.log("CSS guard passed.");
