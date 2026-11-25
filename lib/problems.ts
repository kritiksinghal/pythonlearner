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
  args: unknown[];
  expected: unknown;
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

export type PublicProblem = Omit<Problem, "referenceSolution">;

const rawProblems: Problem[] = [
  countVowels as Problem,
  findMaximum as Problem,
  greetingCard as Problem,
  formatPhoneNumber as Problem,
  censorWords as Problem,
  groceryCalculator as Problem,
];

// Keep reference solutions on the server side and never serialize them to a client component.
export const PROBLEMS: PublicProblem[] = rawProblems.map(
  (problem) => {
    const publicProblem = { ...problem };
    Reflect.deleteProperty(publicProblem, "referenceSolution");
    return publicProblem;
  }
);

/** Get all problems, optionally filtered by track */
export function getProblems(track?: string): PublicProblem[] {
  if (!track || track === "All") {
    return PROBLEMS;
  }
  return PROBLEMS.filter((p) => p.track === track);
}

/** Find a problem by slug */
export function getProblemBySlug(slug: string): PublicProblem | undefined {
  return PROBLEMS.find((p) => p.slug === slug);
}
