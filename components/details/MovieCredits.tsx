"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Button, KIND as BTN_KIND, SIZE as BTN_SIZE } from "baseui/button";
import { Credits, MovieDetails } from "@/lib/tmdb/types";
import CreditsCrew from "./credits/CreditsCrew";
import CreditsCast from "./credits/CreditsCast";
import { CrewEntry } from "./credits/types";
import { useGsapFromTo, withScrollTrigger } from "@/lib/gsapClient";
import { useMovieStore } from "@/store/movieStore";

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
  const titleRef = React.useRef<HTMLHeadingElement | null>(null);
  const sectionsRef = React.useRef<HTMLDivElement | null>(null);
  const backdropUrl =
    movie.backdrop_path || movie.poster_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`
      : null;
  const setCurrentMovie = useMovieStore((s) => s.setCurrentMovie);

  const [showCrew, setShowCrew] = useState(true);
  const [showCast, setShowCast] = useState(true);
  const crewIncrement = 8;
  const castIncrement = 12;
  const [crewCount, setCrewCount] = useState(Math.min(12, sortedCrew.length));
  const [castCount, setCastCount] = useState(Math.min(18, cast.length));

  const displayedCrew = sortedCrew.slice(0, crewCount);
  const displayedCast = cast.slice(0, castCount);
  const hasData = displayedCrew.length > 0 || displayedCast.length > 0;

  useGsapFromTo([titleRef, sectionsRef], {
    from: { autoAlpha: 0, y: 16 },
    to: withScrollTrigger({
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      ease: "power2.out",
      scrollTrigger: { trigger: titleRef.current ?? sectionsRef.current ?? undefined },
    }),
    stagger: 0.08,
  });

  React.useEffect(() => {
    setCurrentMovie(movie);
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info("[BG] credits setCurrentMovie", {
        id: movie.id,
        title: movie.title,
        backdrop: movie.backdrop_path,
        posterUrl: movie.poster_path,
      });
    }
    return () => setCurrentMovie(null);
  }, [movie, setCurrentMovie]);

  return (
    <div className="flex justify-center relative" data-testid="credits-page">
      {backdropUrl && (
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 scale-105 blur-[18px] brightness-50"
            style={{
              backgroundImage: `url(${backdropUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,13,0.7),rgba(11,11,13,0.9))]" />
        </div>
      )}
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
            ref={titleRef}
            className="text-3xl font-bold font-heading"
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

        <div ref={sectionsRef} className="space-y-10">
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
