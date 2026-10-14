import { isCardType } from "../Card/CardType";
import type { CardDto } from "../Card/CardDto";
import type { CardContentDto } from "../content/CardContentDto";
import { isContentFormat } from "../content/ContentFormat";
import type { DeckDto } from "../Deck/DeckDto";
import { newId } from "../types";
import type { DeckPlacement } from "./DeckFileFormat";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseContent = (
  value: unknown,
  where: string,
  errors: string[],
): CardContentDto | null => {
  if (!isRecord(value) || typeof value.source !== "string") {
    errors.push(`${where} needs a text "source".`);
    return null;
  }
  if (!isContentFormat(value.format)) {
    errors.push(`${where} has an unknown format "${String(value.format)}".`);
    return null;
  }
  return { format: value.format, source: value.source };
};

const parseCard = (
  value: unknown,
  where: string,
  errors: string[],
): CardDto | null => {
  if (!isRecord(value)) {
    errors.push(`${where} is not an object.`);
    return null;
  }
  if (!isCardType(value.type)) {
    errors.push(`${where} has an unknown type "${String(value.type)}".`);
  }
  const question = parseContent(value.question, `${where} question`, errors);
  const answer = parseContent(value.answer, `${where} answer`, errors);
  if (!isCardType(value.type) || !question || !answer) return null;
  return { id: newId(), type: value.type, question, answer };
};

/**
 * Checks untrusted input (e.g. a user's file) and builds a brand-new DeckDto
 * from it. Only `name` and the cards' content are read: ids and timestamps
 * are freshly generated and placement comes from the caller, so an import can
 * never overwrite an existing deck or claim someone else's ownership.
 */
export const parseDeckDto = (
  value: unknown,
  where: string,
  placement: DeckPlacement,
): { deck: DeckDto | null; errors: string[] } => {
  if (!isRecord(value)) {
    return { deck: null, errors: [`${where} is not an object.`] };
  }

  const errors: string[] = [];
  const name = typeof value.name === "string" ? value.name.trim() : "";
  if (!name) errors.push(`${where} needs a name.`);
  if (!Array.isArray(value.cards)) {
    errors.push(`${where} needs a "cards" list.`);
    return { deck: null, errors };
  }

  const cards = value.cards.map((card: unknown, i) =>
    parseCard(card, `${where}, card ${i + 1}`, errors),
  );
  if (errors.length > 0) return { deck: null, errors };

  const now = Date.now();
  return {
    deck: {
      ...placement,
      id: newId(),
      name,
      cards: cards as CardDto[],
      created_at: now,
      updated_at: now,
    },
    errors,
  };
};
