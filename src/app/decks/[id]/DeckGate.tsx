"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { type BaseDeck } from "@/shared/classes";
import { type UUID } from "@/shared/types/UUID";
import { useDeck } from "@/hooks/useDeck";

interface DeckGateProps {
  deckId: UUID;
  /** Rendered once the deck has loaded and has at least one card. */
  children: (deck: BaseDeck) => ReactNode;
}

/** Loads a deck to study, showing loading, missing, error and empty states. */
const DeckGate = ({ deckId, children }: DeckGateProps) => {
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
  if (state.status === "error") {
    return (
      <p role="alert">
        Could not load deck: {state.message}.{" "}
        <Link href="/" className="text-blue-600 hover:underline">
          Back to decks
        </Link>
      </p>
    );
  }
  if (state.status === "ready" && state.deck.cards.length === 0) {
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
  if (state.status === "ready") {
    return children(state.deck);
  }
};

export default DeckGate;
