export const CardType = {
  Definition: "definition",
  Concept: "concept",
  Function: "function", // TODO: May not be implemented
} as const;

export type CardType = (typeof CardType)[keyof typeof CardType];

export interface CardTypeInfo {
  label: string;
  description: string;
}

export const CARD_TYPE_INFO: Record<CardType, CardTypeInfo> = {
  [CardType.Definition]: {
    label: "Definition",
    description: "The answer must be an exact match.",
  },
  [CardType.Concept]: {
    label: "Concept",
    description: "Self-graded. The answer should identify the key points.",
  },
  [CardType.Function]: {
    label: "Function",
    description:
      "Variables are randomized and the answer is computed by a function.",
  },
};

export const CARD_TYPES: readonly CardType[] = Object.values(CardType);

export const isCardType = (value: unknown): value is CardType =>
  CARD_TYPES.includes(value as CardType);
