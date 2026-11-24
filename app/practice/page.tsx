/*
 * /practice — Problem List Page
 *
 * Restyled with a technical ruled list layout (title, track, difficulty on one line per problem).
 * No soft card grids. Clean hairline borders and plenty of space.
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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-mono text-muted mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>CURATED CHALLENGES</span>
        </div>
        <h1 className="font-doto text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          PRACTICE PROBLEMS
        </h1>
        <p className="mt-2 text-sm text-muted max-w-xl leading-relaxed">
          Solve real coding challenges tested against 10–15 hidden test cases.
          Runs entirely in your browser via Pyodide.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {TRACKS.map((track) => {
          const isActive = selectedTrack === track;
          const count =
            track === "All"
              ? PROBLEMS.length
              : PROBLEMS.filter((p) => p.track === track).length;

          return (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              <span>{track === "All" ? "All Tracks" : track}</span>
              <span
                className={`rounded px-1.5 py-0.2 text-[10px] font-mono ${
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-code-bg text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ruled List of Problems */}
      <div className="border-y border-border divide-y divide-border">
        {filteredProblems.map((problem) => (
          <Link
            key={problem.slug}
            href={`/practice/${problem.slug}`}
            className="group flex flex-col justify-between gap-3 py-4.5 px-3 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:gap-6"
          >
            {/* Left: Problem Title & Test Type */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="hidden font-mono text-xs text-muted group-hover:text-accent sm:inline">
                →
              </span>
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-foreground">
                  {problem.title}
                </h2>
                <span className="font-mono text-[11px] text-muted">
                  {problem.testType === "function" ? "function call" : "standard I/O"}
                </span>
              </div>
            </div>

            {/* Right: Track name, test count, difficulty badge */}
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="text-xs text-muted font-mono">
                {problem.track}
              </span>

              <span className="font-mono text-xs text-muted">
                {problem.tests.length} tests
              </span>

              <span
                className={`rounded border px-2 py-0.5 font-mono text-[11px] font-semibold ${
                  problem.difficulty === "Easy"
                    ? "border-green-200 bg-green-50/80 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                    : problem.difficulty === "Medium"
                      ? "border-amber-200 bg-amber-50/80 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                      : "border-red-200 bg-red-50/80 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
