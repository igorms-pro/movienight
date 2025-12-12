import { Credits, MovieDetails, Video } from "@/lib/tmdb/types";

export type CrewBucket = { label: string; names: string[] };

export type MovieDetailView = {
  movie: Pick<
    MovieDetails,
    "id" | "title" | "overview" | "runtime" | "genres" | "release_date" | "vote_average"
  > & {
    releaseYear: number;
    certification: string | null;
    userRating: number;
    posterUrl: string | null;
    poster_path?: string | null;
    backdrop_path?: string | null;
  };
  trailers: Video[];
  crewBuckets: CrewBucket[];
  cast: Credits["cast"];
  totalCastCount: number;
};
