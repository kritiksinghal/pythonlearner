/*
 * /learn — Lessons Index Page
 *
 * Upgraded layout:
 * - Design tokens from visual identity (yellow dot, Doto headings, same style as /practice)
 * - Single hairline divider under track titles (no double rule)
 * - Fixed-width column for lesson numbers using Doto font (01..50, 01..10)
 * - Real counts calculated from curriculum files: "X of Y lessons ready"
 * - Full curriculum map: written lessons link to /learn/[slug] with level, reading time, and "Start →"
 * - Placeholders greyed out with "Coming soon", not clickable, no level, no reading time
 * - "Start →" link uses yellow underline in light mode, yellow text in dark mode (never yellow text on white)
 */

import Link from "next/link";
import { getCurriculum } from "@/lib/lessons";

export const metadata = {
  title: "Python Lessons — PyLearner",
  description:
    "Structured Python curriculum from zero to advanced with interactive examples, module progression, and quizzes.",
};

export default function LearnPage() {
  const tracks = getCurriculum();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-xs font-mono text-muted mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>CURRICULUM</span>
        </div>
        <h1 className="font-doto text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          PYTHON LESSONS
        </h1>
        <p className="mt-2 text-sm text-muted max-w-xl leading-relaxed">
          Step-by-step beginner lessons explained in plain words. Grouped by modules
          with estimated reading times, interactive code snippets, and knowledge check quizzes.
        </p>
      </div>

      {/* Tracks & Modules */}
      <div className="space-y-16">
        {tracks.map((track) => {
          if (track.modules.length === 0) return null;

          return (
            <section key={track.trackName} className="space-y-8">
              {/* Track Title (Single clean hairline divider, Doto font, dynamic real counts) */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <h2 className="font-doto text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {track.trackName.toUpperCase()}
                  </h2>
                </div>
                <span className="font-mono text-xs text-muted">
                  {track.readyCount} of {track.totalCount} lessons ready
                </span>
              </div>

              {/* Modules within Track */}
              <div className="space-y-8">
                {track.modules.map((module) => (
                  <div key={module.moduleName} className="space-y-3">
                    {/* Module Subtitle (Module labels stay in mono font) */}
                    <div className="flex items-center gap-2 font-mono text-xs text-muted">
                      <span className="text-muted/60">§</span>
                      <span className="font-semibold uppercase tracking-wider text-foreground">
                        {module.moduleName}
                      </span>
                    </div>

                    {/* Ruled Lesson List */}
                    <div className="border-y border-border divide-y divide-border">
                      {module.lessons.map((lesson) => {
                        const numStr = String(lesson.trackNumber).padStart(2, "0");

                        if (lesson.isReady && lesson.slug) {
                          // Written / Ready Lesson: clickable link with details and Start ->
                          return (
                            <Link
                              key={`${track.trackName}-${lesson.trackNumber}-${lesson.slug}`}
                              href={`/learn/${lesson.slug}`}
                              className="group flex flex-col justify-between gap-3 py-4.5 px-3 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:gap-6"
                            >
                              {/* Left: Fixed-width number + Title & Summary */}
                              <div className="flex items-start gap-4 min-w-0">
                                <span className="w-10 shrink-0 font-doto text-sm font-bold text-muted group-hover:text-foreground">
                                  {numStr}
                                </span>
                                <div className="min-w-0">
                                  <h3 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-foreground">
                                    {lesson.title}
                                  </h3>
                                  {lesson.summary && (
                                    <p className="mt-1 text-xs text-muted leading-relaxed line-clamp-1 max-w-xl">
                                      {lesson.summary}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Right: Level, Reading Time, and Start -> Link */}
                              <div className="flex items-center justify-between gap-4 text-xs font-mono text-muted shrink-0 sm:justify-end">
                                {lesson.level && (
                                  <span className="rounded border border-border bg-code-bg px-2 py-0.5 text-[11px] text-foreground">
                                    {lesson.level}
                                  </span>
                                )}
                                {lesson.readingTime && (
                                  <span>{lesson.readingTime} min</span>
                                )}
                                {/* Yellow underline in light mode, yellow text in dark mode */}
                                <span className="font-medium text-foreground underline decoration-accent underline-offset-2 decoration-2 dark:text-accent dark:no-underline shrink-0">
                                  Start →
                                </span>
                              </div>
                            </Link>
                          );
                        }

                        // Placeholder Lesson: unwritten, greyed out, not clickable
                        return (
                          <div
                            key={`${track.trackName}-${lesson.trackNumber}-${lesson.title}`}
                            className="flex flex-col justify-between gap-3 py-4.5 px-3 opacity-40 cursor-default select-none sm:flex-row sm:items-center sm:gap-6"
                          >
                            {/* Left: Fixed-width number + Title */}
                            <div className="flex items-start gap-4 min-w-0">
                              <span className="w-10 shrink-0 font-doto text-sm font-bold text-muted">
                                {numStr}
                              </span>
                              <div className="min-w-0">
                                <h3 className="text-sm font-medium tracking-tight text-muted">
                                  {lesson.title}
                                </h3>
                              </div>
                            </div>

                            {/* Right: Coming soon indicator */}
                            <div className="flex items-center justify-end text-xs font-mono text-muted/70 shrink-0">
                              <span>Coming soon</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
