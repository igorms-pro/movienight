"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, KIND, SIZE, SHAPE as BTN_SHAPE } from "baseui/button";
import { Play, Info } from "lucide-react";
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
    <div className="w-full mb-[60px] relative" data-testid="hero-carousel">
      <div className="relative w-full overflow-hidden rounded-xl aspect-video max-h-[320px] min-h-[180px] md:max-h-[520px] md:min-h-[200px]">
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
                data-testid="hero-slide"
                data-movie-id={movie.id}
                className={`absolute top-0 left-0 w-full h-full transition-all duration-600 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                } ${isActive ? "translate-y-0" : isPrevious ? "-translate-y-full" : "translate-y-full"}`}
              >
                {backdropUrl && (
                  <Image
                    src={backdropUrl}
                    alt={movie.title}
                    fill
                    priority={index === 0}
                    className="object-contain md:object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="absolute inset-0 z-20 bg-[linear-gradient(to_right,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.4)_50%,transparent_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[140px] md:h-[200px] z-20 bg-[linear-gradient(to_top,rgba(0,0,0,0.9),transparent)]" />

        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end z-30 px-4 pb-5 md:px-8 md:pb-8">
          <h1 className="text-2xl md:text-[48px] font-bold mb-3 md:mb-4 text-white uppercase max-w-[320px] md:max-w-[500px] leading-[1.1]">
            {currentMovie.title} ({new Date(currentMovie.release_date).getFullYear()})
          </h1>
          <div className="hidden md:flex gap-3 md:gap-4 items-start">
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

      {/* Mobile CTAs + dots inline below image */}
      {displayMovies.length > 0 && (
        <div
          className="mt-4 flex items-center justify-center gap-4 md:hidden"
          data-testid="hero-mobile-ctas"
        >
          <div className="flex items-center gap-2">
            <Button
              kind={KIND.primary}
              size={SIZE.mini}
              shape={BTN_SHAPE.circle}
              aria-label="Regarder"
              data-testid="hero-mobile-play"
              onClick={() => router.push(`/movie/${currentMovie.id}`)}
            >
              <Play size={18} strokeWidth={2} />
            </Button>
            <Button
              kind={KIND.secondary}
              size={SIZE.mini}
              shape={BTN_SHAPE.circle}
              aria-label="En savoir plus"
              data-testid="hero-mobile-info"
              onClick={() => router.push(`/movie/${currentMovie.id}`)}
            >
              <Info size={18} strokeWidth={2} />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2" data-testid="hero-dots-mobile">
            {displayMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="border-none bg-transparent cursor-pointer p-0 transition-all duration-300 hover:opacity-100 flex items-center justify-center"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={`bg-white transition-all duration-300 ${
                    index === currentIndex
                      ? "w-4 h-2 rounded-sm opacity-100"
                      : "w-2 h-2 rounded-full opacity-60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {displayMovies.length > 0 && (
        <>
          {/* Desktop dots */}
          <div
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 translate-x-[28px] right-0 flex-col items-center justify-center gap-2 z-40"
            data-testid="hero-dots-desktop"
          >
            {displayMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="border-none bg-transparent cursor-pointer p-0 transition-all duration-300 hover:opacity-100 flex items-center justify-center"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={`bg-white transition-all duration-300 ${
                    index === currentIndex
                      ? "w-4 h-2 rounded-sm opacity-100"
                      : "w-2 h-2 rounded-full opacity-60"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
