/*
 * /practice/[slug] — Problem page
 *
 * Wrapped in Suspense per Next.js App Router streaming conventions.
 */

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PROBLEMS, getProblemBySlug } from "@/lib/problems";
import ProblemClient from "./ProblemClient";

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  return {
    title: problem ? `${problem.title} | Practice problem` : "Practice problem",
    description: problem
      ? `Practice ${problem.title} in Python and check your solution against ${problem.tests.length} test cases in your browser.`
      : "Solve Python practice problems in your browser.",
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function ProblemContent({ params }: PageProps) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  return <ProblemClient problem={problem} />;
}

export default function ProblemPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 text-center text-sm text-muted">
          Loading problem…
        </div>
      }
    >
      <ProblemContent {...props} />
    </Suspense>
  );
}
