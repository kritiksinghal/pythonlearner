/*
 * components/MarkdownView.tsx
 *
 * Lightweight, zero-dependency Markdown renderer supporting:
 * - Headings (##, ###) with slug IDs for Table of Contents
 * - Tables (GFM pipe tables)
 * - Numbered lists (1., 2.) & bullet lists (-, *)
 * - Blockquotes (> quote)
 * - Interactive runnable code blocks (```python run)
 * - Read-only output blocks (```output)
 * - Standard code blocks (```python)
 * - Callout boxes (:::tip, :::warning, :::remember, :::deep)
 * - Collapsible solution blocks (:::solution)
 * - Bold (**bold**) & inline code (`code`)
 */

"use client";

import React from "react";
import RunnableCodeBlock from "./RunnableCodeBlock";

interface Props {
  content: string;
}

interface MarkdownLine {
  text: string;
  start: number;
  end: number;
}

type MarkdownToken =
  | { kind: "fence"; start: number; end: number; tag: string; body: string }
  | { kind: "callout"; start: number; end: number; type: string; title: string; body: string };

function splitLines(content: string): MarkdownLine[] {
  const lines: MarkdownLine[] = [];
  const pattern = /[^\r\n]*(?:\r\n|\n|\r|$)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content)) !== null) {
    if (!match[0]) break;
    const raw = match[0];
    lines.push({ text: raw.replace(/(?:\r\n|\n|\r)$/, ""), start: match.index, end: match.index + raw.length });
  }
  return lines;
}

function fenceOpening(line: string) {
  return /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
}

function calloutOpening(line: string) {
  return /^:::(\w+)(?:[ \t]+([^\r\n]*))?[ \t]*$/.exec(line);
}

function findFenceClose(lines: MarkdownLine[], from: number, marker: string, size: number, stopAtCallout = false) {
  for (let i = from; i < lines.length; i += 1) {
    if (stopAtCallout && lines[i].text.trim() === ":::") return { index: -1, boundary: i };
    const close = /^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(lines[i].text);
    if (close && close[1][0] === marker && close[1].length >= size) return { index: i, boundary: -1 };
  }
  return { index: -1, boundary: -1 };
}

/** Tokenize fenced blocks and callouts by whole lines, honoring delimiter type and length. */
function findMarkdownTokens(content: string): MarkdownToken[] {
  const lines = splitLines(content);
  const tokens: MarkdownToken[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const fence = fenceOpening(line.text);
    if (fence) {
      const marker = fence[1][0];
      const closing = findFenceClose(lines, i + 1, marker, fence[1].length);
      const closeIndex = closing.index;
      const end = closeIndex >= 0 ? lines[closeIndex].end : content.length;
      const bodyEnd = closeIndex >= 0 ? lines[closeIndex].start : content.length;
      tokens.push({
        kind: "fence",
        start: line.start,
        end,
        tag: fence[2].trim().toLowerCase(),
        body: content.slice(line.end, bodyEnd).replace(/(?:\r\n|\n|\r)$/, ""),
      });
      if (closeIndex < 0) break;
      i = closeIndex;
      continue;
    }

    const callout = calloutOpening(line.text);
    if (!callout) continue;

    let depth = 1;
    let closeIndex = -1;
    for (let cursor = i + 1; cursor < lines.length; cursor += 1) {
      const nestedFence = fenceOpening(lines[cursor].text);
      if (nestedFence) {
        const fenceClose = findFenceClose(lines, cursor + 1, nestedFence[1][0], nestedFence[1].length, true);
        if (fenceClose.index >= 0) {
          cursor = fenceClose.index;
          continue;
        }
        if (fenceClose.boundary >= 0) cursor = fenceClose.boundary - 1;
        else break;
      }

      if (lines[cursor].text.trim() === ":::") {
        depth -= 1;
        if (depth === 0) {
          closeIndex = cursor;
          break;
        }
      } else if (calloutOpening(lines[cursor].text)) {
        depth += 1;
      }
    }
    const end = closeIndex >= 0 ? lines[closeIndex].end : content.length;
    const bodyEnd = closeIndex >= 0 ? lines[closeIndex].start : content.length;
    tokens.push({
      kind: "callout",
      start: line.start,
      end,
      type: callout[1].toLowerCase(),
      title: (callout[2] || "").trim(),
      body: content.slice(line.end, bodyEnd).replace(/(?:\r\n|\n|\r)$/, ""),
    });
    if (closeIndex < 0) break;
    i = closeIndex;
  }
  return tokens;
}

