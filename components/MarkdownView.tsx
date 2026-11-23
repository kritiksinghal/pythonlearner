/*
 * components/MarkdownView.tsx
 *
 * Lightweight Markdown renderer for problem descriptions:
 * - Code blocks (```python ... ```)
 * - Bold text (**bold**)
 * - Inline code (`code`)
 * - Bullet lists (- item)
 * - Paragraphs
 */

import React from "react";

interface Props {
  content: string;
}

/** Render inline formatting: **bold** and `code` */
function renderInline(text: string): React.ReactNode[] {
  // Regex matches `inline code` or **bold**
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
  // Split on code fences ```...```
  const fenceRegex = /```(?:[a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(content)) !== null) {
    // Process markdown text before the code block
    const textBefore = content.slice(lastIndex, match.index).trim();
    if (textBefore) {
      elements.push(
        ...renderTextBlocks(textBefore, elements.length)
      );
    }

    // Process code block
    const codeSnippet = match[1].trimEnd();
    elements.push(
      <pre
        key={`code-${elements.length}`}
        className="my-3 overflow-x-auto rounded-lg border border-border bg-code-bg p-3.5 font-mono text-xs leading-relaxed text-foreground"
      >
        <code>{codeSnippet}</code>
      </pre>
    );

    lastIndex = match.index + match[0].length;
  }

  // Any remaining text after the last code block
  const remaining = content.slice(lastIndex).trim();
  if (remaining) {
    elements.push(...renderTextBlocks(remaining, elements.length));
  }

  return <div className="space-y-3 text-[15px] leading-relaxed text-foreground">{elements}</div>;
}

/** Helper to render paragraphs and bullet lists */
function renderTextBlocks(text: string, keyOffset: number): React.ReactNode[] {
  const blocks = text.split(/\n\n+/);
  return blocks.map((block, i) => {
    const lines = block.split("\n");
    const isList = lines.every((l) => l.trim().startsWith("- "));

    if (isList) {
      return (
        <ul
          key={`list-${keyOffset}-${i}`}
          className="my-2 list-disc space-y-1 pl-5 text-sm"
        >
          {lines.map((line, li) => (
            <li key={li}>{renderInline(line.trim().slice(2))}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`p-${keyOffset}-${i}`} className="text-sm leading-relaxed">
        {lines.map((line, li) => (
          <React.Fragment key={li}>
            {li > 0 && <br />}
            {renderInline(line)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}
