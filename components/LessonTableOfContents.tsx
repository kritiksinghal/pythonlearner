/*
 * components/LessonTableOfContents.tsx
 *
 * Sticky Table of Contents for lessons:
 * - Desktop: Sticky sidebar in 220px column with solid background and active section highlighting
 * - Mobile: Collapsed dropdown above the lesson content in normal document flow
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { slugifyHeading } from "./MarkdownView";

export interface TOCHeading {
  id: string;
  text: string;
}

/** Extract ## headings from markdown, ignoring code blocks */
export function extractHeadings(content: string): TOCHeading[] {
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");
  const lines = withoutCodeBlocks.split(/\r?\n/);
  const headings: TOCHeading[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3).trim();
      headings.push({
        id: slugifyHeading(text),
        text,
      });
    }
  }

  return headings;
}

interface Props {
  content: string;
  mode?: "mobile" | "desktop" | "both";
}

export default function LessonTableOfContents({ content, mode = "both" }: Props) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* ── Mobile View: Collapsed above the lesson in normal flow ── */}
      {(mode === "mobile" || mode === "both") && (
        <div className={mode === "both" ? "mb-8 lg:hidden" : ""}>
          <details className="group rounded-md border border-border bg-surface p-3 text-xs">
            <summary className="cursor-pointer select-none font-mono font-semibold uppercase tracking-wider text-muted flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>On this page ({headings.length})</span>
              </span>
              <span className="text-muted group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <nav className="mt-3 border-t border-border pt-2 space-y-1.5">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={`block py-1 text-xs transition-colors hover:text-foreground ${
                    activeId === h.id
                      ? "font-semibold text-foreground"
                      : "text-muted"
                  }`}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </details>
        </div>
      )}

      {/* ── Desktop View: Sticky sidebar in dedicated 220px column with SOLID background ── */}
      {(mode === "desktop" || mode === "both") && (
        <aside
          className={
            mode === "both"
              ? "hidden lg:block sticky top-20 w-[220px] shrink-0 self-start"
              : "sticky top-20 w-[220px] shrink-0 self-start"
          }
        >
          {/* Solid background: bg-surface (not see-through!) */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-3 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>On this page</span>
            </div>
            <nav className="space-y-1 text-xs leading-relaxed max-h-[calc(100vh-8rem)] overflow-y-auto">
              {headings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`flex items-start gap-2 py-1 transition-colors ${
                      isActive
                        ? "font-semibold text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-1 w-1 shrink-0 rounded-full transition-colors ${
                        isActive ? "bg-accent" : "bg-transparent"
                      }`}
                    />
                    <span>{h.text}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>
      )}
    </>
  );
}
