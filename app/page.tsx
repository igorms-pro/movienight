"use client";

import React from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { useFeaturedMovies, useNowPlayingMovies, useTopRatedMovies } from "@/hooks/useMovies";

const HeroCarousel = dynamic(() => import("@/components/hero/HeroCarousel"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

const MovieCarousel = dynamic(() => import("@/components/movies/MovieCarousel"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export default function HomePage() {
  const {
    data: featuredMovies,
    isLoading: loadingFeatured,
    error: featuredError,
  } = useFeaturedMovies(4);
  const {
    data: nowPlayingMovies,
    isLoading: loadingNowPlaying,
    error: nowPlayingError,
  } = useNowPlayingMovies(20);
  const {
    data: topRatedMovies,
    isLoading: loadingTopRated,
    error: topRatedError,
  } = useTopRatedMovies(20);
  const isLoading = loadingFeatured || loadingNowPlaying || loadingTopRated;
  const error = featuredError || nowPlayingError || topRatedError;

  return (
    <div className="w-full">
      {!isLoading && featuredMovies.length > 0 && <HeroCarousel movies={featuredMovies} />}

      {isLoading && <LoadingSpinner />}

      {!isLoading && error && (
        <div className="text-center text-red-300 mt-6">
          Une erreur est survenue lors du chargement des données.
        </div>
      )}

      {!isLoading && !error && (
        <>
          {nowPlayingMovies.length > 0 && (
            <MovieCarousel
              movies={nowPlayingMovies}
              title="À l'affiche cette semaine"
              showDuration
            />
          )}

          {topRatedMovies.length > 0 && (
            <MovieCarousel movies={topRatedMovies} title="Les films les mieux notés" showRating />
          )}
        </>
      )}
    </div>
  );
}
