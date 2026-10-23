"use client";

import { useId, useState } from "react";
import { STAR_RATINGS, type StarRating } from "@/shared/classes";

interface StarGradeProps {
  stars: StarRating | null;
  onChange: (stars: StarRating) => void;
}

export const StarGrade = ({ stars, onChange }: StarGradeProps) => {
  const labelId = useId();
  const [hovered, setHovered] = useState<StarRating | null>(null);

  const starColor = (rating: StarRating): string => {
    if (hovered !== null) {
      return rating <= hovered ? "text-amber-400" : "text-slate-300";
    }
    return stars !== null && rating <= stars
      ? "text-amber-500"
      : "text-slate-300";
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <span id={labelId} className="text-sm text-slate-700">
        How&apos;d you do?
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className="flex gap-1"
        onMouseLeave={() => setHovered(null)}
      >
        {STAR_RATINGS.map((rating) => (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={stars === rating}
            aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHovered(rating)}
            className={`text-3xl leading-none transition-colors ${starColor(rating)}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};
