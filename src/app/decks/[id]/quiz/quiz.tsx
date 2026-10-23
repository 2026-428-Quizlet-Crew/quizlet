"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  type BaseDeck,
  CARD_GRADERS,
  type Grade,
  QuizAttempt,
  STAR_RATINGS,
} from "@/shared/classes";
import { type UUID } from "@/shared/types/UUID";
import {
  CorrectnessGrade,
  QuizCard,
  QuizControls,
  StarGrade,
} from "@/components/quiz";
import MissedCards from "./MissedCards";
import QuizFinished from "./QuizFinished";
import DeckGate from "../DeckGate";
import {
  type KeyboardShortcuts,
  useKeyboardShortcuts,
} from "@/hooks/useKeyboardShortcuts";

const QuizRunner = ({ deck }: { deck: BaseDeck }) => {
  const [attempt, setAttempt] = useState(() => QuizAttempt.start(deck));

  const submit = useCallback(
    (answer: string) => setAttempt((a) => a.submit(answer)),
    [],
  );
  const grade = useCallback((g: Grade) => setAttempt((a) => a.grade(g)), []);
  const next = useCallback(() => setAttempt((a) => a.next()), []);
  const previous = useCallback(() => setAttempt((a) => a.previous()), []);
  const restart = useCallback(() => setAttempt((a) => a.restart()), []);

  // `grade` ignores a grade of the wrong kind, so both sets can stay bound.
  useKeyboardShortcuts(
    useMemo((): KeyboardShortcuts => {
      const shortcuts: KeyboardShortcuts = {
        ArrowRight: next,
        ArrowLeft: previous,
        y: () => grade({ kind: "correct", correct: true }),
        n: () => grade({ kind: "correct", correct: false }),
      };
      for (const stars of STAR_RATINGS) {
        shortcuts[String(stars)] = () => grade({ kind: "stars", stars });
      }
      return shortcuts;
    }, [next, previous, grade]),
  );

  if (attempt.total === 0) {
    return (
      <p>
        This deck has no quizzable cards yet.{" "}
        <Link
          href={`/decks/${deck.id}/flashcards`}
          className="text-blue-600 hover:underline"
        >
          Study with flashcards
        </Link>
      </p>
    );
  }

  const card = attempt.current;
  const response = attempt.currentResponse;
  const cardGrade = response?.grade ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">{deck.name}</h1>
        <Link
          href={`/decks/${deck.id}/edit`}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </Link>
      </div>

      {card ? (
        <>
          <QuizCard
            key={card.id}
            card={card}
            response={response}
            onSubmit={submit}
          />
          {/* Fixed height so the controls don't jump when grading appears. */}
          <div className="flex h-10 items-center justify-center">
            {response &&
              (CARD_GRADERS[card.type].kind === "stars" ? (
                <StarGrade
                  stars={cardGrade?.kind === "stars" ? cardGrade.stars : null}
                  onChange={(stars) => grade({ kind: "stars", stars })}
                />
              ) : (
                <CorrectnessGrade
                  correct={
                    cardGrade?.kind === "correct" ? cardGrade.correct : null
                  }
                  onChange={(correct) => grade({ kind: "correct", correct })}
                />
              ))}
          </div>
        </>
      ) : (
        <QuizFinished results={attempt.results} onRestart={restart} />
      )}

      <QuizControls
        position={Math.min(attempt.index + 1, attempt.total)}
        total={attempt.total}
        hasPrevious={attempt.hasPrevious}
        hasNext={attempt.hasNext}
        onPrevious={previous}
        onNext={next}
      />

      {attempt.isFinished ? (
        <MissedCards missed={attempt.results.missed} />
      ) : (
        <p className="text-center text-xs text-slate-500">
          Type your answer and press Enter. Grade with Y/N or 1–5, then use →
          for the next card.
        </p>
      )}
    </div>
  );
};

const Quiz = ({ deckId }: { deckId: UUID }) => {
  return (
    <DeckGate deckId={deckId}>{(deck) => <QuizRunner deck={deck} />}</DeckGate>
  );
};

export default Quiz;
