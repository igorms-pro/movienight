import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
const MovieDetail = dynamic(() => import("@/components/details/MovieDetail"), { ssr: false });
import { MovieDetailView } from "@/components/details/types";
import { tmdbApi } from "@/lib/tmdb/api";
import { pickCertification, pickCrewBuckets, pickTrailers } from "@/lib/movie/normalizers";

export const revalidate = 300;

type PageProps = {
  params: { id: string };
};

function buildMockMovie(id: number): MovieDetailView {
  const mock = {
    id,
    title: "Zootopie 2",
    overview: "Une suite attendue.",
    runtime: 105,
    genres: [
      { id: 16, name: "Animation" },
      { id: 35, name: "Comédie" },
    ],
    release_date: "2025-11-26",
    vote_average: 7.8,
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
    videos: {
      results: [
        {
          id: "tr1",
          key: "abc123",
          name: "Bande-annonce",
          site: "YouTube",
          type: "Trailer",
          official: true,
        },
      ],
    },
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

  const posterUrl = `https://image.tmdb.org/t/p/w780${mock.poster_path}`;
  const certification = pickCertification(mock.release_dates);
  const trailers = pickTrailers(mock.videos);
  const crewBuckets = pickCrewBuckets(mock.credits?.crew);
  const cast = mock.credits?.cast || [];
  // Provide more total cast than shown to surface the "see all" button in e2e.
  const totalCastCount = cast.length + 10;

  return {
    movie: {
      id: mock.id,
      title: mock.title,
      overview: mock.overview,
      runtime: mock.runtime,
      genres: mock.genres,
      release_date: mock.release_date,
      vote_average: mock.vote_average,
      releaseYear: mock.release_date ? new Date(mock.release_date).getFullYear() : 0,
      certification,
      userRating: Math.round(mock.vote_average * 10),
      posterUrl,
    },
    trailers,
    crewBuckets,
    cast,
    totalCastCount,
  };
}

async function getMovieData(id: number): Promise<MovieDetailView | null> {
  if (process.env.E2E_MOCK === "1") {
    return buildMockMovie(id);
  }
  try {
    const movie = await tmdbApi.getMovieDetails(id);
    if (!movie) return null;

    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
      : null;
    const certification = pickCertification(movie.release_dates);
    const trailers = pickTrailers(movie.videos);
    const crewBuckets = pickCrewBuckets(movie.credits?.crew);
    const cast = movie.credits?.cast || [];

    return {
      movie: {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        runtime: movie.runtime,
        genres: movie.genres,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
        certification,
        userRating: Math.round(movie.vote_average * 10),
        posterUrl,
      },
      trailers,
      crewBuckets,
      cast,
      totalCastCount: cast.length,
    };
  } catch (error) {
    console.error("Error fetching movie details", error);
    return null;
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  const movieId = Number(params.id);
  if (!movieId || Number.isNaN(movieId)) {
    notFound();
  }

  const data = await getMovieData(movieId);
  if (!data) {
    notFound();
  }

  return <MovieDetail data={data} />;
}
