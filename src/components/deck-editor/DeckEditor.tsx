"use client";

import Link from "next/link";
import type { UUID } from "@/shared/types/UUID";
import DeckForm from "./DeckForm";
import { useDeck } from "@/hooks/useDeck";

interface DeckEditorProps {
  /** Omit to create a new deck. */
  deckId?: UUID;
}

const ExistingDeckEditor = ({ deckId }: { deckId: UUID }) => {
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
  if (state.status === "ready") {
    return <DeckForm existing={state.deck} />;
  }
};

/** Create/edit page body. Shared by /decks/new and /decks/[id]/edit. */
const DeckEditor = ({ deckId }: DeckEditorProps) => {
  return deckId ? <ExistingDeckEditor deckId={deckId} /> : <DeckForm />;
};

export default DeckEditor;
