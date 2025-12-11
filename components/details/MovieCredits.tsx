"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, KIND as BTN_KIND, SIZE as BTN_SIZE } from "baseui/button";
import { CastMember, Credits, MovieDetails } from "@/lib/tmdb/types";

type CrewEntry = {
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  id: number;
};

const sortCrew = (crew: Credits["crew"] = []) => {
  const importance = new Map<string, number>([
    ["Director", 1],
    ["Producer", 2],
    ["Executive Producer", 3],
    ["Screenplay", 4],
    ["Writer", 5],
    ["Story", 6],
  ]);
  return [...crew].sort((a, b) => {
    const aScore = importance.get(a.job) || 99;
    const bScore = importance.get(b.job) || 99;
    if (aScore !== bScore) return aScore - bScore;
    return (a.name || "").localeCompare(b.name || "");
  });
};

type Props = {
  movie: MovieDetails;
  credits: Credits;
};

export default function MovieCredits({ movie, credits }: Props) {
  const sortedCrew: CrewEntry[] = useMemo(() => sortCrew(credits.crew), [credits.crew]);
  const cast = credits.cast || [];

  const [showCrew, setShowCrew] = useState(true);
  const [showCast, setShowCast] = useState(true);
  const crewIncrement = 8;
  const castIncrement = 12;
  const [crewCount, setCrewCount] = useState(Math.min(12, sortedCrew.length));
  const [castCount, setCastCount] = useState(Math.min(18, cast.length));

  const displayedCrew = sortedCrew.slice(0, crewCount);
  const displayedCast = cast.slice(0, castCount);
  const hasData = displayedCrew.length > 0 || displayedCast.length > 0;

  return (
    <div className="flex justify-center" data-testid="credits-page">
      <div className="w-full max-w-[1400px] space-y-10 md:px-0">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <Link href={`/movie/${movie.id}`} className="inline-flex">
              <Button kind={BTN_KIND.secondary} size={BTN_SIZE.compact}>
                ← Retour
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{movie.title} — Crédits & Casting</h1>
        </div>

        {!hasData && (
          <div className="text-white/80" data-testid="credits-empty">
            Aucune donnée de casting ou crédits disponible.
          </div>
        )}

        <section className="space-y-4" data-testid="credits-crew">
          <Button
            kind={BTN_KIND.tertiary}
            size={BTN_SIZE.compact}
            onClick={() => setShowCrew((v) => !v)}
            overrides={{
              BaseButton: { style: { paddingLeft: "0", paddingRight: "0", gap: "8px" } },
            }}
          >
            <h2 className="text-2xl font-semibold">Équipe</h2>
            <span className="text-white/80 transition-colors text-lg">{showCrew ? "▴" : "▾"}</span>
          </Button>
          {showCrew && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
                {displayedCrew.map((c) => (
                  <button
                    key={`${c.id}-${c.job}`}
                    className="w-full flex items-center gap-3 rounded-lg p-3 transition-transform duration-200 hover:scale-[1.02] text-left cursor-pointer border"
                    style={{
                      backgroundColor: "var(--card-bg, #111)",
                      borderColor: "var(--border-strong, #333)",
                    }}
                    onClick={() =>
                      window.open(`https://www.themoviedb.org/person/${c.id}`, "_blank")
                    }
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#1a1a1a] shrink-0">
                      {c.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                          alt={c.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="48px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-[#666]">
                          N/A
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-[#999]">{c.job}</div>
                      <div className="text-base font-semibold text-white">{c.name}</div>
                    </div>
                  </button>
                ))}
                {displayedCrew.length === 0 && (
                  <div className="text-white/60">Aucune donnée pour l&apos;équipe.</div>
                )}
              </div>
              {displayedCrew.length < sortedCrew.length && (
                <Button
                  kind={BTN_KIND.secondary}
                  size={BTN_SIZE.compact}
                  onClick={() =>
                    setCrewCount((prev) => Math.min(prev + crewIncrement, sortedCrew.length))
                  }
                >
                  Voir plus ({sortedCrew.length - displayedCrew.length} restants)
                </Button>
              )}
            </div>
          )}
        </section>

        <section className="space-y-4" data-testid="credits-cast">
          <Button
            kind={BTN_KIND.tertiary}
            size={BTN_SIZE.compact}
            onClick={() => setShowCast((v) => !v)}
            overrides={{
              BaseButton: { style: { paddingLeft: "0", paddingRight: "0", gap: "8px" } },
            }}
          >
            <h2 className="text-2xl font-semibold">Casting</h2>
            <span className="text-white/80 transition-colors text-lg">{showCast ? "▴" : "▾"}</span>
          </Button>
          {showCast && (
            <div className="space-y-4">
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
              {displayedCast.length < cast.length && (
                <Button
                  kind={BTN_KIND.secondary}
                  size={BTN_SIZE.compact}
                  onClick={() =>
                    setCastCount((prev) => Math.min(prev + castIncrement, cast.length))
                  }
                >
                  Voir plus ({cast.length - displayedCast.length} restants)
                </Button>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
