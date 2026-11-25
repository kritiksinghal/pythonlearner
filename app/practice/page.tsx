import type { Metadata } from "next";
import PracticeListClient from "./PracticeListClient";
import { PROBLEMS } from "@/lib/problems";

export const metadata: Metadata = {
  title: "Python Practice Problems | PyLearner",
  description:
    "Practice Python with browser-based coding problems and clear expected-versus-actual test results.",
};

export default function PracticeListPage() {
  const problems = PROBLEMS.map((problem) => ({
    slug: problem.slug,
    title: problem.title,
    track: problem.track,
    difficulty: problem.difficulty,
    testType: problem.testType,
    testCount: problem.tests.length,
  }));

  return <PracticeListClient problems={problems} />;
}
