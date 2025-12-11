"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Button, KIND as BTN_KIND, SIZE as BTN_SIZE } from "baseui/button";
import { Credits, MovieDetails } from "@/lib/tmdb/types";
import CreditsCrew from "./credits/CreditsCrew";
import CreditsCast from "./credits/CreditsCast";
import { CrewEntry } from "./credits/types";

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
  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <div className="flex flex-col gap-3 md:px-0">
          <div className="flex items-center gap-4">
            <Link
              href={`/movie/${movie.id}`}
              className="inline-flex"
              data-testid="credits-back-link"
            >
              <Button
                kind={BTN_KIND.secondary}
                size={BTN_SIZE.compact}
                overrides={{
                  BaseButton: {
                    style: {
                      color: "var(--text-primary)",
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border-strong)",
                      ":hover": {
                        backgroundColor: "var(--hover-surface)",
                        borderColor: "var(--border-stronger)",
                      },
                    },
                  },
                }}
                data-testid="credits-back-button"
              >
                ← Retour
              </Button>
            </Link>
          </div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary, #fff)" }}
            data-testid="credits-title"
          >
            {movie.title} — Crédits & Casting
          </h1>
        </div>

        {!hasData && (
          <div className="text-theme-secondary" data-testid="credits-empty">
            Aucune donnée de casting ou crédits disponible.
          </div>
        )}

        <CreditsCrew
          crew={sortedCrew}
          showCrew={showCrew}
          onToggle={() => setShowCrew((v) => !v)}
          displayedCrew={displayedCrew}
          onShowMore={() =>
            setCrewCount((prev) => Math.min(prev + crewIncrement, sortedCrew.length))
          }
          hasMore={displayedCrew.length < sortedCrew.length}
        />

        <CreditsCast
          cast={cast}
          showCast={showCast}
          onToggle={() => setShowCast((v) => !v)}
          displayedCast={displayedCast}
          onShowMore={() => setCastCount((prev) => Math.min(prev + castIncrement, cast.length))}
          hasMore={displayedCast.length < cast.length}
        />
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        className="md:hidden fixed bottom-6 right-4 z-30 w-11 h-11 rounded-full border flex items-center justify-center shadow-lg"
        style={{
          backgroundColor: "var(--surface-strong)",
          color: "var(--text-primary)",
          borderColor: "var(--border-strong)",
        }}
        aria-label="Remonter en haut"
        data-testid="credits-scroll-top"
      >
        ↑
      </button>
    </div>
  );
}
