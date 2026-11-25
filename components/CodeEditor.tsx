/*
 * CodeEditor.tsx — Monaco editor wrapper for writing Python code.
 *
 * Uses @monaco-editor/react. Adapts to dark/light mode automatically.
 * The parent controls the value via `code` and `onChange`.
 */

"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Editor, { loader } from "@monaco-editor/react";

const MONACO_VS_CDN = "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs";
loader.config({ paths: { vs: MONACO_VS_CDN } });

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
function subscribeToColorScheme(onChange: () => void) {
  const query = window.matchMedia(COLOR_SCHEME_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function getColorScheme() {
  return window.matchMedia(COLOR_SCHEME_QUERY).matches;
}
function getServerColorScheme() {
  return false;
}

interface Props {
  code: string;
  onChange: (value: string) => void;
  height?: string;
}

export default function CodeEditor({ code, onChange, height = "350px" }: Props) {
  // Detect dark mode so we can tell Monaco which theme to use
  const isDark = useSyncExternalStore(subscribeToColorScheme, getColorScheme, getServerColorScheme);
  const [loadError, setLoadError] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (!cancelled) setLoadError(true);
    }, 15000);

    loader.init().then(() => {
      if (!cancelled) {
        window.clearTimeout(timeout);
        setEditorReady(true);
      }
    }).catch(() => {
      if (!cancelled) {
        window.clearTimeout(timeout);
        setLoadError(true);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface p-6 text-center" style={{ height }}>
        <p className="max-w-sm text-sm text-muted">
          The code editor could not load. Check your connection, then retry.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-90"
        >
          Retry editor
        </button>
      </div>
    );
  }

  if (!editorReady) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border text-sm text-muted" style={{ height }}>
        Loading editor…
      </div>
    );
  }

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
