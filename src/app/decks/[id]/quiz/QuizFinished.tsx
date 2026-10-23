"use client";

import Link from "next/link";
import type { QuizResults } from "@/shared/classes";
import { buttonStyles } from "@/components/ui";

interface QuizFinishedProps {
  results: QuizResults;
  onRestart: () => void;
}

const QuizFinished = ({ results, onRestart }: QuizFinishedProps) => {
  const { definitions, concepts } = results;

  return (
    <div className="flex h-72 w-full flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-md">
      <p className="text-2xl font-semibold">You finished the deck!</p>
      <div className="text-slate-600">
        {definitions.total > 0 && (
          <p>
            Definitions: {definitions.correct} / {definitions.total} correct
          </p>
        )}
        {concepts.averageStars !== null && (
          <p>
            Concepts: {concepts.averageStars.toFixed(1)} ★ average (
            {concepts.total} {concepts.total === 1 ? "card" : "cards"})
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRestart}
          className={buttonStyles.primary}
        >
          Study again
        </button>
        <Link href="/" className={buttonStyles.secondary}>
          Back to decks
        </Link>
      </div>
    </div>
  );
};

export default QuizFinished;
