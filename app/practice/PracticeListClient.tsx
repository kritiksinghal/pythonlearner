"use client";

import { useState } from "react";
import Link from "next/link";

type ListingProblem = {
  slug: string;
  title: string;
  track: "Python from zero" | "CS50P";
  difficulty: "Easy" | "Medium" | "Hard";
  testType: "function" | "stdio";
  testCount: number;
};

export default function PracticeListClient({ problems }: { problems: ListingProblem[] }) {
  const [selectedTrack, setSelectedTrack] = useState<string>("All");
  const tracks = ["All", ...Array.from(new Set(problems.map((problem) => problem.track)))];
  const filteredProblems = selectedTrack === "All"
    ? problems
    : problems.filter((problem) => problem.track === selectedTrack);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2 text-xs font-mono text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>CURATED CHALLENGES</span>
        </div>
        <h1 className="font-doto text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          PRACTICE PROBLEMS
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Solve Python coding challenges and see each failed test&apos;s expected
          output beside what your code returned. Python runs in your browser.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {tracks.map((track) => {
          const isActive = selectedTrack === track;
          const count = track === "All"
            ? problems.length
            : problems.filter((problem) => problem.track === track).length;

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
              <span className={`rounded px-1.5 py-0.2 text-[10px] font-mono ${
                isActive ? "bg-background/20 text-background" : "bg-code-bg text-muted"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="divide-y divide-border border-y border-border">
        {filteredProblems.map((problem) => (
          <Link
            key={problem.slug}
            href={`/practice/${problem.slug}`}
            className="group flex flex-col justify-between gap-3 px-3 py-4.5 transition-colors hover:bg-surface sm:flex-row sm:items-center sm:gap-6"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="hidden font-mono text-xs text-muted group-hover:text-accent sm:inline">→</span>
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-foreground">{problem.title}</h2>
                <span className="font-mono text-[11px] text-muted">
                  {problem.testType === "function" ? "function call" : "standard I/O"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="font-mono text-xs text-muted">{problem.track}</span>
              <span className="font-mono text-xs text-muted">{problem.testCount} tests</span>
              <span className={`rounded border px-2 py-0.5 font-mono text-[11px] font-semibold ${
                problem.difficulty === "Easy"
                  ? "border-green-200 bg-green-50/80 text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
                  : problem.difficulty === "Medium"
                    ? "border-amber-200 bg-amber-50/80 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                    : "border-red-200 bg-red-50/80 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              }`}>
                {problem.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