/** Slugify heading text to match Table of Contents links */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Render inline formatting: **bold** and `code` */
function renderInline(text: string): React.ReactNode[] {
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={index}
          className="rounded bg-code-bg px-1.5 py-0.5 font-mono text-xs text-accent"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function MarkdownView({ content }: Props) {
  const tokens = findMarkdownTokens(content);
  const expectedByToken = new Map<number, string>();
  const sampleInputByToken = new Map<number, { text: string; isInteractive: boolean }>();
  tokens.forEach((token, index) => {
    const next = tokens[index + 1];
    if (token.kind === "fence" && token.tag === "expected" && next?.kind === "fence" && next.tag === "python run") {
      expectedByToken.set(index + 1, token.body.trimEnd());
      const inputToken = tokens[index - 1];
      if (inputToken?.kind === "fence" && (inputToken.tag === "input" || inputToken.tag === "sample input")) {
        sampleInputByToken.set(index + 1, {
          text: inputToken.body,
          isInteractive: inputToken.tag === "input",
        });
      }
    }
  });
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let currentHeading = "";

  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
    const token = tokens[tokenIndex];
    const textSegment = content.slice(lastIndex, token.start);
    const headingMatches = [...textSegment.matchAll(/^## (?!#)([^\r\n]+)$/gm)];
    if (headingMatches.length) currentHeading = headingMatches.at(-1)?.[1].trim().toLowerCase() || currentHeading;
    const inTryItYourself = currentHeading === "try it yourself" || currentHeading === "make it yourself";
    const textBefore = textSegment.trim();
    if (textBefore) {
      elements.push(...renderTextBlocks(textBefore, elements.length));
    }

    if (token.kind === "fence") {
      // ── Code block ──
      const tag = token.tag;
      const codeSnippet = token.body.trimEnd();

      if (inTryItYourself && (tag === "python run" || tag.endsWith("run"))) {
        elements.push(
          <RunnableCodeBlock
            key={`exercise-${elements.length}`}
            initialCode={codeSnippet}
            expectedOutput={expectedByToken.get(tokenIndex)}
            initialStdin={sampleInputByToken.get(tokenIndex)?.text}
            showInput={sampleInputByToken.get(tokenIndex)?.isInteractive}
            title="Your Turn"
          />
        );
      } else if (tag === "python run" || tag.endsWith("run")) {
        elements.push(
          <RunnableCodeBlock
            key={`run-${elements.length}`}
            initialCode={codeSnippet}
            expectedOutput={expectedByToken.get(tokenIndex)}
          />
        );
      } else if (tag === "output" && inTryItYourself) {
        // Keep expected answers out of view until the learner opens the solution.
      } else if (tag === "input" || tag === "sample input") {
        elements.push(
          <div key={`sample-input-${elements.length}`} className="my-3 overflow-hidden rounded-md border border-border bg-code-bg/60">
            <div className="flex items-center gap-1.5 border-b border-border bg-code-bg/40 px-3 py-1 text-[11px] font-mono text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-muted/60" />
              <span>Sample input</span>
            </div>
            <pre className="p-3 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed overflow-x-auto"><code>{codeSnippet}</code></pre>
          </div>
        );
      } else if (tag === "expected") {
        elements.push(
          <div key={`expected-${elements.length}`} className="my-3 overflow-hidden rounded-md border border-accent/40 bg-accent/5">
            <div className="flex items-center gap-1.5 border-b border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-mono text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Expected output</span>
            </div>
            <pre className="p-3 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed overflow-x-auto"><code>{codeSnippet}</code></pre>
          </div>
        );
      } else if (tag === "output") {
        elements.push(
          <div
            key={`output-${elements.length}`}
            className="my-3 overflow-hidden rounded-md border border-border bg-code-bg/60"
          >
            <div className="flex items-center gap-1.5 border-b border-border bg-code-bg/40 px-3 py-1 text-[11px] font-mono text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-muted/60" />
              <span>Output</span>
            </div>
            <pre className="p-3 font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed overflow-x-auto">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        );
      } else {
        elements.push(
          <pre
            key={`code-${elements.length}`}
            className="my-3 overflow-x-auto rounded-md border border-border bg-code-bg p-3.5 font-mono text-xs leading-relaxed text-foreground"
          >
            <code>{codeSnippet}</code>
          </pre>
        );
      }
    } else {
      // ── Callout / Solution block ──
      const type = token.type;
      const title = token.title;
      const body = token.body.trim();

      if (type === "solution") {
        elements.push(
          <details
            key={`solution-${elements.length}`}
            className="group my-4 rounded-md border border-border bg-surface p-3.5"
          >
            <summary className="cursor-pointer select-none font-medium text-xs sm:text-sm text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="rounded bg-accent/20 text-foreground font-mono text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-semibold">
                  Solution
                </span>
                <span>{title || "Click to reveal solution"}</span>
              </span>
              <span className="text-muted text-xs group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="mt-3 border-t border-border pt-3">
              <MarkdownView content={body} />
            </div>
          </details>
        );
      } else if (type === "tip" && title.toLowerCase() === "hint") {
        elements.push(
          <details
            key={`hint-${elements.length}`}
            className="group my-3 rounded-md border border-border bg-surface px-3.5 py-3"
          >
            <summary className="cursor-pointer select-none font-medium text-xs sm:text-sm text-foreground flex items-center justify-between">
              <span>Hint</span>
              <span className="text-muted text-xs group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-foreground/90">
              <MarkdownView content={body} />
            </div>
          </details>
        );
      } else {
        // Callout boxes: tip, warning, remember, deep
        const calloutStyles: Record<
          string,
          { border: string; bg: string; badge: string; label: string }
        > = {
          tip: {
            border: "border-l-emerald-500",
            bg: "bg-emerald-50/40 dark:bg-emerald-950/20",
            badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
            label: "TIP",
          },
          warning: {
            border: "border-l-amber-500",
            bg: "bg-amber-50/40 dark:bg-amber-950/20",
            badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
            label: "WARNING",
          },
          remember: {
            border: "border-l-accent",
            bg: "bg-accent/10",
            badge: "bg-accent text-accent-ink font-bold",
            label: "REMEMBER",
          },
          deep: {
            border: "border-l-purple-500",
            bg: "bg-purple-50/40 dark:bg-purple-950/20",
            badge: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
            label: "DEEP DIVE",
          },
        };

        const style = calloutStyles[type] || calloutStyles.tip;

        elements.push(
          <div
            key={`callout-${elements.length}`}
            className={`my-4 rounded-md border border-border border-l-4 ${style.border} ${style.bg} p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider ${style.badge}`}
              >
                {style.label}
              </span>
              {title && (
                <span className="font-semibold text-xs sm:text-sm text-foreground">
                  {title}
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm leading-relaxed text-foreground/90">
              <MarkdownView content={body} />
            </div>
          </div>
        );
      }
    }

    lastIndex = token.end;
  }

  const remaining = content.slice(lastIndex).trim();
  if (remaining) {
    elements.push(...renderTextBlocks(remaining, elements.length));
  }

  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-foreground">
      {elements}
    </div>
  );
}

/** Helper to render headings, tables, numbered/bullet lists, blockquotes, and paragraphs */
function renderTextBlocks(text: string, keyOffset: number): React.ReactNode[] {
  const rawBlocks = text.split(/\n\n+/);
  const elements: React.ReactNode[] = [];

  rawBlocks.forEach((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    // Heading 2: ## (with slug ID for Table of Contents)
    if (trimmed.startsWith("## ")) {
      const headingText = trimmed.slice(3).trim();
      const headingId = slugifyHeading(headingText);
      elements.push(
        <h2
          key={`h2-${keyOffset}-${i}`}
          id={headingId}
          className="mt-8 mb-3 border-b border-border pb-2 text-xl font-bold tracking-tight text-foreground scroll-mt-24"
        >
          {renderInline(headingText)}
        </h2>
      );
      return;
    }

    // Heading 3: ###
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${keyOffset}-${i}`}
          className="mt-6 mb-2 text-base font-semibold tracking-tight text-foreground scroll-mt-24"
        >
          {renderInline(trimmed.slice(4).trim())}
        </h3>
      );
      return;
    }

    const lines = trimmed.split(/\r?\n/);

    // Table check: at least 2 lines, header has '|', second line is separator like '|---|'
    if (
      lines.length >= 2 &&
      lines.every((l) => l.trim().includes("|")) &&
      /\|?\s*[-:]+[-|\s:]*/.test(lines[1])
    ) {
      const headers = lines[0]
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);

      const rows = lines.slice(2).map((l) =>
        l
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean)
      );

      elements.push(
        <div
          key={`table-${keyOffset}-${i}`}
          className="my-4 overflow-x-auto rounded-md border border-border"
        >
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-border bg-code-bg/60 font-mono text-[11px] uppercase tracking-wider text-muted">
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-3.5 py-2 font-semibold">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-code-bg/30">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2.5">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      return;
    }

    // Blockquote check: all non-empty lines start with '>'
    if (lines.every((l) => !l.trim() || l.trim().startsWith(">"))) {
      elements.push(
        <blockquote
          key={`quote-${keyOffset}-${i}`}
          className="my-3 border-l-2 border-accent bg-surface/50 pl-4 py-2 italic text-muted text-sm rounded-r"
        >
          {lines.map((l, li) => (
            <p key={li}>{renderInline(l.trim().replace(/^>\s?/, ""))}</p>
          ))}
        </blockquote>
      );
      return;
    }

    // Numbered list check: all lines match /^\d+\.\s+/
    const isNumberedList = lines.every((l) => /^\d+\.\s+/.test(l.trim()));
    if (isNumberedList) {
      elements.push(
        <ol
          key={`ol-${keyOffset}-${i}`}
          className="my-2 list-decimal space-y-1 pl-5 text-sm sm:text-[15px]"
        >
          {lines.map((line, li) => (
            <li key={li}>
              {renderInline(line.trim().replace(/^\d+\.\s+/, ""))}
            </li>
          ))}
        </ol>
      );
      return;
    }

    // Bullet list check: lines start with '- ' or '* '
    const isBulletList = lines.every(
      (l) => l.trim().startsWith("- ") || l.trim().startsWith("* ")
    );
    if (isBulletList) {
      elements.push(
        <ul
          key={`ul-${keyOffset}-${i}`}
          className="my-2 list-disc space-y-1 pl-5 text-sm sm:text-[15px]"
        >
          {lines.map((line, li) => (
            <li key={li}>
              {renderInline(line.trim().replace(/^[-*]\s+/, ""))}
            </li>
          ))}
        </ul>
      );
      return;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${keyOffset}-${i}`} className="text-[15px] leading-relaxed">
        {lines.map((line, li) => (
          <React.Fragment key={li}>
            {li > 0 && <br />}
            {renderInline(line)}
          </React.Fragment>
        ))}
      </p>
    );
  });

  return elements;
}
