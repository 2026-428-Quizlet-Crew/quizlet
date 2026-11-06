import type { DeckDto } from "../Deck/DeckDto";
import { JsonDeckFormat } from "./JsonDeckFormat";
import { downloadFile } from "./downloadFile";

jest.mock("./downloadFile", () => ({ downloadFile: jest.fn() }));

const download = jest.mocked(downloadFile);
const format = new JsonDeckFormat();

const makeDeck = (): DeckDto => ({
  id: "original-deck",
  name: "Biology chapter 3",
  belongs_to: "original-owner",
  storage: "cloud",
  created_at: 100,
  updated_at: 200,
  cards: [
    {
      id: "original-card",
      type: "concept",
      question: { format: "markdown", source: '**Cell** means?\n"Explain"' },
      answer: { format: "plain", source: "A basic unit of life — 細胞 🧬" },
    },
    {
      id: "second-card",
      type: "definition",
      question: { format: "code", source: "const cell = {};" },
      answer: { format: "latex", source: "x^{2}" },
    },
  ],
});

beforeEach(() => {
  download.mockClear();
});

describe("JSON deck export", () => {
  test("downloads versioned JSON preserving the deck name and all card content", () => {
    const deck = makeDeck();

    format.export(deck);

    expect(download).toHaveBeenCalledTimes(1);
    const [filename, text, mimeType] = download.mock.calls[0];
    expect(filename).toBe("Biology-chapter-3.json");
    expect(mimeType).toBe("application/json");
    expect(JSON.parse(text)).toEqual({
      version: 1,
      decks: [{ name: deck.name, cards: deck.cards }],
    });
  });

  test("leaves the original deck unchanged when excluding metadata", () => {
    const deck = makeDeck();
    const original = structuredClone(deck);

    format.export(deck);

    expect(deck).toEqual(original);
    const exported = JSON.parse(download.mock.calls[0][1]).decks[0];
    for (const field of [
      "id",
      "belongs_to",
      "storage",
      "created_at",
      "updated_at",
    ]) {
      expect(exported).not.toHaveProperty(field);
    }
  });

  test.each([
    ["  Biology: chapter / 3?!  ", "Biology-chapter-3.json"],
    ["?! /", "deck.json"],
    ["", "deck.json"],
  ])("exports deck name %j with filename %s", (name, filename) => {
    format.export({ ...makeDeck(), name });

    expect(download).toHaveBeenCalledWith(
      filename,
      expect.any(String),
      "application/json",
    );
  });

  test("imports an exported file with intact content and fresh identity and placement", async () => {
    const deck = makeDeck();
    format.export(deck);
    const [filename, text, type] = download.mock.calls[0];
    const beforeImport = Date.now();

    const result = await format.import(new File([text], filename, { type }), {
      storage: "local",
      belongs_to: "new-owner",
    });

    expect(result.errors).toEqual([]);
    expect(result.decks).toHaveLength(1);
    const imported = result.decks[0];
    expect(imported.name).toBe(deck.name);
    expect(imported.storage).toBe("local");
    expect(imported.belongs_to).toBe("new-owner");
    expect(imported.id).toEqual(expect.any(String));
    expect(imported.id).not.toBe(deck.id);
    expect(imported.created_at).toBeGreaterThanOrEqual(beforeImport);
    expect(imported.created_at).toBeLessThanOrEqual(Date.now());
    expect(imported.updated_at).toBe(imported.created_at);
    expect(imported.cards).toHaveLength(deck.cards.length);
    imported.cards.forEach((card, index) => {
      expect(card.id).toEqual(expect.any(String));
      expect(card.id).not.toBe(deck.cards[index].id);
      expect(card).toEqual({ ...deck.cards[index], id: card.id });
    });
    expect(new Set(imported.cards.map((card) => card.id)).size).toBe(2);
  });
});
