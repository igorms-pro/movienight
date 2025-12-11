import { notFound } from "next/navigation";
import MovieDetail, { MovieDetailView } from "@/components/details/MovieDetail";
import { tmdbApi } from "@/lib/tmdb/api";
import { MovieDetails } from "@/lib/tmdb/types";

export const revalidate = 300;

type PageProps = {
  params: { id: string };
};

const pickCertification = (releaseDates: MovieDetails["release_dates"]) => {
  const preferredRegions = ["US", "FR", "GB"];
  const entries = releaseDates?.results || [];
  for (const region of preferredRegions) {
    const cert = entries
      .find((r) => r.iso_3166_1 === region)
      ?.release_dates?.find((d) => d.certification)?.certification;
    if (cert) return cert;
  }
  return null;
};

const pickTrailers = (videos: MovieDetails["videos"]) =>
  videos?.results?.filter((v) => v.type === "Trailer").slice(0, 3) || [];

const pickCrewBuckets = (crew: NonNullable<MovieDetails["credits"]>["crew"] = []) => {
  const uniqueNames = (list: typeof crew) => Array.from(new Set(list.map((c) => c.name)));
  const buckets = [
    { label: "Director", names: uniqueNames(crew.filter((c) => c.job === "Director")) },
    { label: "Producer", names: uniqueNames(crew.filter((c) => c.job === "Producer")) },
    {
      label: "Executive Producer",
      names: uniqueNames(crew.filter((c) => c.job === "Executive Producer")),
    },
    {
      label: "Screenplay, Story",
      names: uniqueNames(crew.filter((c) => ["Screenplay", "Writer", "Story"].includes(c.job))),
    },
  ];
  return buckets.filter((b) => b.names.length > 0).slice(0, 4);
};

async function getMovieData(id: number): Promise<MovieDetailView | null> {
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
