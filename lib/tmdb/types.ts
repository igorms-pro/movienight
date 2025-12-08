export type TimeWindow = "day" | "week";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  tagline: string;
  budget: number;
  revenue: number;
  credits?: Credits;
  videos?: VideosResponse;
  release_dates?: ReleaseDatesResponse;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  iso_639_1?: string;
  iso_3166_1?: string;
}

export interface VideosResponse {
  results: Video[];
}

export interface ReleaseDatesResponse {
  results: Array<{
    iso_3166_1: string;
    release_dates: Array<{
      certification: string;
    }>;
  }>;
}

export interface Paginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type SearchResponse = Paginated<Movie>;
export type TrendingResponse = Paginated<Movie>;
export type TopRatedResponse = Paginated<Movie>;
export type NowPlayingResponse = Paginated<Movie>;
