"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4 text-[#111418]">
        <title>PyLearner error</title>
        <main className="max-w-lg rounded-lg border border-[#E3E6EB] bg-white p-8 text-center">
          <p className="font-mono text-xs text-[#656B73]">PYLEARNER / ERROR</p>
          <h1 className="mt-3 text-2xl font-semibold">This page hit a problem.</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#656B73]">Try the page again. Your lesson and practice content are still here.</p>
          <button onClick={reset} className="mt-6 rounded-md bg-[#111418] px-4 py-2 text-sm text-white">Try again</button>
        </main>
      </body>
    </html>
  );
}
