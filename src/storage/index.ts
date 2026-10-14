// Public API of the storage layer. Repositories are internal: consumers go
// through the DeckService provided by DeckServiceProvider.
export type { DeckService } from "./DeckService";
export { DeckServiceProvider, useDeckService } from "./DeckServiceProvider";
