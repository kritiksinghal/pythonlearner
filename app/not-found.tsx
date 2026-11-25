import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-start justify-center px-4 py-16">
      <p className="font-mono text-xs text-muted">404 / NOT FOUND</p>
      <h1 className="mt-3 font-doto text-3xl font-extrabold text-foreground">That page is missing.</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">The link may be old, or the page may have moved. Head back to the curriculum or practice list.</p>
      <div className="mt-6 flex gap-4 text-sm">
        <Link href="/learn" className="underline underline-offset-4">Browse lessons</Link>
        <Link href="/practice" className="underline underline-offset-4">Practice</Link>
      </div>
    </section>
  );
}
