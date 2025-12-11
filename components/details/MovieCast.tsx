"use client";

import React from "react";
import Image from "next/image";
import { Button, KIND as BTN_KIND, SIZE as BTN_SIZE } from "baseui/button";
import { useRouter } from "next/navigation";
import { CastMember } from "@/lib/tmdb/types";

type Props = {
  cast: CastMember[];
  totalCastCount: number;
  movieId: number;
};

export default function MovieCast({ cast, totalCastCount, movieId }: Props) {
  const router = useRouter();
  const mainCast = cast.slice(0, 12);
  const hasMoreCast = totalCastCount > mainCast.length;

  return (
    <div data-testid="movie-cast">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Casting</h2>
        {hasMoreCast && (
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            +{totalCastCount - mainCast.length} supplémentaires
          </span>
        )}
      </div>
      <div
        className="grid grid-cols-6 gap-6 max-[1280px]:grid-cols-4 max-[768px]:grid-cols-2"
        data-testid="movie-cast-grid"
      >
        {mainCast.map((actor) => (
          <button
            key={actor.id}
            className="text-center cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            onClick={() => window.open(`https://www.themoviedb.org/person/${actor.id}`, "_blank")}
            data-testid="movie-cast-item"
            data-person-id={actor.id}
          >
            <div
              className="relative w-full pt-[100%] rounded-lg overflow-hidden mb-3"
              style={{ backgroundColor: "var(--surface-elevated)" }}
            >
              {actor.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="150px"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-xs"
                  style={{
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--surface-elevated)",
                  }}
                >
                  Pas d&apos;image
                </div>
              )}
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              {actor.name}
            </div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {actor.character}
            </div>
          </button>
        ))}
        {hasMoreCast && (
          <Button
            kind={BTN_KIND.tertiary}
            size={BTN_SIZE.default}
            onClick={() => router.push(`/movie/${movieId}/credits`)}
            overrides={{
              BaseButton: {
                style: {
                  width: "100%",
                  height: "100%",
                  minHeight: "180px",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  backgroundColor: "var(--card-bg-strong)",
                  borderColor: "var(--border-strong)",
                  ":hover": {
                    backgroundColor: "var(--hover-surface)",
                    borderColor: "var(--border-stronger)",
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
