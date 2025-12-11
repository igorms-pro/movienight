import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const setupTmdbMock = () => {
  const getTrending = vi.fn().mockResolvedValue({
    results: [
      { id: 1, title: "A" },
      { id: 2, title: "B" },
      { id: 3, title: "C" },
    ],
  });
  const getNowPlaying = vi.fn().mockResolvedValue({
    results: [
      { id: 4, title: "Now" },
      { id: 5, title: "Later" },
    ],
  });
  const getTopRated = vi.fn().mockResolvedValue({
    results: [
      { id: 6, title: "Top" },
      { id: 7, title: "Rated" },
    ],
  });
  const getMovieDetails = vi
    .fn()
    .mockImplementation((id: number) => Promise.resolve({ id, title: `Detail ${id}` }));

  vi.doMock("@/lib/tmdb/api", () => ({
    tmdbApi: { getTrending, getNowPlaying, getTopRated, getMovieDetails },
  }));

  return { getTrending, getNowPlaying, getTopRated, getMovieDetails };
};

describe("useMovies hooks", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("returns sliced trending results", async () => {
    const api = setupTmdbMock();
    const { useTrendingMovies } = await import("@/hooks/useMovies");
    const { result } = renderHook(() => useTrendingMovies(2));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(2);
    expect(api.getTrending).toHaveBeenCalledTimes(1);
  });

  it("handles errors in now playing", async () => {
    const getNowPlaying = vi.fn().mockRejectedValue(new Error("fail"));
    vi.doMock("@/lib/tmdb/api", () => ({
      tmdbApi: {
        getTrending: vi.fn(),
        getNowPlaying,
        getTopRated: vi.fn(),
        getMovieDetails: vi.fn(),
      },
    }));

    const { useNowPlayingMovies } = await import("@/hooks/useMovies");
    const { result } = renderHook(() => useNowPlayingMovies());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("fail");
    expect(result.current.data).toEqual([]);
  });

  it("fetches featured movies with details", async () => {
    const api = setupTmdbMock();
    const { useFeaturedMovies } = await import("@/hooks/useMovies");
    const { result } = renderHook(() => useFeaturedMovies(2));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toHaveLength(2);
    expect(api.getTrending).toHaveBeenCalledTimes(1);
    expect(api.getMovieDetails).toHaveBeenCalledTimes(2);
  });
});
