"use client";

import type { ReactNode } from "react";
import { type BaseCard, CARD_TYPE_INFO } from "@/shared/classes";

interface FaceProps {
  side: string;
  badge: string;
  back?: boolean;
  children: ReactNode;
}

interface FlashcardProps {
  card: BaseCard;
  revealed: boolean;
  onFlip: () => void;
}

const Face = ({ side, badge, back = false, children }: FaceProps) => {
  return (
    <div
      className={`absolute inset-0 flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-md backface-hidden ${back ? "rotate-y-180" : ""}`}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-800">
          {badge}
        </span>
        <span className="uppercase tracking-wide text-slate-400">{side}</span>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto text-center text-xl">
        {children}
      </div>
    </div>
  );
};

/**
 * Shows the question; flips to show the answer when clicked. Render with
 * `key={card.id}` so moving to another card doesn't animate (and briefly
 * reveal) the new card's answer.
 */
export const Flashcard = ({ card, revealed, onFlip }: FlashcardProps) => {
  const badge = CARD_TYPE_INFO[card.type].label;

  return (
    <div className="h-72 w-full perspective-[1200px]">
      <div
        role="button"
        tabIndex={0}
        aria-label={revealed ? "Show question" : "Show answer"}
        onClick={onFlip}
        onKeyDown={(e) => {
          if (e.key === "Enter") onFlip();
        }}
        className={`relative h-full w-full cursor-pointer rounded-xl transition-transform duration-500 transform-3d ${revealed ? "rotate-y-180" : ""}`}
      >
        <Face side="Question" badge={badge}>
          {card.question.render()}
        </Face>
        <Face side="Answer" badge={badge} back>
          {card.answer.render()}
        </Face>
      </div>
    </div>
  );
};
