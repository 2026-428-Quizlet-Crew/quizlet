"use client";

import { type BaseCard, CARD_TYPE_INFO } from "@/shared/classes";
import { FlipCard } from "./FlipCard";

interface FlashcardProps {
  card: BaseCard;
  revealed: boolean;
  onFlip: () => void;
}

/**
 * Shows the question; flips to show the answer when clicked. Render with
 * `key={card.id}` so moving to another card doesn't animate (and briefly
 * reveal) the new card's answer.
 */
export const Flashcard = ({ card, revealed, onFlip }: FlashcardProps) => {
  return (
    <FlipCard
      badge={CARD_TYPE_INFO[card.type].label}
      front={card.question.render()}
      back={card.answer.render()}
      revealed={revealed}
      onFlip={onFlip}
    />
  );
};
