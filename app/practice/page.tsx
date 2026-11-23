/*
 * /practice — Problem List Page
 *
 * Displays all available Python problems with track filtering.
 * Each card shows the problem title, track, difficulty, and links to /practice/[slug].
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { PROBLEMS } from "@/lib/problems";

const TRACKS = ["All", "Python from zero", "CS50P"] as const;

export default function PracticeListPage() {
  const [selectedTrack, setSelectedTrack] = useState<string>("All");

  const filteredProblems =
    selectedTrack === "All"
      ? PROBLEMS
      : PROBLEMS.filter((p) => p.track === selectedTrack);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Practice Problems</h1>
        <p className="mt-2 text-muted">
          Strengthen your Python skills with hands-on challenges tested against
          comprehensive hidden test cases.
        </p>
      </div>

      {/* Track Filter Buttons */}
      <div className="mb-8 flex flex-wrap gap-2.5 border-b border-border pb-4">
        {TRACKS.map((track) => {
          const isActive = selectedTrack === track;
          return (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "border border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {track === "All" ? "All Tracks" : track}
              <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs dark:bg-white/10">
                {track === "All"
                  ? PROBLEMS.length
                  : PROBLEMS.filter((p) => p.track === track).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Problem Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProblems.map((problem) => (
          <Link
            key={problem.slug}
            href={`/practice/${problem.slug}`}
            className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-accent hover:shadow-md"
          >
            <div>
              {/* Badges: Track + Difficulty */}
              <div className="flex items-center justify-between gap-2">
                <span className="rounded bg-code-bg px-2.5 py-0.5 text-xs font-medium text-muted">
                  {problem.track}
                </span>

                <span
                  className={`rounded px-2 py-0.5 text-xs font-semibold ${
                    problem.difficulty === "Easy"
                      ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300"
                      : problem.difficulty === "Medium"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              {/* Title */}
              <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground group-hover:text-accent">
                {problem.title}
              </h2>

              {/* Short meta description */}
              <p className="mt-1 line-clamp-2 text-xs text-muted">
                {problem.description.replace(/[#*`_]/g, "").slice(0, 100)}…
              </p>
            </div>

            {/* Footer: test type and test case count */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
              <span>
                {problem.testType === "function" ? "Function test" : "Standard I/O"}
              </span>
              <span>{problem.tests.length} tests</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
