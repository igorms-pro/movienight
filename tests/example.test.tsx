import { vi } from "vitest";

vi.mock("@/hooks/useMovies", () => ({
  useFeaturedMovies: () => ({ data: [], isLoading: false, error: null }),
  useNowPlayingMovies: () => ({ data: [], isLoading: false, error: null }),
  useTopRatedMovies: () => ({ data: [], isLoading: false, error: null }),
}));

vi.mock("@/lib/tmdb/api", () => ({
  tmdbApi: {
    getTrending: async () => ({ results: [] }),
    getNowPlaying: async () => ({ results: [] }),
    getTopRated: async () => ({ results: [] }),
    getMovieDetails: async () => ({}),
  },
}));

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

describe("HomePage", () => {
  it("module loads without crashing", async () => {
    await expect(import("@/app/page")).resolves.toBeTruthy();
  });
});
