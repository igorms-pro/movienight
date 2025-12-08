import { request, tmdbLanguage } from "./client";
import {
  MovieDetails,
  NowPlayingResponse,
  SearchResponse,
  TimeWindow,
  TopRatedResponse,
  TrendingResponse,
} from "./types";

export const tmdbApi = {
  getTrending: (timeWindow: TimeWindow = "day") =>
    request<TrendingResponse>(`/trending/movie/${timeWindow}`),

  getNowPlaying: (page: number = 1) =>
    request<NowPlayingResponse>("/movie/now_playing", { params: { page } }),

  getTopRated: (page: number = 1) =>
    request<TopRatedResponse>("/movie/top_rated", { params: { page } }),

  searchMovies: (query: string, page: number = 1) =>
    request<SearchResponse>("/search/movie", { params: { query, page } }),

  getMovieDetails: (movieId: number) =>
    request<MovieDetails>(`/movie/${movieId}`, {
      params: {
        append_to_response: "credits,videos,release_dates",
        include_image_language: `${tmdbLanguage},null`,
        language: tmdbLanguage,
      },
    }),
};
