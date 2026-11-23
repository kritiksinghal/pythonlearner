/*
 * lib/problems.ts — problem types and data loading helpers.
 */

import countVowels from "@/content/problems/count-vowels.json";
import findMaximum from "@/content/problems/find-maximum.json";
import greetingCard from "@/content/problems/greeting-card.json";
import formatPhoneNumber from "@/content/problems/format-phone-number.json";
import censorWords from "@/content/problems/censor-words.json";
import groceryCalculator from "@/content/problems/grocery-calculator.json";

export interface FunctionTestCase {
  args: any[];
  expected: any;
}

export interface StdioTestCase {
  input: string;
  expectedOutput: string;
}

export type TestCase = FunctionTestCase | StdioTestCase;

export interface Problem {
  slug: string;
  title: string;
  track: "Python from zero" | "CS50P";
  difficulty: "Easy" | "Medium" | "Hard";
  testType: "function" | "stdio";
  functionName?: string;
  description: string;
  starterCode: string;
  referenceSolution: string;
  tests: TestCase[];
}

// All registered problems in order
export const PROBLEMS: Problem[] = [
  countVowels as Problem,
  findMaximum as Problem,
  greetingCard as Problem,
  formatPhoneNumber as Problem,
  censorWords as Problem,
  groceryCalculator as Problem,
];

/** Get all problems, optionally filtered by track */
export function getProblems(track?: string): Problem[] {
  if (!track || track === "All") {
    return PROBLEMS;
  }
  return PROBLEMS.filter((p) => p.track === track);
}

/** Find a problem by slug */
export function getProblemBySlug(slug: string): Problem | undefined {
  return PROBLEMS.find((p) => p.slug === slug);
}
