// Public API of the storage layer. Only service/ should import from here:
// DeckService owns these repositories and decides which ones a user can use.
export type { DeckRepository } from "./DeckRepository";
export { CloudDeckRepository } from "./CloudDeckRepository";
export { LocalStorageDeckRepository } from "./LocalStorageDeckRepository";
