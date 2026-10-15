// Public API of the storage layer. Repositories are internal: consumers go
// through the DeckService provided by DeckServiceProvider.
export type { DeckRepository } from "./DeckRepository";
export { CloudDeckRepository } from "./CloudDeckRepository";
export { LocalStorageDeckRepository } from "./LocalStorageDeckRepository";
