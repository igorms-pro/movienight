"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "baseui/skeleton";
import { Movie, MovieDetails } from "@/lib/tmdb/types";

type Props = {
  movie: Movie | MovieDetails;
  showRating?: boolean;
  showDuration?: boolean;
  className?: string;
};

export default function MovieCardCarousel({
  movie,
  showRating = false,
  showDuration = false,
  className,
}: Props) {
  const router = useRouter();

  const Poster = ({ src, title }: { src?: string; title: string }) => {
    const [loaded, setLoaded] = useState(false);
    return (
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ aspectRatio: "4 / 5" }}
      >
        {!loaded && (
          <Skeleton
            width="100%"
            height="100%"
            animation
            overrides={{
              Root: {
                style: {
                  position: "absolute",
                  inset: 0,
                  borderRadius: "4px",
                  backgroundColor: "#3a3a3a",
                },
              },
            }}
          />
        )}
        {src ? (
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 900px) 150px, (max-width: 1200px) 175px, 190px"
            style={{ objectFit: "cover", borderRadius: "4px" }}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        ) : (
          <div className="text-[#666] text-sm text-center p-5">Pas d&apos;image</div>
        )}
      </div>
    );
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const runtime = "runtime" in movie ? movie.runtime : null;
  const rating = showRating ? Math.round(movie.vote_average * 10) : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/movie/${movie.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/movie/${movie.id}`);
        }
      }}
      data-testid="movie-card"
      data-movie-id={movie.id}
      className={`cursor-pointer bg-transparent overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_6px_12px_rgba(0,0,0,0.35)] focus:outline-none ${
        className || "w-full"
      }`}
    >
      <Poster
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined}
        title={movie.title}
      />

      <div className="p-3">
        <h3 className="text-sm font-semibold mb-2 overflow-hidden text-ellipsis whitespace-nowrap text-white leading-[1.4]">
          {movie.title}
        </h3>
        {showRating && rating !== null ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-[#333] rounded-sm overflow-hidden">
              <div
                className="h-full bg-[#4caf50] transition-all duration-300"
                style={{ width: `${rating}%` }}
              />
            </div>
            <span className="text-sm text-white font-semibold min-w-[32px]">{rating}%</span>
          </div>
        ) : showDuration && runtime ? (
          <p className="text-xs text-[#999]">{formatRuntime(runtime)}</p>
        ) : (
          movie.release_date && (
            <p className="text-xs text-[#999]">{new Date(movie.release_date).getFullYear()}</p>
          )
        )}
      </div>
    </div>
  );
}
