import { request, tmdbLanguage } from "./client";
import {
  Movie,
  MovieDetails,
  NowPlayingResponse,
  SearchResponse,
  TimeWindow,
  TopRatedResponse,
  TrendingResponse,
} from "./types";

const isE2EMock = process.env.E2E_MOCK === "1" || process.env.NEXT_PUBLIC_E2E_MOCK === "1";

const makeMovie = (id: number): Movie => ({
  id,
  title: `Mock Movie ${id}`,
  overview: "Overview",
  poster_path: `/poster-${id}.jpg`,
  backdrop_path: `/backdrop-${id}.jpg`,
  release_date: "2025-11-26",
  vote_average: 7.5,
  vote_count: 100,
  genre_ids: [1],
});

const makeDetails = (id: number): MovieDetails => ({
  ...makeMovie(id),
  genres: [{ id: 1, name: "Genre" }],
  runtime: 120,
  production_companies: [],
  tagline: "",
  budget: 0,
  revenue: 0,
  credits: {
    cast: [
      { id: 10, name: "Cast A", character: "Role A", order: 0, profile_path: "/c1.jpg" },
      { id: 11, name: "Cast B", character: "Role B", order: 1, profile_path: "/c2.jpg" },
    ],
    crew: [
      { id: 20, name: "Director", job: "Director", department: "Directing", profile_path: null },
      { id: 21, name: "Producer", job: "Producer", department: "Production", profile_path: null },
    ],
  },
  videos: {
    results: [
      {
        id: "tr1",
        key: "abc123",
        name: "Trailer",
        site: "YouTube",
        type: "Trailer",
        official: true,
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
});

export const tmdbApi = {
  getTrending: (timeWindow: TimeWindow = "day") => {
    if (isE2EMock) {
      const results = [1, 2, 3, 4].map(makeMovie);
      return Promise.resolve({ results, page: 1, total_pages: 1, total_results: results.length });
    }
    return request<TrendingResponse>(`/trending/movie/${timeWindow}`);
  },

  getNowPlaying: (page: number = 1) => {
    if (isE2EMock) {
      const results = [5, 6, 7, 8].map(makeMovie);
      return Promise.resolve({ results, page, total_pages: 1, total_results: results.length });
    }
    return request<NowPlayingResponse>("/movie/now_playing", { params: { page } });
  },

  getTopRated: (page: number = 1) => {
    if (isE2EMock) {
      const results = [9, 10, 11, 12].map(makeMovie);
      return Promise.resolve({ results, page, total_pages: 1, total_results: results.length });
    }
    return request<TopRatedResponse>("/movie/top_rated", { params: { page } });
  },

  searchMovies: (query: string, page: number = 1) => {
    if (isE2EMock) {
      const base = (page - 1) * 3;
      const ids = [base + 13, base + 14, base + 15];
      const results = ids.map((id) => ({ ...makeMovie(id), title: `${query} ${id}` }));
      return Promise.resolve({
        results,
        page,
        total_pages: 2,
        total_results: 6,
      });
    }
    return request<SearchResponse>("/search/movie", { params: { query, page } });
  },

  getMovieDetails: (movieId: number) => {
    if (isE2EMock) {
      return Promise.resolve(makeDetails(movieId));
    }
    return request<MovieDetails>(`/movie/${movieId}`, {
      params: {
        append_to_response: "credits,videos,release_dates",
        include_image_language: `${tmdbLanguage},null`,
        language: tmdbLanguage,
      },
    });
  },
};
