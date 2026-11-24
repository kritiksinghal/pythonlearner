/*
 * /learn/[slug] — Individual Lesson Page
 *
 * Upgraded layout:
 * - Doto font on main h1
 * - Top padding to clear sticky navbar
 * - From 1024px up: 2-column grid (220px left column for TOC with solid background, max-w-[70ch] reading column)
 * - Below 1024px: collapsed "On this page" dropdown above content in normal flow (not floating/overlapping)
 * - Level badge ("Beginner", "Intermediate", "Advanced")
 * - Estimated reading time (words / 200, rounded)
 * - Related practice problems section at the end
 * - Previous / Next navigation within the track
 */

import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllLessons, getLessonBySlug } from "@/lib/lessons";
import { getProblemBySlug } from "@/lib/problems";
import MarkdownView from "@/components/MarkdownView";
import QuizView from "@/components/QuizView";
import LessonTableOfContents from "@/components/LessonTableOfContents";

export function generateStaticParams() {
  const lessons = getAllLessons();
  return lessons.map((l) => ({ slug: l.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function LessonContent({ params }: PageProps) {
  const { slug } = await params;
  const { lesson, previousLesson, nextLesson } = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  // Filter related problems to only those that actually exist
  const relatedProblems = (lesson.relatedProblems || [])
    .map((pSlug) => getProblemBySlug(pSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
        <Link href="/learn" className="transition-colors hover:text-foreground">
          ← ALL LESSONS
        </Link>
        <span>/</span>
        <span className="rounded border border-border bg-code-bg px-2 py-0.5">
          {lesson.track.toUpperCase()}
        </span>
        <span>/</span>
        <span className="text-muted">{lesson.module}</span>
        <span>/</span>
        <span className="text-foreground">LESSON 0{lesson.order}</span>
      </div>

      {/* Mobile Table of Contents (below 1024px: collapsed dropdown in normal flow, not floating) */}
      <div className="mb-8 lg:hidden">
        <LessonTableOfContents content={lesson.content} mode="mobile" />
      </div>

      {/* Desktop 2-column grid from 1024px up: 220px left TOC column + main reading column */}
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 items-start">
        {/* Left column: Sticky Table of Contents with solid background */}
        <div className="hidden lg:block">
          <LessonTableOfContents content={lesson.content} mode="desktop" />
        </div>

        {/* Right column: Main Lesson Article limited to ~70ch reading width */}
        <article className="min-w-0 max-w-[70ch]">
          {/* Header Metadata */}
          <header className="mb-10 border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-2.5 mb-3 text-xs font-mono text-muted">
              <span className="rounded border border-border bg-surface px-2 py-0.5 font-semibold text-foreground">
                {lesson.level}
              </span>
              <span>·</span>
              <span>{lesson.readingTime} min read</span>
            </div>

            <h1 className="font-doto text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {lesson.title}
            </h1>
            {lesson.summary && (
              <p className="mt-3 text-sm text-muted leading-relaxed max-w-xl">
                {lesson.summary}
              </p>
            )}

            {/* Learning Goals */}
            {lesson.learningGoals && lesson.learningGoals.length > 0 && (
              <div className="mt-5 rounded-md border border-border bg-code-bg/40 p-3.5 text-xs">
                <div className="font-mono font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>Goals for this lesson</span>
                </div>
                <ul className="space-y-1 text-muted pl-4 list-disc">
                  {lesson.learningGoals.map((goal, idx) => (
                    <li key={idx}>{goal}</li>
                  ))}
                </ul>
              </div>
            )}
          </header>

          {/* Lesson Body (Markdown + Runnable Examples + Output Blocks) */}
          <div className="max-w-none">
            <MarkdownView content={lesson.content} />
          </div>

          {/* Related Practice Problems (only shown if matching problems exist) */}
          {relatedProblems.length > 0 && (
            <section className="mt-14 rounded-lg border border-border bg-surface/50 p-6">
              <div className="flex items-center gap-2 font-mono text-xs text-muted mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>RECOMMENDED PRACTICE PROBLEMS</span>
              </div>
              <div className="divide-y divide-border border-y border-border">
                {relatedProblems.map((prob) => (
                  <Link
                    key={prob.slug}
                    href={`/practice/${prob.slug}`}
                    className="group flex items-center justify-between py-3 text-xs transition-colors hover:text-accent"
                  >
                    <div>
                      <span className="font-semibold text-foreground group-hover:text-accent">
                        {prob.title}
                      </span>
                      <span className="ml-2 font-mono text-muted">
                        ({prob.tests.length} tests)
                      </span>
                    </div>
                    <span className="font-mono text-muted group-hover:text-foreground">
                      {prob.difficulty} →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Quiz Section */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <section className="mt-14 border-t border-border pt-10">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-mono text-muted mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>TEST YOUR KNOWLEDGE</span>
                </div>
                <h2 className="font-doto text-xl font-bold tracking-tight text-foreground">
                  LESSON QUIZ
                </h2>
              </div>
              <QuizView questions={lesson.quiz} />
            </section>
          )}

          {/* Previous / Next Lesson Navigation within track */}
          <nav className="mt-14 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {previousLesson ? (
                <Link
                  href={`/learn/${previousLesson.slug}`}
                  className="group inline-flex flex-col text-left transition-colors hover:opacity-80"
                >
                  <span className="font-mono text-[11px] text-muted">
                    ← PREVIOUS
                  </span>
                  <span className="text-xs font-semibold text-foreground group-hover:underline">
                    {previousLesson.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>

            <div className="text-right">
              {nextLesson ? (
                <Link
                  href={`/learn/${nextLesson.slug}`}
                  className="group inline-flex flex-col text-right transition-colors hover:opacity-80"
                >
                  <span className="font-mono text-[11px] text-muted">
                    NEXT →
                  </span>
                  <span className="text-xs font-semibold text-foreground group-hover:underline">
                    {nextLesson.title}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/practice"
                  className="group inline-flex flex-col text-right transition-colors hover:opacity-80"
                >
                  <span className="font-mono text-[11px] text-muted">
                    TRACK COMPLETE
                  </span>
                  <span className="text-xs font-semibold text-foreground group-hover:underline">
                    Practice coding problems →
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </article>
      </div>
    </div>
  );
}

export default function LessonPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-xs font-mono text-muted">
          Loading lesson…
        </div>
      }
    >
      <LessonContent {...props} />
    </Suspense>
  );
}
