import type { DeckDto } from "../Deck/DeckDto";
import { downloadFile } from "./downloadFile";

/**
 * Deck fields left out of exported files for now. Remove an entry to start
 * exporting that field (and read it back in parseDeckDto).
 */
export const EXCLUDED_DECK_FIELDS = [
  "id",
  "belongs_to",
  "storage",
  "created_at",
  "updated_at",
] as const satisfies readonly (keyof DeckDto)[];

/** Where imported decks are saved and who owns them. Never taken from the file. */
export type DeckPlacement = Pick<DeckDto, "storage" | "belongs_to">;

export interface ImportResult {
  decks: DeckDto[];
  errors: string[];
}

const withoutExcludedFields = (deck: DeckDto): Partial<DeckDto> => {
  const exported: Partial<DeckDto> = { ...deck };
  for (const field of EXCLUDED_DECK_FIELDS) delete exported[field];
  return exported;
};

/**
 * A file format decks can be exported to and imported from. Subclasses only
 * describe the format (serialize/parse); file handling is shared here.
 */
export abstract class DeckFileFormat {
  abstract readonly label: string;
  abstract readonly extension: string;
  abstract readonly mimeType: string;

  /** Pure: decks (minus {@link EXCLUDED_DECK_FIELDS}) to file contents. */
  abstract serialize(decks: Partial<DeckDto>[]): string;

  /** Pure: file contents to new decks. Must not throw on bad input; report errors instead. */
  abstract parse(text: string, placement: DeckPlacement): ImportResult;

  /** Value for `<input type="file" accept={...}>`. */
  get accept(): string {
    return `.${this.extension},${this.mimeType}`;
  }

  /** Whether this format reads the given file, judged by its extension. */
  handles(file: File): boolean {
    return file.name.toLowerCase().endsWith(`.${this.extension}`);
  }

  export(deck: DeckDto): void {
    downloadFile(
      `${this.slug(deck.name)}.${this.extension}`,
      this.serialize([withoutExcludedFields(deck)]),
      this.mimeType,
    );
  }

  async import(file: File, placement: DeckPlacement): Promise<ImportResult> {
    try {
      return this.parse(await file.text(), placement);
    } catch {
      return { decks: [], errors: [`Could not read "${file.name}".`] };
    }
  }

  private slug(name: string): string {
    const slug = name
      .trim()
      .replace(/[^\w-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || "deck";
  }
}
