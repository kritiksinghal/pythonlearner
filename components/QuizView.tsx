/*
 * components/QuizView.tsx
 *
 * Interactive quiz component:
 * - One question at a time
 * - Disciplined hairline borders, quiet typography
 * - Dark button with yellow accent mark
 * - Displays correct/incorrect feedback with detailed explanation
 * - Advances with "Next"
 * - Displays final score and a "Retry" button
 */

"use client";

import { useState } from "react";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Props {
  questions: QuizQuestion[];
}

export default function QuizView({ questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentIndex];
  const isCorrect = selectedOption === currentQ.correctIndex;

  const handleCheck = () => {
    if (selectedOption === null) return;
    setIsChecked(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setScore(0);
    setIsFinished(false);
  };

  // ── Final Results View ──
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <div className="font-doto text-2xl font-bold tracking-tight text-foreground">
          QUIZ COMPLETE
        </div>
        <p className="mt-2 text-sm text-muted">
          You scored{" "}
          <span className="font-semibold text-foreground">
            {score} of {questions.length}
          </span>{" "}
          ({percentage}%)
        </p>

        <div className="mt-6">
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Retry Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  // ── Question View ──
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      {/* Progress & Header */}
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3 text-xs font-mono text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span>KNOWLEDGE CHECK</span>
        </span>
        <span>
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Question prompt */}
      <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
        {currentQ.question}
      </h3>

      {/* 4 Options */}
      <div className="mt-5 space-y-2">
        {currentQ.options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const isThisCorrect = i === currentQ.correctIndex;

          let optionStyle =
            "border-border bg-surface hover:border-muted text-foreground";

          if (isChecked) {
            if (isThisCorrect) {
              optionStyle =
                "border-green-300 bg-green-50 text-green-950 font-medium dark:bg-green-950/40 dark:text-green-200 dark:border-green-800";
            } else if (isSelected && !isThisCorrect) {
              optionStyle =
                "border-red-300 bg-red-50 text-red-950 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800";
            } else {
              optionStyle = "border-border bg-surface/50 text-muted opacity-50";
            }
          } else if (isSelected) {
            optionStyle =
              "border-foreground bg-foreground/5 text-foreground ring-1 ring-foreground";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={isChecked}
              onClick={() => setSelectedOption(i)}
              className={`flex w-full items-center justify-between rounded-md border p-3 text-left text-xs transition-all sm:text-sm ${optionStyle}`}
            >
              <span>{opt}</span>
              {isChecked && isThisCorrect && (
                <span className="ml-2 font-mono text-xs font-bold text-green-600 dark:text-green-400">
                  ✓
                </span>
              )}
              {isChecked && isSelected && !isThisCorrect && (
                <span className="ml-2 font-mono text-xs font-bold text-red-600 dark:text-red-400">
                  ✗
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Check / Next Buttons */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        {!isChecked ? (
          <button
            onClick={handleCheck}
            disabled={selectedOption === null}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Check Answer</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            <span>
              {currentIndex < questions.length - 1 ? "Next Question →" : "See Results"}
            </span>
          </button>
        )}
      </div>

      {/* Explanation Box (revealed after Check) */}
      {isChecked && (
        <div
          className={`mt-4 rounded-md border p-3.5 text-xs leading-relaxed ${
            isCorrect
              ? "border-green-200 bg-green-50/70 text-green-950 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-200"
              : "border-amber-200 bg-amber-50/70 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
          }`}
        >
          <div className="font-semibold mb-1">
            {isCorrect ? "Correct ✓" : "Explanation 💡"}
          </div>
          <p>{currentQ.explanation}</p>
        </div>
      )}
    </div>
  );
}
