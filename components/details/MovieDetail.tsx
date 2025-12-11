"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, KIND as BTN_KIND, SHAPE as BTN_SHAPE, SIZE as BTN_SIZE } from "baseui/button";
import { MovieDetails, Video, Credits } from "@/lib/tmdb/types";

type CrewBucket = { label: string; names: string[] };

export type MovieDetailView = {
  movie: Pick<
    MovieDetails,
    "id" | "title" | "overview" | "runtime" | "genres" | "release_date" | "vote_average"
  > & {
    releaseYear: number;
    certification: string | null;
    userRating: number;
    posterUrl: string | null;
  };
  trailers: Video[];
  crewBuckets: CrewBucket[];
  cast: Credits["cast"];
  totalCastCount: number;
};

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
  const mainCast = cast.slice(0, 12);
  const hasMoreCast = totalCastCount > mainCast.length;

  return (
    <div className="py-[60px]" data-testid="movie-detail">
      <div className="mb-6">
        <Button
          onClick={() => router.back()}
          kind={BTN_KIND.secondary}
          size={BTN_SIZE.compact}
          shape={BTN_SHAPE.pill}
          data-testid="movie-back-button"
        >
          ← Retour
        </Button>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-[48px] mb-[60px] max-[1024px]:grid-cols-1">
        {/* Left Column - Movie Info */}
        <div className="max-w-[600px]" data-testid="movie-overview">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-[42px] md:text-[48px] font-bold uppercase leading-[1.1]">
              {movie.title} ({movie.releaseYear})
            </h1>
            {movie.certification && (
              <span className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-sm text-white/80">
                {movie.certification}
              </span>
            )}
          </div>

          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 text-base text-white/70">
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

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
            <p className="text-base leading-relaxed text-white/80">
              {movie.overview || "Aucun synopsis disponible."}
            </p>
          </div>

          {crewBuckets.length > 0 && (
            <div
              className="grid grid-cols-2 gap-x-10 gap-y-3 max-[640px]:grid-cols-1"
              data-testid="movie-crew"
            >
              {crewBuckets.map((bucket) => (
                <div key={bucket.label}>
                  <div className="text-lg text-white/90">{bucket.label}</div>
                  <div className="text-lg text-white">{bucket.names.join(", ")}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Poster */}
        <div className="max-[1024px]:-order-1" data-testid="movie-poster">
          {movie.posterUrl && (
            <div className="relative w-full pt-[150%] rounded-lg overflow-hidden bg-[#1a1a1a]">
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

      {trailers.length > 0 && (
        <div className="mb-[60px]" data-testid="movie-trailers">
          <h2 className="text-2xl font-semibold mb-6">Bandes annonces</h2>
          <div className="flex gap-4 overflow-x-auto pb-2.5 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {trailers.map((video) => (
              <button
                key={video.id}
                className="shrink-0 w-80 text-left cursor-pointer"
                onClick={() =>
                  window.open(`https://www.youtube.com/watch?v=${video.key}`, "_blank")
                }
              >
                <div className="relative w-full pt-[56.25%] bg-[#1a1a1a] rounded-lg overflow-hidden mb-2">
                  <Image
                    src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                    alt={video.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="320px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-[60px] h-[60px] rounded-full bg-white/90 flex items-center justify-center text-2xl text-black">
                      ▶
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#999] uppercase">{video.type}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {mainCast.length > 0 && (
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
            {hasMoreCast && (
              <Button
                kind={BTN_KIND.tertiary}
                size={BTN_SIZE.default}
                onClick={() => router.push(`/movie/${movie.id}/credits`)}
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
      )}
    </div>
  );
}

export default MovieDetail;
