"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui";

interface QuizFinishedProps {
  total: number;
  onRestart: () => void;
}

const FlashcardsFinished = ({ total, onRestart }: QuizFinishedProps) => {
  return (
    <div className="flex h-72 w-full flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-md">
      <p className="text-2xl font-semibold">You finished the deck!</p>
      <p className="text-slate-600">
        You went through all {total} {total === 1 ? "card" : "cards"}.
      </p>
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

export default FlashcardsFinished;
