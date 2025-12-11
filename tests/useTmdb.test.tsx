import { renderHook, waitFor, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const setupTmdbMock = () => {
  const getTrending = vi.fn().mockResolvedValue({ results: [{ id: 1 }] });
  const getNowPlaying = vi.fn().mockResolvedValue({ results: [{ id: 2 }] });
  const getTopRated = vi.fn().mockResolvedValue({ results: [{ id: 3 }] });
  const searchMovies = vi.fn().mockResolvedValue({ results: [{ id: 4, title: "Query" }] });
  const getMovieDetails = vi.fn().mockResolvedValue({ id: 5, title: "Detail" });

  vi.doMock("@/lib/tmdb/api", () => ({
    tmdbApi: { getTrending, getNowPlaying, getTopRated, searchMovies, getMovieDetails },
  }));

  return { getTrending, getNowPlaying, getTopRated, searchMovies, getMovieDetails };
};

describe("useTmdb hooks", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("fetches trending and caches subsequent calls", async () => {
    const api = setupTmdbMock();
    const { useTrending } = await import("@/hooks/useTmdb");

    const { result, rerender } = renderHook(() => useTrending("day"));
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(api.getTrending).toHaveBeenCalledTimes(1);

    rerender();
    expect(result.current.data).toBeDefined();
    expect(api.getTrending).toHaveBeenCalledTimes(1); // cached
  });

  it("refresh clears cache and refetches", async () => {
    const api = setupTmdbMock();
    const { useTrending } = await import("@/hooks/useTmdb");

    const { result } = renderHook(() => useTrending("week"));
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(api.getTrending).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refresh();
    });

    expect(api.getTrending).toHaveBeenCalledTimes(2);
  });

  it("searchMovies is skipped when disabled", async () => {
    const api = setupTmdbMock();
    const { useSearchMovies } = await import("@/hooks/useTmdb");

    const { result, rerender } = renderHook(({ q, enabled }) => useSearchMovies(q, 1, enabled), {
      initialProps: { q: "ab", enabled: false },
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(api.searchMovies).not.toHaveBeenCalled();

    rerender({ q: "avatar", enabled: true });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(api.searchMovies).toHaveBeenCalledTimes(1);
  });

  it("handles errors and exposes error state", async () => {
    const getTrending = vi.fn().mockRejectedValue(new Error("boom"));
    vi.doMock("@/lib/tmdb/api", () => ({
      tmdbApi: { getTrending },
    }));

    const { useTrending } = await import("@/hooks/useTmdb");
    const { result } = renderHook(() => useTrending("day"));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.isLoading).toBe(false);
  });
});
