"use client";

import { buttonStyles } from "@/components/ui";

interface QuizControlsProps {
  position: number;
  total: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const QuizControls = ({
  position,
  total,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: QuizControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-6">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPrevious}
        aria-label="Previous card"
        className={`${buttonStyles.secondary} w-12 text-lg`}
      >
        ←
      </button>
      <span className="min-w-16 text-center text-sm tabular-nums text-slate-600">
        {position} / {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next card"
        className={`${buttonStyles.secondary} w-12 text-lg`}
      >
        →
      </button>
    </div>
  );
};
