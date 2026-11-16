import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { AuthService, DeckService } from "@/service";
import { BaseDeck } from "@/shared/classes";
import { useStorageLocations } from "@/hooks/useStorageLocations";
import { StorageLocation } from "@/shared/types/StorageLocation";
import type { UUID } from "@/shared/types/UUID";
import type { DeckRepository } from "@/storage";
import DeckImporter from "./DeckImporter";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useStorageLocations", () => ({
  useStorageLocations: jest.fn(),
}));

class FakeRepository implements DeckRepository {
  readonly decks = new Map<UUID, BaseDeck>();

  constructor(readonly location: StorageLocation) {}

  async list() {
    return [...this.decks.values()];
  }

  async get(id: UUID) {
    return this.decks.get(id) ?? null;
  }

  async save(deck: BaseDeck) {
    this.decks.set(deck.id, deck);
  }

  async delete(id: UUID) {
    this.decks.delete(id);
  }
}

const mockedUseRouter = jest.mocked(useRouter);
const mockedUseStorageLocations = jest.mocked(useStorageLocations);
const mockPush = jest.fn();
let local: FakeRepository;

const makeFile = (contents: string): File => {
  const file = new File([contents], "decks.json", {
    type: "application/json",
  });
  Object.defineProperty(file, "text", { value: async () => contents });
  return file;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockPush.mockReset();
  local = new FakeRepository(StorageLocation.Local);
  DeckService.resetForTests({
    auth: AuthService.resetForTests(),
    local,
  });
  mockedUseRouter.mockReturnValue({
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    bfcacheId: "",
  });
  mockedUseStorageLocations.mockReturnValue([StorageLocation.Local]);
});

describe("DeckImporter tests (JSON)", () => {
  test("navigates after a successful import", async () => {
    const user = userEvent.setup();
    const file = makeFile(
      JSON.stringify({
        version: 1,
        decks: [{ name: "Imported deck", cards: [] }],
      }),
    );

    render(<DeckImporter />);

    await user.upload(screen.getByLabelText(/Deck file/), file);
    await user.click(screen.getByRole("button", { name: "Save locally" }));

    expect(mockPush).toHaveBeenCalledWith("/");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("does not navigate after a failed import", async () => {
    const user = userEvent.setup();
    const file = makeFile("not valid JSON");

    render(<DeckImporter />);

    await user.upload(screen.getByLabelText(/Deck file/), file);
    await user.click(screen.getByRole("button", { name: "Save locally" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The file is not valid JSON.",
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("parses and saves a non-empty deck before navigating after success", async () => {
    const user = userEvent.setup();
    const file = makeFile(
      JSON.stringify({
        version: 1,
        decks: [
          {
            name: "Imported Biology",
            cards: [
              {
                type: "definition",
                question: { format: "plain", source: "Mitochondria" },
                answer: {
                  format: "plain",
                  source: "The powerhouse of the cell",
                },
              },
            ],
          },
        ],
      }),
    );
    mockPush.mockImplementation(() => {
      const [deck] = [...local.decks.values()];
      expect(deck?.name).toBe("Imported Biology");
      expect(deck?.cards).toHaveLength(1);
      expect(deck?.cards[0].question.source).toBe("Mitochondria");
      expect(deck?.cards[0].answer.source).toBe("The powerhouse of the cell");
    });

    render(<DeckImporter />);

    await user.upload(screen.getByLabelText(/Deck file/), file);
    await user.click(screen.getByRole("button", { name: "Save locally" }));

    expect(mockPush).toHaveBeenCalledWith("/");
    expect(local.decks.size).toBe(1);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("shows an error for a file that contains no decks", async () => {
    const user = userEvent.setup();
    const file = makeFile(
      JSON.stringify({
        version: 1,
        decks: [],
      }),
    );

    render(<DeckImporter />);

    await user.upload(screen.getByLabelText(/Deck file/), file);
    await user.click(screen.getByRole("button", { name: "Save locally" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The file doesn't contain any decks.",
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  test("parses and saves multiple decks from a file", async () => {
    const user = userEvent.setup();
    const file = makeFile(
      JSON.stringify({
        version: 1,
        decks: [
          {
            name: "Imported Biology",
            cards: [
              {
                type: "definition",
                question: { format: "plain", source: "Mitochondria" },
                answer: {
                  format: "plain",
                  source: "The powerhouse of the cell",
                },
              },
              {
                type: "definition",
                question: { format: "plain", source: "Ribosome" },
                answer: {
                  format: "plain",
                  source: "Site of protein synthesis",
                },
              },
            ],
          },
          {
            name: "Imported Chemistry",
            cards: [
              {
                type: "definition",
                question: { format: "plain", source: "Covalent bond" },
                answer: {
                  format: "plain",
                  source: "A bond formed by shared electron pairs",
                },
              },
            ],
          },
        ],
      }),
    );

    mockPush.mockImplementation(() => {
      const importedDecks = Object.fromEntries(
        [...local.decks.values()].map((deck) => [
          deck.name,
          deck.cards.map((card) => ({
            type: card.type,
            question: card.question.source,
            answer: card.answer.source,
          })),
        ]),
      );

      expect(importedDecks).toEqual({
        "Imported Biology": [
          {
            type: "definition",
            question: "Mitochondria",
            answer: "The powerhouse of the cell",
          },
          {
            type: "definition",
            question: "Ribosome",
            answer: "Site of protein synthesis",
          },
        ],
        "Imported Chemistry": [
          {
            type: "definition",
            question: "Covalent bond",
            answer: "A bond formed by shared electron pairs",
          },
        ],
      });
    });

    render(<DeckImporter />);

    await user.upload(screen.getByLabelText(/Deck file/), file);
    await user.click(screen.getByRole("button", { name: "Save locally" }));

    expect(mockPush).toHaveBeenCalledWith("/");
    expect(local.decks.size).toBe(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("shows an error for a file that contains a deck with an invalid card", async () => {
    const user = userEvent.setup();
    const file = makeFile(
      JSON.stringify({
        version: 1,
        decks: [
          {
            name: "Imported Biology",
            cards: [
              {
                type: "definition",
                question: { format: "plain", source: "Mitochondria" },
                answer: {
                  format: "plain",
                  source: "The powerhouse of the cell",
                },
              },
              {
                type: "definition",
                question: { format: "plain", source: "Ribosome" },
                answer: { format: "plain" },
              },
            ],
          },
        ],
      }),
    );

    render(<DeckImporter />);

    await user.upload(screen.getByLabelText(/Deck file/), file);
    await user.click(screen.getByRole("button", { name: "Save locally" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      'Deck 1, card 2 answer needs a text "source".',
    );
    expect(mockPush).not.toHaveBeenCalled();
  });
});
