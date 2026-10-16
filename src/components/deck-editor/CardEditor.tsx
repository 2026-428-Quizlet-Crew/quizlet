"use client";

import {
  CARD_TYPE_INFO,
  CARD_TYPES,
  type CardDto,
  type CardType,
} from "@/shared/classes";
import ContentEditor from "./ContentEditor";

interface CardEditorProps {
  index: number;
  card: CardDto;
  onChange: (card: CardDto) => void;
  onRemove: () => void;
}

const CardEditor = ({ index, card, onChange, onRemove }: CardEditorProps) => {
  return (
    <li className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-500">
          Card {index + 1}
        </span>
        <div className="flex items-center gap-2">
          <select
            aria-label={`Card ${index + 1} type`}
            title={CARD_TYPE_INFO[card.type].description}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
            value={card.type}
            onChange={(e) =>
              onChange({ ...card, type: e.target.value as CardType })
            }
          >
            {CARD_TYPES.map((type) => (
              <option key={type} value={type}>
                {CARD_TYPE_INFO[type].label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onRemove}
            className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-red-600"
            aria-label={`Remove card ${index + 1}`}
          >
            Remove
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <ContentEditor
          label="Question"
          value={card.question}
          onChange={(question) => onChange({ ...card, question })}
        />
        <ContentEditor
          label="Answer"
          value={card.answer}
          onChange={(answer) => onChange({ ...card, answer })}
        />
      </div>
    </li>
  );
};

export default CardEditor;
