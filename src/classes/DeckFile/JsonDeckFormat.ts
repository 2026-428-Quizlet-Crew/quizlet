import type { DeckDto } from "../Deck/DeckDto";
import {
  DeckFileFormat,
  type DeckPlacement,
  type ImportResult,
} from "./DeckFileFormat";
import { parseDeckDto } from "./parseDeckDto";

const CURRENT_VERSION = 1;

interface JsonDeckFileDto {
  version: number;
  decks: Partial<DeckDto>[];
}

const failure = (message: string): ImportResult => ({
  decks: [],
  errors: [message],
});

export class JsonDeckFormat extends DeckFileFormat {
  readonly label = "JSON";
  readonly extension = "json";
  readonly mimeType = "application/json";

  serialize(decks: Partial<DeckDto>[]): string {
    const file: JsonDeckFileDto = { version: CURRENT_VERSION, decks };
    return JSON.stringify(file, null, 2);
  }

  parse(text: string, placement: DeckPlacement): ImportResult {
    let file: unknown;
    try {
      file = JSON.parse(text);
    } catch {
      return failure("The file is not valid JSON.");
    }

    if (typeof file !== "object" || file === null) {
      return failure("The file does not contain a deck export.");
    }
    const { version, decks } = file as Partial<
      Record<keyof JsonDeckFileDto, unknown>
    >;
    if (version !== CURRENT_VERSION) {
      return failure(`Unsupported file version: ${String(version)}.`);
    }
    if (!Array.isArray(decks)) return failure(`"decks" must be a list.`);

    const result: ImportResult = { decks: [], errors: [] };
    decks.forEach((raw: unknown, i) => {
      const { deck, errors } = parseDeckDto(raw, `Deck ${i + 1}`, placement);
      if (deck) result.decks.push(deck);
      result.errors.push(...errors);
    });
    return result;
  }
}
