"use client";

import type { Grade, MissedCard } from "@/shared/classes";

const describeGrade = (grade: Grade | null): string => {
  if (grade?.kind === "stars") {
    return `${grade.stars} ${grade.stars === 1 ? "star" : "stars"}`;
  }
  return "Incorrect";
};

const MissedCards = ({ missed }: { missed: MissedCard[] }) => {
  if (missed.length === 0) {
    return (
      <p className="text-center text-slate-600">You didn&apos;t miss any!</p>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Missed ({missed.length})</h2>
      <ul className="flex flex-col gap-3">
        {missed.map(({ card, response }) => (
          <li
            key={card.id}
            className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="font-medium">{card.question.render()}</div>
              <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                {describeGrade(response.grade)}
              </span>
            </div>
            <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 text-sm">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Correct
              </dt>
              <dd>{card.answer.render()}</dd>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Yours
              </dt>
              <dd className="whitespace-pre-wrap">{response.answer}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MissedCards;
