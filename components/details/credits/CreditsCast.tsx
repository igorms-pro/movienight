"use client";

import React from "react";
import Image from "next/image";
import { Button, KIND as BTN_KIND, SIZE as BTN_SIZE } from "baseui/button";
import { CastMember } from "@/lib/tmdb/types";

type Props = {
  cast: CastMember[];
  showCast: boolean;
  onToggle: () => void;
  displayedCast: CastMember[];
  onShowMore: () => void;
  hasMore: boolean;
};

export default function CreditsCast({
  cast,
  showCast,
  onToggle,
  displayedCast,
  onShowMore,
  hasMore,
}: Props) {
  return (
    <section className="space-y-4" data-testid="credits-cast">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 text-2xl font-semibold bg-transparent border-none p-0 focus:outline-none"
        style={{ color: "var(--text-primary, #fff)" }}
      >
        Casting
        <span className="text-lg" style={{ color: "var(--text-primary, #fff)" }}>
          {showCast ? "▴" : "▾"}
        </span>
      </button>
      {showCast && (
        <div className="space-y-4 mb-5">
          <div className="grid grid-cols-6 gap-6 max-[1280px]:grid-cols-4 max-[768px]:grid-cols-2">
            {displayedCast.map((actor: CastMember) => (
              <button
                key={actor.id}
                className="text-center cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                onClick={() =>
                  window.open(`https://www.themoviedb.org/person/${actor.id}`, "_blank")
                }
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
            {displayedCast.length === 0 && (
              <div className="text-white/60">Aucune donnée pour le casting.</div>
            )}
          </div>
          {hasMore && (
            <Button kind={BTN_KIND.secondary} size={BTN_SIZE.compact} onClick={onShowMore}>
              Voir plus ({cast.length - displayedCast.length} restants)
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
