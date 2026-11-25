/*
 * app/page.tsx — Home Page
 *
 * Implements the dot-matrix, hairline aesthetic:
 * a. Headline "WRITE. RUN." -> DotGridGlyph -> "LEARN." in Doto font
 * b. Outlined pill labels (variables, loops, functions, tests, bugs, quiz) and tiny dots
 * c. Muted description
 * d. Dark rounded CTA button with yellow tile + text link to /practice
 * e. Facts row with counts calculated from the curriculum and problem files
 * f. Two-tone statement section with decorative HalftoneCanvas
 */

import Link from "next/link";
import DotGridGlyph from "@/components/DotGridGlyph";
import HalftoneCanvas from "@/components/HalftoneCanvas";
import { getAllLessons, getCurriculum } from "@/lib/lessons";
import { getProblems } from "@/lib/problems";

export const metadata = {
  title: "Learn Python from zero to advanced",
  description:
    "Python from zero to advanced, with a full curriculum and a browser test runner that shows exactly which tests failed.",
};

export default function HomePage() {
  const lessonCount = getAllLessons().length;
  const trackCount = getCurriculum().filter((track) => track.totalCount > 0).length;
  const testCounts = getProblems().map((problem) => problem.tests.length);
  const testRange = `${Math.min(...testCounts)}–${Math.max(...testCounts)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      {/* ── Section A & B: Hero Lockup ── */}
      <section className="relative mx-auto flex flex-col items-center justify-center text-center">
        {/* Top Headline */}
        <h1 className="font-doto text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold tracking-tight text-foreground leading-none">
          WRITE. RUN.
        </h1>

        {/* Center Graphic Lockup with Scattered Pills */}
        <div className="relative my-6 flex h-48 w-full max-w-md items-center justify-center">
          {/* Central Dot-Grid Tile */}
          <div className="z-10">
            <DotGridGlyph />
          </div>

          {/* Static scattered labels and dots around the tile */}
          {/* Top Left: variables */}
          <span className="absolute top-4 left-6 rounded-full border border-border bg-background/80 px-2.5 py-0.5 font-mono text-[11px] text-muted shadow-2xs">
            variables
          </span>
          <span className="absolute top-12 left-28 h-1 w-1 rounded-full bg-muted/40" />

          {/* Top Right: loops */}
          <span className="absolute top-3 right-8 rounded-full border border-border bg-background/80 px-2.5 py-0.5 font-mono text-[11px] text-muted shadow-2xs">
            loops
          </span>
          <span className="absolute top-14 right-24 h-1 w-1 rounded-full bg-muted/40" />

          {/* Mid Left: tests */}
          <span className="absolute bottom-16 left-3 rounded-full border border-border bg-background/80 px-2.5 py-0.5 font-mono text-[11px] text-muted shadow-2xs">
            tests
          </span>
          <span className="absolute bottom-24 left-20 h-1 w-1 rounded-full bg-muted/30" />

          {/* Mid Right: bugs */}
          <span className="absolute bottom-16 right-4 rounded-full border border-border bg-background/80 px-2.5 py-0.5 font-mono text-[11px] text-muted shadow-2xs">
            bugs
          </span>
          <span className="absolute bottom-24 right-20 h-1 w-1 rounded-full bg-muted/30" />

          {/* Bottom Left: functions */}
          <span className="absolute bottom-2 left-12 rounded-full border border-border bg-background/80 px-2.5 py-0.5 font-mono text-[11px] text-muted shadow-2xs">
            functions
          </span>

          {/* Bottom Right: quiz */}
          <span className="absolute bottom-2 right-14 rounded-full border border-border bg-background/80 px-2.5 py-0.5 font-mono text-[11px] text-muted shadow-2xs">
            quiz
          </span>
        </div>

        {/* Bottom Headline */}
        <div className="font-doto text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold tracking-tight text-foreground leading-none">
          LEARN.
        </div>

        {/* ── Section C: Muted single-sentence summary ── */}
        <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
          Python from zero to advanced, with a full curriculum and a browser test
          runner that shows exactly which tests failed.
        </p>

        {/* ── Section D: Action Button & Text Link ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
          {/* Dark button with small yellow icon tile on left */}
          <Link
            href="/learn"
            className="inline-flex items-center gap-3 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded bg-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-ink" />
            </span>
            <span>Start learning</span>
          </Link>

          {/* Plain text link */}
          <Link
            href="/practice"
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline hover:text-muted transition-colors"
          >
            Practice coding
          </Link>
        </div>
      </section>

      {/* ── Section E: True Facts Row ── */}
      <section className="mt-20 border-y border-border py-8">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:divide-x sm:divide-border">
          {/* Fact 1 */}
          <div className="flex flex-col items-center px-4">
            <span className="font-doto text-3xl font-extrabold text-foreground sm:text-4xl">
              {lessonCount}
            </span>
            <span className="mt-1.5 text-xs text-muted max-w-[180px]">
              lessons across both tracks
            </span>
          </div>

          {/* Fact 2 */}
          <div className="flex flex-col items-center px-4">
            <span className="font-doto text-3xl font-extrabold text-foreground sm:text-4xl">
              {testRange}
            </span>
            <span className="mt-1.5 text-xs text-muted max-w-[180px]">
              tests per practice problem
            </span>
          </div>

          {/* Fact 3 */}
          <div className="flex flex-col items-center px-4">
            <span className="font-doto text-3xl font-extrabold text-foreground sm:text-4xl">
              {trackCount}
            </span>
            <span className="mt-1.5 text-xs text-muted max-w-[180px]">
              tracks, Python from zero and CS50P
            </span>
          </div>
        </div>
      </section>

      {/* ── Section F: Editorial Statement + Halftone Dot Field ── */}
      <section className="mt-16 rounded-xl border border-border bg-surface/50 p-6 sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Statement Text */}
          <div className="lg:col-span-7">
            <p className="text-xl leading-relaxed tracking-tight sm:text-2xl">
              <span className="font-medium text-foreground">
              A useful failure points to the exact test.{" "}
              </span>
              <span className="text-muted">
                See which test failed, what output was expected, and what your
                code returned.
              </span>
            </p>
          </div>

          {/* Decorative Halftone Canvas */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <HalftoneCanvas />
          </div>
        </div>
      </section>
    </div>
  );
}
