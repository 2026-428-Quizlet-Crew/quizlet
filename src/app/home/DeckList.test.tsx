import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BaseDeck, BaseCard } from "@/shared/classes";
import { PlainTextContent } from "@/shared/classes/content/PlainTextContent";
import { CardType } from "@/shared/classes/Card/CardType";
import { StorageLocation } from "@/shared/types/StorageLocation";
import DeckList from "./DeckList";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockDecks: BaseDeck[] = [];
jest.mock("@/hooks/useDeckList", () => ({
  useDeckList: () => ({ decks: mockDecks }),
}));

const mockDeleteDeck = jest.fn();
jest.mock("@/hooks/useDeleteDeck", () => ({
  useDeleteDeck: () => mockDeleteDeck,
}));

jest.mock("@/shared/classes", () => {
  const actual = jest.requireActual("@/shared/classes");
  return {
    ...actual,
    jsonDeckFormat: { export: jest.fn() },
  };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeDeck = (name: string, cardCount = 2) =>
  new BaseDeck({
    id: `deck-${name}`,
    name,
    belongs_to: null,
    storage: StorageLocation.Local,
    cards: Array.from({ length: cardCount }, (_, i) =>
      BaseCard.create(
        new PlainTextContent("Q"),
        new PlainTextContent("A"),
        CardType.Definition,
      ),
    ),
    created_at: 1,
    updated_at: 1,
  });

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DeckList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDecks.length = 0;
  });

  test("renders a delete button for each deck", () => {
    mockDecks.push(makeDeck("Biology"), makeDeck("History"));

    render(<DeckList />);

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    expect(deleteButtons).toHaveLength(2);
  });

  test("clicking Delete opens the confirmation dialog", async () => {
    mockDecks.push(makeDeck("Biology"));

    render(<DeckList />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAccessibleName(
      `Delete "Biology"? This can't be undone.`,
    );
    expect(mockDeleteDeck).not.toHaveBeenCalled();
  });

  test("confirming the dialog calls deleteDeck and closes it", async () => {
    const deck = makeDeck("Biology");
    mockDecks.push(deck);

    render(<DeckList />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    const dialog = screen.getByRole("alertdialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Delete" }));

    expect(mockDeleteDeck).toHaveBeenCalledTimes(1);
    expect(mockDeleteDeck).toHaveBeenCalledWith(deck);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  test("canceling the dialog does NOT call deleteDeck", async () => {
    mockDecks.push(makeDeck("Biology"));

    render(<DeckList />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockDeleteDeck).not.toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});
