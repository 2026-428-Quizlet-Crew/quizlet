"use client";

import { useState } from "react";
import Link from "next/link";
import { jsonDeckFormat, type BaseDeck } from "@/shared/classes";
import { buttonStyles, ConfirmDialog } from "@/components/ui";
import { useDeckList } from "@/hooks/useDeckList";
import { useDeleteDeck } from "@/hooks/useDeleteDeck";
import { STORAGE_LOCATION_INFO } from "@/shared/types/StorageLocation";

const DeckList = () => {
  const { decks } = useDeckList();
  const deleteDeck = useDeleteDeck();
  const [confirmingDeck, setConfirmingDeck] = useState<BaseDeck | null>(null);

  if (decks === null) return <p>Loading decks…</p>;
  if (decks.length === 0) {
    return (
      <p className="text-slate-600">
        No decks yet.{" "}
        <Link href="/decks/new" className="text-blue-600 hover:underline">
          Create your first one
        </Link>
        .
      </p>
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {decks.map((deck) => (
          <li
            key={deck.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-semibold">{deck.name}</p>
              <p className="text-sm text-slate-500">
                {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"} ·{" "}
                {STORAGE_LOCATION_INFO[deck.storage].label}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmingDeck(deck)}
                className={buttonStyles.danger}
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => jsonDeckFormat.export(deck.toDto())}
                className={buttonStyles.secondary}
              >
                Export
              </button>
              <Link
                href={`/decks/${deck.id}/edit`}
                className={buttonStyles.secondary}
              >
                Edit
              </Link>
              <Link
                href={`/decks/${deck.id}/flashcards`}
                className={buttonStyles.primary}
              >
                Flashcards
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {confirmingDeck && (
        <ConfirmDialog
          message={`Delete "${confirmingDeck.name}"? This can't be undone.`}
          onConfirm={() => {
            deleteDeck(confirmingDeck);
            setConfirmingDeck(null);
          }}
          onCancel={() => setConfirmingDeck(null)}
        />
      )}
    </>
  );
};

export default DeckList;
