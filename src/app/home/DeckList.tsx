"use client";

import Link from "next/link";
import { jsonDeckFormat } from "@/classes";
import { buttonStyles } from "@/components/ui";
import { useDecks } from "@/hooks/useDecks";
import { STORAGE_LOCATION_INFO } from "@/storage";

const DeckList = () => {
  const { decks } = useDecks();

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
              href={`/decks/${deck.id}/quiz`}
              className={buttonStyles.primary}
            >
              Study
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DeckList;
