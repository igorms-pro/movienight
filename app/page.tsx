import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { tmdbApi } from "@/lib/tmdb/api";
import { Movie, MovieDetails } from "@/lib/tmdb/types";

export const revalidate = 300;

const HeroCarousel = dynamic(() => import("@/components/hero/HeroCarousel"), {
  ssr: false,
});

const MovieCarousel = dynamic(() => import("@/components/movies/MovieCarousel"), {
  ssr: false,
});

async function fetchFeaturedMovies(count = 4): Promise<MovieDetails[]> {
  const trending = await tmdbApi.getTrending("day");
  const ids = trending.results.slice(0, count).map((movie) => movie.id);
  const detailed = await Promise.all(
    ids.map(async (id) => {
      try {
        return await tmdbApi.getMovieDetails(id);
      } catch {
        return null;
      }
    }),
  );
  return detailed.filter((movie): movie is MovieDetails => Boolean(movie));
}

async function fetchNowPlaying(limit = 20): Promise<Movie[]> {
  const response = await tmdbApi.getNowPlaying(1);
  return response.results.slice(0, limit);
}

async function fetchTopRated(limit = 20): Promise<Movie[]> {
  const response = await tmdbApi.getTopRated(1);
  return response.results.slice(0, limit);
}

function SectionError({ message }: { message: string }) {
  return <div className="mt-3 text-sm text-red-300">{message}</div>;
}

function HeroSkeleton() {
  return (
    <div className="w-full mb-[60px] relative">
      <div
        className="relative w-full overflow-hidden rounded-xl bg-[#1f1f1f] animate-pulse"
        style={{ height: "clamp(250px, 20.83vw, 500px)" }}
      />
    </div>
  );
}

function CarouselSkeleton({ title }: { title: string }) {
  return (
    <div className="w-full mb-[60px]">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      <div className="relative max-w-[1150px] mx-auto px-4">
        <div className="flex gap-[12px] overflow-hidden">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="shrink-0 w-[190px] md:w-[175px] sm:w-[150px] h-[280px] rounded-md bg-[#1f1f1f] animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

async function HeroSection() {
  try {
    const featured = await fetchFeaturedMovies(4);
    if (!featured.length) return null;
    return <HeroCarousel movies={featured} />;
  } catch (error) {
    return (
      <SectionError
        message={
          error instanceof Error
            ? `Erreur lors du chargement des films à la une : ${error.message}`
            : "Erreur lors du chargement des films à la une."
        }
      />
    );
  }
}

async function NowPlayingSection() {
  try {
    const movies = await fetchNowPlaying(20);
    if (!movies.length) return null;
    return <MovieCarousel movies={movies} title="À l'affiche cette semaine" showDuration />;
  } catch (error) {
    return (
      <SectionError
        message={
          error instanceof Error
            ? `Erreur lors du chargement des sorties : ${error.message}`
            : "Erreur lors du chargement des sorties."
        }
      />
    );
  }
}

async function TopRatedSection() {
  try {
    const movies = await fetchTopRated(20);
    if (!movies.length) return null;
    return <MovieCarousel movies={movies} title="Les films les mieux notés" showRating />;
  } catch (error) {
    return (
      <SectionError
        message={
          error instanceof Error
            ? `Erreur lors du chargement des meilleurs films : ${error.message}`
            : "Erreur lors du chargement des meilleurs films."
        }
      />
    );
  }
}

export default function HomePage() {
  return (
    <div className="w-full" data-testid="home-page">
      <section data-testid="hero-section">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection />
        </Suspense>
      </section>

      <section data-testid="now-playing-section">
        <Suspense fallback={<CarouselSkeleton title="À l'affiche cette semaine" />}>
          <NowPlayingSection />
        </Suspense>
      </section>

      <section data-testid="top-rated-section">
        <Suspense fallback={<CarouselSkeleton title="Les films les mieux notés" />}>
          <TopRatedSection />
        </Suspense>
      </section>
    </div>
  );
}
