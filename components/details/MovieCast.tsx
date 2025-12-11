"use client";

import React from "react";
import Image from "next/image";
import { Button, KIND as BTN_KIND, SIZE as BTN_SIZE } from "baseui/button";
import { CastMember } from "@/lib/tmdb/types";

type Props = {
  cast: CastMember[];
  totalCastCount: number;
  movieId: number;
};

export default function MovieCast({ cast, totalCastCount, movieId }: Props) {
  const mainCast = cast.slice(0, 12);
  const hasMoreCast = totalCastCount > mainCast.length;

  return (
    <div data-testid="movie-cast">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Casting</h2>
        {hasMoreCast && (
          <span className="text-sm text-white/70">
            +{totalCastCount - mainCast.length} supplémentaires
          </span>
        )}
      </div>
      <div className="grid grid-cols-6 gap-6 max-[1280px]:grid-cols-4 max-[768px]:grid-cols-2">
        {mainCast.map((actor) => (
          <button
            key={actor.id}
            className="text-center cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            onClick={() => window.open(`https://www.themoviedb.org/person/${actor.id}`, "_blank")}
          >
            <div className="relative w-full pt-[100%] rounded-lg overflow-hidden bg-[#1a1a1a] mb-3">
              {actor.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="150px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#666] text-xs">
                  Pas d&apos;image
                </div>
              )}
            </div>
            <div className="text-sm font-semibold mb-1 text-white">{actor.name}</div>
            <div className="text-xs text-[#999]">{actor.character}</div>
          </button>
        ))}
        {hasMoreCast && (
          <Button
            kind={BTN_KIND.tertiary}
            size={BTN_SIZE.default}
            onClick={() => window.open(`/movie/${movieId}/credits`, "_self")}
            overrides={{
              BaseButton: {
                style: {
                  width: "100%",
                  height: "100%",
                  minHeight: "180px",
                  cursor: "pointer",
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.12)",
                  ":hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                },
              },
            }}
            data-testid="movie-cast-see-all"
          >
            Voir tout →
          </Button>
        )}
      </div>
    </div>
  );
}
