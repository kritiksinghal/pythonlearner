/*
 * components/DotGridGlyph.tsx
 *
 * Our brand mark: a clean dot-grid glyph inside a rounded tile,
 * featuring a single Python yellow accent dot. (No snake).
 */

export default function DotGridGlyph() {
  // A 5x4 matrix of dots; dot at row 2, col 2 is our single yellow accent
  const rows = 4;
  const cols = 5;

  return (
    <div
      className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface p-3 shadow-xs"
      aria-label="PyLearner mark"
    >
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: rows * cols }).map((_, i) => {
          const isYellow = i === 7; // Center accent dot
          return (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                isYellow
                  ? "bg-accent scale-125"
                  : "bg-muted/30 dark:bg-muted/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
