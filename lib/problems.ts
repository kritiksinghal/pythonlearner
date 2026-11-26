/*
 * lib/problems.ts — problem types and data loading helpers.
 */

import countVowels from "@/content/problems/count-vowels.json";
import findMaximum from "@/content/problems/find-maximum.json";
import greetingCard from "@/content/problems/greeting-card.json";
import formatPhoneNumber from "@/content/problems/format-phone-number.json";
import censorWords from "@/content/problems/censor-words.json";
import groceryCalculator from "@/content/problems/grocery-calculator.json";
import mergeIntervals from "@/content/problems/merge-intervals.json";
import longestUniqueSubstring from "@/content/problems/longest-unique-substring.json";
import groupAnagrams from "@/content/problems/group-anagrams.json";
import topKFrequentWords from "@/content/problems/top-k-frequent-words.json";
import transactionBalances from "@/content/problems/transaction-balances.json";
import flattenNestedList from "@/content/problems/flatten-nested-list.json";
import sumNestedNumbers from "@/content/problems/sum-nested-numbers.json";
import mergeSortRecords from "@/content/problems/merge-sort-records.json";
import rankRunners from "@/content/problems/rank-runners.json";
import orderedCommonItems from "@/content/problems/ordered-common-items.json";
import aggregateSalesByStore from "@/content/problems/aggregate-sales-by-store.json";
import wordFrequencyNormalized from "@/content/problems/word-frequency-normalized.json";
import createUrlSlug from "@/content/problems/create-url-slug.json";
import validateHallPass from "@/content/problems/validate-hall-pass.json";
import summarizeLogLevels from "@/content/problems/summarize-log-levels.json";
import runLengthEncode from "@/content/problems/run-length-encode.json";
import longestPalindromeLength from "@/content/problems/longest-palindrome-length.json";
import balancedBracketsInText from "@/content/problems/balanced-brackets-in-text.json";
import generatorRunningTotals from "@/content/problems/generator-running-totals.json";
import classGradebookReport from "@/content/problems/class-gradebook-report.json";

export interface FunctionTestCase {
  args: unknown[];
  expected: unknown;
  hint?: string;
}

export interface StdioTestCase {
  input: string;
  expectedOutput: string;
  hint?: string;
}

export type TestCase = FunctionTestCase | StdioTestCase;

export interface ProblemSolution {
  code: string;
  explanation: string;
}

export interface Problem {
  slug: string;
  title: string;
  track: "Python from zero" | "CS50P";
  difficulty: "Easy" | "Medium" | "Hard" | "Advanced";
  testType: "function" | "stdio";
  functionName?: string;
  description: string;
  starterCode: string;
  referenceSolution: string;
  solution: ProblemSolution;
  wrongSolutions?: string[];
  relatedLessons?: string[];
  tests: TestCase[];
}

export type PublicProblem = Omit<Problem, "referenceSolution" | "wrongSolutions">;

const rawProblems: Problem[] = [
  countVowels as Problem,
  findMaximum as Problem,
  greetingCard as Problem,
  formatPhoneNumber as Problem,
  censorWords as Problem,
  groceryCalculator as Problem,
  mergeIntervals as Problem,
  longestUniqueSubstring as Problem,
  groupAnagrams as Problem,
  topKFrequentWords as Problem,
  transactionBalances as Problem,
  flattenNestedList as Problem,
  sumNestedNumbers as Problem,
  mergeSortRecords as Problem,
  rankRunners as Problem,
  orderedCommonItems as Problem,
  aggregateSalesByStore as Problem,
  wordFrequencyNormalized as Problem,
  createUrlSlug as Problem,
  validateHallPass as Problem,
  summarizeLogLevels as Problem,
  runLengthEncode as Problem,
  longestPalindromeLength as Problem,
  balancedBracketsInText as Problem,
  generatorRunningTotals as Problem,
  classGradebookReport as Problem,
];

// Only `solution` is public; never serialize reference solutions or wrong solutions.
export const PROBLEMS: PublicProblem[] = rawProblems.map(
  (problem) => {
    const publicProblem = { ...problem };
    Reflect.deleteProperty(publicProblem, "referenceSolution");
    Reflect.deleteProperty(publicProblem, "wrongSolutions");
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

