"use client";

import Link from "next/link";
import { jsonDeckFormat } from "@/shared/classes";
import { buttonStyles } from "@/components/ui";
import { useDeckList } from "@/hooks/useDeckList";
import { STORAGE_LOCATION_INFO } from "@/shared/types/StorageLocation";

const DeckList = () => {
  const { decks } = useDeckList();

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
              onClick={() => jsonDeckFormat.export(deck.toDto())}
              className={buttonStyles.danger}
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
  );
};

export default DeckList;
