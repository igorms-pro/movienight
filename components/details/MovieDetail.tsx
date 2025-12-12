"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, KIND as BTN_KIND, SHAPE as BTN_SHAPE, SIZE as BTN_SIZE } from "baseui/button";
import { MovieDetailView } from "./types";
import MovieCrewBuckets from "./MovieCrewBuckets";
import MovieTrailers from "./MovieTrailers";
import MovieCast from "./MovieCast";
import { useGsapFromTo, withScrollTrigger } from "@/lib/gsapClient";
import { useMovieStore } from "@/store/movieStore";

type Props = {
  data: MovieDetailView;
};

const formatRuntime = (minutes: number) => {
  if (!minutes || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export function MovieDetail({ data }: Props) {
  const router = useRouter();
  const { movie, trailers, crewBuckets, cast, totalCastCount } = data;
  const titleRef = useRef<HTMLDivElement | null>(null);
  const synopsisRef = useRef<HTMLDivElement | null>(null);
  const crewRef = useRef<HTMLDivElement | null>(null);
  const setCurrentMovie = useMovieStore((s) => s.setCurrentMovie);

  const backdropUrl = movie.posterUrl;

  useGsapFromTo([titleRef, synopsisRef, crewRef], {
    from: { autoAlpha: 0, y: 16 },
    to: withScrollTrigger({
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: titleRef.current ?? synopsisRef.current ?? undefined },
    }),
    stagger: 0.08,
  });

  // Update global background
  React.useEffect(() => {
    setCurrentMovie(movie);
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info("[BG] detail setCurrentMovie", {
        id: movie.id,
        title: movie.title,
        posterUrl: movie.posterUrl,
      });
    }
    return () => setCurrentMovie(null);
  }, [movie, setCurrentMovie]);

  return (
    <div className="py-[10px] relative" data-testid="movie-detail">
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
      <div className="mb-6">
        <Button
          onClick={() => router.push("/")}
          kind={BTN_KIND.secondary}
          size={BTN_SIZE.compact}
          shape={BTN_SHAPE.pill}
          data-testid="movie-back-button"
        >
          ← Retour
        </Button>
      </div>

      <div className="flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1fr)_420px] md:gap-[48px] md:mb-[60px]">
        {/* Info & synopsis (left on desktop, below poster on mobile) */}
        <div
          className="flex flex-col gap-6 order-2 md:order-1"
          data-testid="movie-overview"
          ref={titleRef}
        >
          <div className="flex items-start gap-4" data-testid="movie-title-row">
            <h1
              className="text-[32px] md:text-[48px] font-bold uppercase leading-[1.1] font-heading"
              data-testid="movie-title"
            >
              {movie.title} ({movie.releaseYear})
            </h1>
            {movie.certification && (
              <span
                className="inline-flex items-center rounded-full border px-3 py-1 text-sm"
                style={{
                  borderColor: "var(--border-strong)",
                  color: "var(--text-primary)",
                }}
                data-testid="movie-certification"
              >
                {movie.certification}
              </span>
            )}
          </div>

          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 text-base font-heading" data-testid="movie-genres">
              {movie.genres.map((genre, idx) => (
                <span key={genre.id} className="text-theme-secondary">
                  {genre.name}
                  {idx < movie.genres.length - 1 && ","}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4" data-testid="movie-runtime-rating">
            {movie.runtime ? (
              <span className="text-base whitespace-nowrap text-theme-secondary">
                {formatRuntime(movie.runtime)}
              </span>
            ) : null}
            <div className="w-1/4 min-w-[140px] h-2 rounded-sm overflow-hidden bg-white/10">
              <div
                className="h-full bg-[#4caf50] transition-all duration-300"
                style={{ width: `${movie.userRating}%` }}
              />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap text-theme-primary">
              {movie.userRating}%
            </span>
          </div>

          <div className="flex gap-4">
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

          <div
            className="space-y-2 text-theme-primary"
            data-testid="movie-synopsis"
            ref={synopsisRef}
          >
            <h2 className="text-xl font-semibold font-heading">Synopsis</h2>
            <p className="text-base leading-relaxed text-theme-secondary font-heading">
              {movie.overview || "Aucun synopsis disponible."}
            </p>
          </div>

          <div ref={crewRef}>
            <MovieCrewBuckets crewBuckets={crewBuckets} />
          </div>
        </div>

        {/* Poster (right on desktop, first on mobile) */}
        <div className="order-1 md:order-2" data-testid="movie-poster">
          {movie.posterUrl && (
            <div
              className="relative w-full pt-[150%] rounded-lg overflow-hidden"
              style={{ backgroundColor: "var(--surface-elevated)" }}
            >
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="420px"
                priority
              />
            </div>
          )}
        </div>
      </div>

      <MovieTrailers trailers={trailers} />

      <MovieCast cast={cast} totalCastCount={totalCastCount} movieId={movie.id} />
    </div>
  );
}

export default MovieDetail;
