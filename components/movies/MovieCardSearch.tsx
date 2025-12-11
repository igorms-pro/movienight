"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Movie } from "@/lib/tmdb/types";

type Props = {
  movie: Movie;
};

export default function MovieCardSearch({ movie }: Props) {
  const router = useRouter();
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  return (
    <button
      type="button"
      onClick={() => router.push(`/movie/${movie.id}`)}
      className="text-left cursor-pointer transition-transform duration-150 hover:scale-[1.02]"
      data-testid="search-card"
    >
      <div className="relative w-full pt-[150%] rounded-lg overflow-hidden bg-[#1a1a1a]">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            sizes="220px"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs">
            N/A
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <div className="font-semibold text-white leading-tight line-clamp-2">{movie.title}</div>
        {year && <div className="text-sm text-white/60">{year}</div>}
      </div>
    </button>
  );
}
