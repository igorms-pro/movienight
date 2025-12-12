"use client";

import React from "react";
import { Button, KIND as BTN_KIND, SHAPE as BTN_SHAPE, SIZE as BTN_SIZE } from "baseui/button";
import { MovieDetailView } from "./types";

const formatRuntime = (minutes: number) => {
  if (!minutes || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

type Props = {
  movie: MovieDetailView["movie"];
};

export default function MovieHeader({ movie }: Props) {
  return (
    <div className="max-w-[600px]" data-testid="movie-overview">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-[42px] md:text-[48px] font-bold uppercase leading-[1.1] font-heading">
          {movie.title} ({movie.releaseYear})
        </h1>
        {movie.certification && (
          <span className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-sm text-white/80">
            {movie.certification}
          </span>
        )}
      </div>

      {movie.genres?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 text-base text-white/70 font-heading">
          {movie.genres.map((genre, idx) => (
            <span key={genre.id}>
              {genre.name}
              {idx < movie.genres.length - 1 && ","}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        {movie.runtime ? (
          <span className="text-base text-white/70 whitespace-nowrap">
            {formatRuntime(movie.runtime)}
          </span>
        ) : null}
        <div className="w-1/4 min-w-[140px] h-2 rounded-sm overflow-hidden bg-white/10">
          <div
            className="h-full bg-[#4caf50] transition-all duration-300"
            style={{ width: `${movie.userRating}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-white whitespace-nowrap">
          {movie.userRating}%
        </span>
      </div>

      <div className="flex gap-4 mb-8">
        <Button kind={BTN_KIND.primary} size={BTN_SIZE.large} shape={BTN_SHAPE.pill}>
          Regarder
        </Button>
        <Button
          kind={BTN_KIND.secondary}
          size={BTN_SIZE.large}
          shape={BTN_SHAPE.circle}
          aria-label="Ajouter aux favoris"
        >
          ★
        </Button>
      </div>
    </div>
  );
}
