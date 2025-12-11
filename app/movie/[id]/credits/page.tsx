import { notFound } from "next/navigation";
import { tmdbApi } from "@/lib/tmdb/api";
import MovieCredits from "@/components/details/MovieCredits";

export const revalidate = 300;

type PageProps = {
  params: { id: string };
};

async function getData(id: number) {
  try {
    const movie = await tmdbApi.getMovieDetails(id);
    if (!movie) return null;
    const credits = movie.credits || null;
    return { movie, credits };
  } catch (error) {
    console.error("Error loading credits page", error);
    return null;
  }
}

export default async function MovieCreditsPage({ params }: PageProps) {
  const movieId = Number(params.id);
  if (!movieId || Number.isNaN(movieId)) {
    notFound();
  }

  const data = await getData(movieId);
  if (!data || !data.credits) {
    notFound();
  }

  const { movie, credits } = data;

  return <MovieCredits movie={movie} credits={credits} />;
}
