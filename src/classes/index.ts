// Public API of the domain model. CardContent subclasses and their factory are
// internal: consumers work with Card and the *Dto shapes.
export { Card } from "./Card/Card";
export type { CardDto } from "./Card/CardDto";
export {
  CARD_TYPE_INFO,
  CARD_TYPES,
  CardType,
  type CardTypeInfo,
} from "./Card/CardType";
export type { CardContentDto } from "./content/CardContentDto";
export {
  CONTENT_FORMAT_INFO,
  CONTENT_FORMATS,
  ContentFormat,
  type ContentFormatInfo,
} from "./content/ContentFormat";
export { Deck } from "./Deck/Deck";
export type { DeckDto } from "./Deck/DeckDto";
export { QuizSession } from "./Quiz/QuizSession";
export {
  DeckFileFormat,
  EXCLUDED_DECK_FIELDS,
  type DeckPlacement,
  type ImportResult,
} from "./DeckFile/DeckFileFormat";
export { JsonDeckFormat } from "./DeckFile/JsonDeckFormat";
export {
  ACCEPTED_DECK_FILES,
  DECK_FILE_FORMATS,
  formatForFile,
  jsonDeckFormat,
} from "./DeckFile/formats";
