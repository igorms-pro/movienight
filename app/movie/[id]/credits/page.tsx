/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { tmdbApi } from "@/lib/tmdb/api";
import MovieCredits from "@/components/details/MovieCredits";
import { MovieDetails } from "@/lib/tmdb/types";

type PageProps = {
  params: { id: string };
};

function buildMockData(id: number) {
  const movie: MovieDetails = {
    id,
    title: "Zootopie 2",
    overview: "Une suite attendue.",
    release_date: "2025-11-26",
    vote_average: 7.8,
    vote_count: 1000,
    genres: [
      { id: 16, name: "Animation" },
      { id: 35, name: "Comédie" },
    ],
    runtime: 105,
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
    production_companies: [],
    tagline: "",
    budget: 0,
    revenue: 0,
    videos: { results: [] },
    credits: {
      cast: [
        { id: 10, name: "Judy Hopps", character: "Judy", order: 0, profile_path: "/c1.jpg" },
        { id: 11, name: "Nick Wilde", character: "Nick", order: 1, profile_path: "/c2.jpg" },
      ],
      crew: [
        {
          id: 20,
          name: "Byron Howard",
          job: "Director",
          department: "Directing",
          profile_path: null,
        },
        {
          id: 21,
          name: "Clark Spencer",
          job: "Producer",
          department: "Production",
          profile_path: null,
        },
      ],
    },
    release_dates: {
      results: [
        {
          iso_3166_1: "US",
          release_dates: [{ certification: "PG" }],
        },
      ],
    },
  };
  return { movie, credits: movie.credits };
}

export default function MovieCreditsPage({ params }: PageProps) {
  const movieId = Number(params.id);
  if (!movieId || Number.isNaN(movieId)) {
    notFound();
  }

  const [data, setData] = useState<{
    movie: MovieDetails;
    credits?: MovieDetails["credits"];
  } | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (process.env.NEXT_PUBLIC_E2E_MOCK === "1" || process.env.E2E_MOCK === "1") {
          if (active) setData(buildMockData(movieId));
          return;
        }
        const movie = await tmdbApi.getMovieDetails(movieId);
        if (!movie || !movie.credits) return;
        if (active) setData({ movie, credits: movie.credits });
      } catch (error) {
        console.error("Error loading credits page", error);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [movieId]);

  if (!data || !data.credits) return null;

  return (
    <div data-page="credits">
      <MovieCredits movie={data.movie} credits={data.credits} />
    </div>
  );
}
