"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { useCurrentUser } from "@/auth/AuthProvider";
import {
  ACCEPTED_DECK_FILES,
  DECK_FILE_FORMATS,
  Deck,
  formatForFile,
} from "@/classes";
import { buttonStyles } from "@/components/ui";
import {
  STORAGE_LOCATION_INFO,
  type StorageLocation,
  useDeckService,
} from "@/storage";

const SUPPORTED = DECK_FILE_FORMATS.map((format) => format.label).join(", ");

const DeckImporter = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const service = useDeckService();
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [imported, setImported] = useState(0);
  const [busy, setBusy] = useState(false);
  // Changing the key remounts the file input, clearing its selection.
  const [pickerKey, setPickerKey] = useState(0);

  const chooseFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setErrors([]);
    setImported(0);
  };

  const importTo = async (storage: StorageLocation) => {
    if (!file) return;
    const format = formatForFile(file);
    if (!format) {
      setErrors([`"${file.name}" isn't a supported file (${SUPPORTED}).`]);
      return;
    }

    setBusy(true);
    try {
      const result = await format.import(file, {
        storage,
        belongs_to: user?.id ?? null,
      });
      for (const dto of result.decks) {
        await service.save(Deck.fromDto(dto));
      }
      if (result.decks.length === 0 && result.errors.length === 0) {
        result.errors.push("The file doesn't contain any decks.");
      }
      if (result.errors.length === 0) {
        router.push("/");
        return;
      }
      setImported(result.decks.length);
      setErrors(result.errors);
      if (result.decks.length > 0) {
        // Some decks were saved; clear the file so they can't be imported twice.
        setFile(null);
        setPickerKey((key) => key + 1);
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : String(error)]);
    }
    setBusy(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Import deck</h1>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          Deck file ({SUPPORTED}) exported from Quizlet BB
        </span>
        <input
          key={pickerKey}
          type="file"
          accept={ACCEPTED_DECK_FILES}
          onChange={chooseFile}
          className="rounded-md border border-slate-300 bg-white p-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1"
        />
      </label>

      {imported > 0 && (
        <p className="text-sm text-slate-700">
          Imported {imported} {imported === 1 ? "deck" : "decks"}; the problems
          below were skipped.{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Back to decks
          </Link>
        </p>
      )}

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

      <div className="flex flex-wrap gap-2">
        {service.locations.map((location) => (
          <button
            key={location}
            type="button"
            disabled={!file || busy}
            onClick={() => importTo(location)}
            className={buttonStyles.primary}
          >
            {STORAGE_LOCATION_INFO[location].saveLabel}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeckImporter;
