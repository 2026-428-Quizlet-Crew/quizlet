"use client";

import { buttonStyles } from "@/components/ui";

interface CorrectnessGradeProps {
  correct: boolean | null;
  onChange: (correct: boolean) => void;
}

const selected = "ring-2 ring-blue-500 ring-offset-1";

/** "Did you get it right?" Yes/No, for overriding an auto-graded answer. */
export const CorrectnessGrade = ({
  correct,
  onChange,
}: CorrectnessGradeProps) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-sm text-slate-700">Did you get it right?</span>
      <button
        type="button"
        aria-pressed={correct === true}
        onClick={() => onChange(true)}
        className={`${buttonStyles.secondary} ${correct === true ? `${selected} bg-green-50 text-green-800` : ""}`}
      >
        Yes
      </button>
      <button
        type="button"
        aria-pressed={correct === false}
        onClick={() => onChange(false)}
        className={`${buttonStyles.secondary} ${correct === false ? `${selected} bg-red-50 text-red-800` : ""}`}
      >
        No
      </button>
    </div>
  );
};
