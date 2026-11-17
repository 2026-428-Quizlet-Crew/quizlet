// Public API of the domain model. CardContent subclasses and their factory are
// internal: consumers work with Card and the *Dto shapes.
export { BaseFlashcard } from "@/shared/classes/Flashcard/BaseFlashcard";
export type { FlashcardDto } from "@/shared/classes/Flashcard/FlashcardDto";
export {
  CARD_TYPE_INFO,
  CARD_TYPES,
  CardType,
  type CardTypeInfo,
} from "@/shared/classes/Flashcard/CardType";
// New card model. Replaces Flashcard/ once definition and concept move to it.
export type {
  EditProps,
  Flashcard,
  QuizBackProps,
  QuizFrontProps,
  StudyProps,
} from "./Card/Flashcard";
export type { CardTypeDefinition } from "./Card/CardTypeDefinition";
export type { CardTypeId, FlashcardData } from "./Card/FlashcardData";
export type { GradeResult } from "./Card/GradeResult";
export type { RenderContext } from "./Card/RenderContext";
export type { ValidationIssue } from "./Card/ValidationIssue";
export type { CardToHost, HostToCard } from "./CustomCard/CardMessages";
export type { CardView, CardViewState } from "./CustomCard/CardViewState";
export type { CustomCardManifest } from "./CustomCard/CustomCardManifest";
export type {
  CardActions,
  CustomCardModule,
} from "./CustomCard/CustomCardModule";
export type { CardContentDto } from "./content/CardContentDto";
export {
  CONTENT_FORMAT_INFO,
  CONTENT_FORMATS,
  ContentFormat,
  type ContentFormatInfo,
} from "./content/ContentFormat";
export { BaseDeck } from "./Deck/BaseDeck";
export type { DeckDto } from "./Deck/DeckDto";
export { StudySession } from "./Quiz/StudySession";
export {
  QuizAttempt,
  type MissedCard,
  type QuizResults,
} from "./Quiz/QuizAttempt";
export { CARD_GRADERS, CardGrader } from "./Quiz/CardGrader";
export {
  STAR_RATINGS,
  type CardResponse,
  type Grade,
  type StarRating,
} from "./Quiz/Grade";
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
