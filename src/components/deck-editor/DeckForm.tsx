"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { type CardDto, BaseDeck } from "@/shared/classes";
import CardEditor from "./CardEditor";
import { DeckDraft, emptyCardDto } from "./DeckDraft";
import { buttonStyles } from "@/components/ui";
import {
  STORAGE_LOCATION_INFO,
  type StorageLocation,
} from "@/shared/types/StorageLocation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDeleteDeck } from "@/hooks/useDeleteDeck";
import { useSaveDeck } from "@/hooks/useSaveDeck";
import { useStorageLocations } from "@/hooks/useStorageLocations";

interface DeckFormProps {
  /** The deck being edited, or undefined when creating a new one. */
  existing?: BaseDeck;
}

const DeckForm = ({ existing }: DeckFormProps) => {
  const router = useRouter();
  const user = useCurrentUser();
  const locations = useStorageLocations();
  const saveDeck = useSaveDeck();
  const deleteDeck = useDeleteDeck();
  const [draft, setDraft] = useState<DeckDraft>(() =>
    existing ? DeckDraft.fromDeck(existing) : DeckDraft.empty(),
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const updateCard = (index: number, card: CardDto) =>
    setDraft((d) => ({ ...d, cards: d.cards.with(index, card) }));

  const removeCard = (index: number) =>
    setDraft((d) => ({ ...d, cards: d.cards.toSpliced(index, 1) }));

  const addCard = () =>
    setDraft((d) => ({ ...d, cards: [...d.cards, emptyCardDto()] }));

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
      router.push("/");
    } catch (error) {
      setErrors([error instanceof Error ? error.message : String(error)]);
      setBusy(false);
    }
  };

  const save = (storage: StorageLocation) => {
    const problems = DeckDraft.validate(draft);
    setErrors(problems);
    if (problems.length > 0) return;

    const changes = {
      name: draft.name.trim(),
      cards: DeckDraft.toCards(draft),
    };
    const deck = existing
      ? existing.update({ ...changes, storage })
      : BaseDeck.create({ ...changes, storage, belongs_to: user?.id ?? null });

    run(() => saveDeck(deck, existing?.storage));
  };

  const remove = () => {
    if (!existing) return;
    if (!window.confirm(`Delete "${existing.name}"? This can't be undone.`)) {
      return;
    }
    run(() => deleteDeck(existing));
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
      <h1 className="text-2xl font-bold">
        {existing ? "Edit deck" : "Create a deck"}
      </h1>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Deck name</span>
        <input
          className="rounded-md border border-slate-300 bg-white px-3 py-2"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          placeholder="e.g. Biology chapter 3"
        />
      </label>

      <ol className="flex flex-col gap-4">
        {draft.cards.map((card, i) => (
          <CardEditor
            key={card.id}
            index={i}
            card={card}
            onChange={(updated) => updateCard(i, updated)}
            onRemove={() => removeCard(i)}
          />
        ))}
      </ol>

      <button
        type="button"
        onClick={addCard}
        className={buttonStyles.secondary}
      >
        + Add card
      </button>

      {errors.length > 0 && (
        <ul
          role="alert"
          className="list-inside list-disc rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {locations.map((location) => (
          <button
            key={location}
            type="button"
            disabled={busy}
            onClick={() => save(location)}
            className={buttonStyles.primary}
          >
            {STORAGE_LOCATION_INFO[location].saveLabel}
          </button>
        ))}
        {existing && (
          <button
            type="button"
            disabled={busy}
            onClick={remove}
            className={`${buttonStyles.danger} ml-auto`}
          >
            Delete deck
          </button>
        )}
      </div>
    </form>
  );
};

export default DeckForm;
