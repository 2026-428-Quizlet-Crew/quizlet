import { render, screen } from "@testing-library/react";
import { BaseDeck } from "@/shared/classes";
import { StorageLocation } from "@/shared/types/StorageLocation";
import { useDeck, type DeckState } from "@/hooks/useDeck";
import DeckEditor from "./DeckEditor";

jest.mock("@/hooks/useDeck", () => ({
  useDeck: jest.fn(),
}));

jest.mock("./DeckForm", () => ({
  __esModule: true,
  default: ({ existing }: { existing?: { id: string; name: string } }) => (
    <div data-testid="deck-form">
      {existing
        ? `Edit form: ${existing.name} (${existing.id})`
        : "Create form"}
    </div>
  ),
}));

const mockedUseDeck = jest.mocked(useDeck);

const deck = BaseDeck.create({
  name: "Biology",
  cards: [],
  belongs_to: null,
  storage: StorageLocation.Local,
});

const setDeckState = (state: DeckState) => {
  mockedUseDeck.mockReturnValue(state);
};

describe("DeckEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the create form without a deck ID", () => {
    render(<DeckEditor />);

    expect(screen.getByText("Create form")).toBeInTheDocument();
    expect(mockedUseDeck).not.toHaveBeenCalled();
  });

  test("treats an empty deck ID as create mode", () => {
    render(<DeckEditor deckId="" />);

    expect(screen.getByText("Create form")).toBeInTheDocument();
    expect(mockedUseDeck).not.toHaveBeenCalled();
  });

  test("renders the loading state while an existing deck is being fetched", () => {
    setDeckState({ status: "loading" });

    render(<DeckEditor deckId={deck.id} />);

    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.queryByTestId("deck-form")).not.toBeInTheDocument();
    expect(mockedUseDeck).toHaveBeenCalledTimes(1);
    expect(mockedUseDeck).toHaveBeenCalledWith(deck.id);
  });

  test("renders a not-found message and a link when the deck is missing", () => {
    setDeckState({ status: "missing" });

    render(<DeckEditor deckId={deck.id} />);

    expect(screen.getByText("Deck not found.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to decks" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.queryByTestId("deck-form")).not.toBeInTheDocument();
    expect(mockedUseDeck).toHaveBeenCalledWith(deck.id);
  });

  test("renders the load error and a back link when loading fails", () => {
    setDeckState({
      status: "error",
      message: "Storage is unavailable",
    });

    render(<DeckEditor deckId={deck.id} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load deck: Storage is unavailable.",
    );
    expect(screen.getByRole("link", { name: "Back to decks" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.queryByTestId("deck-form")).not.toBeInTheDocument();
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
    expect(screen.queryByText("Deck not found.")).not.toBeInTheDocument();
    expect(mockedUseDeck).toHaveBeenCalledWith(deck.id);
  });

  test("renders the edit form with the loaded deck", () => {
    setDeckState({ status: "ready", deck });

    render(<DeckEditor deckId={deck.id} />);

    expect(
      screen.getByText(`Edit form: ${deck.name} (${deck.id})`),
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
    expect(screen.queryByText("Deck not found.")).not.toBeInTheDocument();
    expect(mockedUseDeck).toHaveBeenCalledWith(deck.id);
  });

  test("forwards a non-empty deck ID without changing it", () => {
    const deckId = " deck-with-whitespace ";
    setDeckState({ status: "loading" });

    render(<DeckEditor deckId={deckId} />);

    expect(mockedUseDeck).toHaveBeenCalledWith(deckId);
  });
});
