"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, KIND, SIZE } from "baseui/button";
import { MovieDetails } from "@/lib/tmdb/types";

type Props = {
  movies: MovieDetails[];
};

export default function HeroCarousel({ movies }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayMovies = movies.slice(0, 4);

  useEffect(() => {
    if (displayMovies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayMovies.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [displayMovies.length]);

  const currentMovie = displayMovies[currentIndex];

  if (!currentMovie) return null;

  return (
    <div className="w-full mb-[60px] relative">
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{ height: "clamp(250px, 20.83vw, 500px)" }}
      >
        <div className="relative w-full h-full">
          {displayMovies.map((movie, index) => {
            const backdropUrl = movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
              : null;

            const isActive = index === currentIndex;
            const isPrevious = index < currentIndex;

            return (
              <div
                key={`${movie.id}-${index}`}
                className={`absolute top-0 left-0 w-full h-full transition-all duration-600 ease-in-out ${
                  isActive ? "opacity-100 z-10 translate-y-0" : "opacity-0 z-0 pointer-events-none"
                }`}
                style={{
                  transform: isActive
                    ? "translateY(0)"
                    : isPrevious
                      ? "translateY(-100%)"
                      : "translateY(100%)",
                }}
              >
                {backdropUrl && (
                  <Image
                    src={backdropUrl}
                    alt={movie.title}
                    fill
                    style={{ objectFit: "cover" }}
                    priority={index === 0}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div
          className="absolute inset-0 z-20"
          style={{
            background:
              "linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[200px] z-20"
          style={{
            background: "linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end z-30 px-8 pb-8">
          <h1 className="text-[48px] font-bold mb-4 text-white uppercase max-w-[500px] leading-[1.1]">
            {currentMovie.title} ({new Date(currentMovie.release_date).getFullYear()})
          </h1>
          <div className="flex gap-4 items-start">
            <Button kind={KIND.primary} size={SIZE.compact} onClick={() => {}}>
              Regarder
            </Button>
            <Button
              kind={KIND.secondary}
              size={SIZE.compact}
              onClick={() => router.push(`/movie/${currentMovie.id}`)}
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[50px] flex flex-col items-center gap-2 z-40">
        {displayMovies.length > 0 && (
          <div className="flex flex-col gap-2 items-center">
            {displayMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="border-none bg-transparent cursor-pointer p-0 transition-all duration-300 hover:opacity-100 flex items-center justify-center"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={`w-1.5 bg-white transition-all duration-300 ${
                    index === currentIndex
                      ? "h-5 rounded-sm opacity-100"
                      : "h-1.5 rounded-full opacity-60"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
