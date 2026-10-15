"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { type BaseDeck, QuizSession } from "@/shared/classes";
import { type UUID } from "@/shared/types/UUID";
import { Flashcard, QuizControls } from "@/components/quiz";
import FlashcardsFinished from "./FlashcardsFinished";
import { useDeck } from "@/hooks/useDeck";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const FlashcardRunner = ({ deck }: { deck: BaseDeck }) => {
  const [session, setSession] = useState(() => QuizSession.start(deck));

  const flip = useCallback(() => setSession((s) => s.flip()), []);
  const next = useCallback(() => setSession((s) => s.next()), []);
  const previous = useCallback(() => setSession((s) => s.previous()), []);
  const restart = useCallback(() => setSession((s) => s.restart()), []);

  useKeyboardShortcuts(
    useMemo(
      () => ({ " ": flip, ArrowRight: next, ArrowLeft: previous }),
      [flip, next, previous],
    ),
  );

  const card = session.current;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">{deck.name}</h1>
        <Link
          href={`/decks/${deck.id}/edit`}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </Link>
      </div>

      {card ? (
        <Flashcard
          key={card.id}
          card={card}
          revealed={session.revealed}
          onFlip={flip}
        />
      ) : (
        <FlashcardsFinished total={session.total} onRestart={restart} />
      )}

      <QuizControls
        position={Math.min(session.index + 1, session.total)}
        total={session.total}
        hasPrevious={session.hasPrevious}
        hasNext={session.hasNext}
        onPrevious={previous}
        onNext={next}
      />

      <p className="text-center text-xs text-slate-500">
        Click the card or press Space to flip. Use ← and → to move between
        cards.
      </p>
    </div>
  );
};

const Flashcards = ({ deckId }: { deckId: UUID }) => {
  const state = useDeck(deckId);

  if (state.status === "loading") return <p>Loading…</p>;
  if (state.status === "missing") {
    return (
      <p>
        Deck not found.{" "}
        <Link href="/" className="text-blue-600 hover:underline">
          Back to decks
        </Link>
      </p>
    );
  }
  if (state.deck.cards.length === 0) {
    return (
      <p>
        This deck has no cards yet.{" "}
        <Link
          href={`/decks/${deckId}/edit`}
          className="text-blue-600 hover:underline"
        >
          Add some
        </Link>
      </p>
    );
  }
  return <FlashcardRunner deck={state.deck} />;
};

export default Flashcards;
