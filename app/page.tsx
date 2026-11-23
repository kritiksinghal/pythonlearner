import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
      {/* Headline */}
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Learn Python,{" "}
        <span className="text-accent">from zero to advanced</span>
      </h1>

      {/* One-sentence description */}
      <p className="mt-4 text-lg text-muted">
        Free lessons, a built-in code playground, and an AI tutor — everything
        you need to become confident in Python.
      </p>

      {/* Two CTA buttons */}
      <div className="mt-8 flex gap-4">
        <Link
          href="/learn"
          className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Start learning
        </Link>
        <Link
          href="/practice"
          className="rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-surface"
        >
          Practice coding
        </Link>
      </div>
    </section>
  );
}
