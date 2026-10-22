import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { useImportDecks } from "@/hooks/useImportDecks";
import { useStorageLocations } from "@/hooks/useStorageLocations";
import { StorageLocation } from "@/shared/types/StorageLocation";
import DeckImporter from "./DeckImporter";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useImportDecks", () => ({
  useImportDecks: jest.fn(),
}));

jest.mock("@/hooks/useStorageLocations", () => ({
  useStorageLocations: jest.fn(),
}));

const mockedUseRouter = jest.mocked(useRouter);
const mockedUseImportDecks = jest.mocked(useImportDecks);
const mockedUseStorageLocations = jest.mocked(useStorageLocations);
const mockPush = jest.fn();
const mockImportDecks = jest.fn<ReturnType<ReturnType<typeof useImportDecks>>,
  Parameters<ReturnType<typeof useImportDecks>>>();

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseRouter.mockReturnValue({
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    bfcacheId: ""
  });
  mockedUseStorageLocations.mockReturnValue([StorageLocation.Local]);
  mockImportDecks.mockResolvedValue({
    decks: [],
    errors: ["Test import error"],
  });
  mockedUseImportDecks.mockReturnValue(mockImportDecks);
});

describe("DeckImporter tests", () => {
  test("imports the selected file but raises an error", async () => {
    const user = userEvent.setup();
    const file = new File(["{}"], "decks.json", { type: "application/json" });

    render(<DeckImporter />);

    await user.upload(screen.getByLabelText(/Deck file/), file);
    await user.click(screen.getByRole("button", { name: "Save locally" }));

    expect(mockImportDecks).toHaveBeenCalledWith(file, StorageLocation.Local);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Test import error",
    );
  });
});
