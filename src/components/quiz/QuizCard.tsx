"use client";

import { useState } from "react";
import {
  type BaseCard,
  CARD_TYPE_INFO,
  type CardResponse,
} from "@/shared/classes";
import { buttonStyles } from "@/components/ui";
import { FlipCard } from "./FlipCard";

interface QuizCardProps {
  card: BaseCard;
  response: CardResponse | null;
  onSubmit: (answer: string) => void;
}

export const QuizCard = ({ card, response, onSubmit }: QuizCardProps) => {
  const [draft, setDraft] = useState("");

  const front = (
    <div className="flex w-full flex-col items-center gap-6">
      {card.question.render()}
      {!response && (
        <form
          className="flex w-full gap-2 text-base"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) onSubmit(draft.trim());
          }}
        >
          {card.answer.renderInput({
            value: draft,
            onChange: setDraft,
            label: "Your answer",
          })}
          <button
            type="submit"
            disabled={!draft.trim()}
            className={buttonStyles.primary}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );

  const back = (
    <dl className="grid w-full grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-3 text-left">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Correct
      </dt>
      <dd>{card.answer.render()}</dd>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Yours
      </dt>
      <dd className="whitespace-pre-wrap">{response?.answer}</dd>
    </dl>
  );

  return (
    <FlipCard
      badge={CARD_TYPE_INFO[card.type].label}
      front={front}
      back={back}
      revealed={response !== null}
    />
  );
};
