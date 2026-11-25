import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PyLearner",
  description:
    "Learn about PyLearner, its browser-only Python runner, content sources, and open-source credits.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">ABOUT</p>
      <h1 className="font-doto text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">About PyLearner</h1>

      <section className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
        <h2 className="text-lg font-semibold text-foreground">What this site is</h2>
        <p>PyLearner is a free Python learning site with a beginner-to-advanced curriculum, quizzes, and practice problems.</p>
        <p>Python code runs in your browser, nothing you type is sent to a server, no tracking.</p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-muted">
        <h2 className="text-lg font-semibold text-foreground">Credits and licenses</h2>
        <ul className="list-disc space-y-3 pl-5">
          <li>Python behavior and language documentation: <a className="underline underline-offset-4 hover:text-foreground" href="https://docs.python.org/3.12/">Python 3.12 documentation</a>.</li>
          <li>In-browser Python runtime: <a className="underline underline-offset-4 hover:text-foreground" href="https://pyodide.org/">Pyodide 0.26.4</a>.</li>
          <li>Code editor: <a className="underline underline-offset-4 hover:text-foreground" href="https://microsoft.github.io/monaco-editor/">Monaco Editor</a>, provided through <a className="underline underline-offset-4 hover:text-foreground" href="https://github.com/suren-atoyan/monaco-react">@monaco-editor/react</a>.</li>
          <li>Fonts: Doto, Hanken Grotesk, and JetBrains Mono are each licensed under the <a className="underline underline-offset-4 hover:text-foreground" href="https://openfontlicense.org/">SIL Open Font License, Version 1.1</a>.</li>
          <li>CS50P lessons are based on Harvard&apos;s CS50P, used under its <a className="underline underline-offset-4 hover:text-foreground" href="https://cs50.harvard.edu/python/license/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)</a> license.</li>
        </ul>
      </section>
    </article>
  );
}
