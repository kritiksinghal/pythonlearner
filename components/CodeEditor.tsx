/*
 * CodeEditor.tsx — Monaco editor wrapper for writing Python code.
 *
 * Uses @monaco-editor/react. Adapts to dark/light mode automatically.
 * The parent controls the value via `code` and `onChange`.
 */

"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

interface Props {
  code: string;
  onChange: (value: string) => void;
  height?: string;
}

export default function CodeEditor({ code, onChange, height = "350px" }: Props) {
  // Detect dark mode so we can tell Monaco which theme to use
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check the system color scheme
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);

    // Update if the user switches mode
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Editor
        height={height}
        language="python"
        theme={isDark ? "vs-dark" : "light"}
        value={code}
        onChange={(value) => onChange(value ?? "")}
        options={{
          fontSize: 14,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          tabSize: 4,
          wordWrap: "on",
          padding: { top: 12, bottom: 12 },
        }}
        loading={
          <div
            style={{ height }}
            className="flex items-center justify-center text-muted"
          >
            Loading editor…
          </div>
        }
      />
    </div>
  );
}
