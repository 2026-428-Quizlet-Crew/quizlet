import type { DeckFileFormat } from "./DeckFileFormat";
import { JsonDeckFormat } from "./JsonDeckFormat";

export const jsonDeckFormat = new JsonDeckFormat();

/** Every supported file format. Add CsvDeckFormat here later. */
export const DECK_FILE_FORMATS: readonly DeckFileFormat[] = [jsonDeckFormat];

/** `accept` value for a file input that takes any supported format. */
export const ACCEPTED_DECK_FILES = DECK_FILE_FORMATS.map(
  (format) => format.accept,
).join(",");

/** The format that reads this file, or null if none does. */
export const formatForFile = (file: File): DeckFileFormat | null =>
  DECK_FILE_FORMATS.find((format) => format.handles(file)) ?? null;
