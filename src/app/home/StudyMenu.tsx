"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui";
import { type UUID } from "@/shared/types/UUID";

const itemStyles = "block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100";


const StudyMenu = ({ deckId }: { deckId: UUID }) => {
  return (
    <details name="study-menu" className="relative">
      <summary
        className={`${buttonStyles.primary} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
      >
        Study ▾
      </summary>
      <div className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg">
        <Link href={`/decks/${deckId}/quiz`} className={itemStyles}>
          Quiz
        </Link>
        <Link href={`/decks/${deckId}/flashcards`} className={itemStyles}>
          Flashcards
        </Link>
      </div>
    </details>
  );
};

export default StudyMenu;
