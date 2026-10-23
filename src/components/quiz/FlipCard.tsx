"use client";

import type { KeyboardEvent, ReactNode } from "react";

interface FaceProps {
  side: string;
  badge: string;
  back?: boolean;
  children: ReactNode;
}

interface FlipCardProps {
  badge: string;
  front: ReactNode;
  back: ReactNode;
  revealed: boolean;
  /** When set, the whole card is a button that flips it. */
  onFlip?: () => void;
}

const Face = ({ side, badge, back = false, children }: FaceProps) => {
  return (
    <div
      className={`absolute inset-0 flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-md backface-hidden ${back ? "rotate-y-180" : ""}`}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-800">
          {badge}
        </span>
        <span className="uppercase tracking-wide text-slate-400">{side}</span>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto text-center text-xl">
        {children}
      </div>
    </div>
  );
};

/** Two-sided card that turns over to show its back when `revealed`. */
export const FlipCard = ({
  badge,
  front,
  back,
  revealed,
  onFlip,
}: FlipCardProps) => {
  const flipProps = onFlip && {
    role: "button",
    tabIndex: 0,
    "aria-label": revealed ? "Show question" : "Show answer",
    onClick: onFlip,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter") onFlip();
    },
  };

  return (
    <div className="h-72 w-full perspective-[1200px]">
      <div
        {...flipProps}
        className={`relative h-full w-full rounded-xl transition-transform duration-500 transform-3d ${onFlip ? "cursor-pointer" : ""} ${revealed ? "rotate-y-180" : ""}`}
      >
        <Face side="Question" badge={badge}>
          {front}
        </Face>
        <Face side="Answer" badge={badge} back>
          {back}
        </Face>
      </div>
    </div>
  );
};
