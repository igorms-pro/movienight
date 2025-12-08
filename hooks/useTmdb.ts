"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { tmdbApi } from "@/lib/tmdb/api";
import {
  MovieDetails,
  NowPlayingResponse,
  SearchResponse,
  TimeWindow,
  TopRatedResponse,
  TrendingResponse,
} from "@/lib/tmdb/types";

type Resource<T> = {
  data?: T;
  error: Error | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function useTmdbResource<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  enabled = true,
): Resource<T> {
  const initial = useMemo(() => {
    if (!key) return undefined;
    return cache.get(key) as T | undefined;
  }, [key]);

  const [data, setData] = useState<T | undefined>(initial);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(!!key && enabled && !initial);

  useEffect(() => {
    if (!enabled || !key) return;

    let mounted = true;
    const run = async () => {
      if (cache.has(key)) {
        setData(cache.get(key) as T);
        setLoading(false);
        return;
      }

      setLoading(true);
      const pending = inflight.get(key) ?? fetcher();
      inflight.set(key, pending);

      try {
        const result = (await pending) as T;
        if (!mounted) return;
        cache.set(key, result);
        setData(result);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err : new Error("TMDB request failed");
        setError(message);
      } finally {
        if (inflight.get(key) === pending) {
          inflight.delete(key);
        }
        if (mounted) {
          setLoading(false);
        }
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [enabled, fetcher, key]);

  const refresh = useCallback(async () => {
    if (!key) return;
    cache.delete(key);
    setLoading(true);
    try {
      const result = await fetcher();
      cache.set(key, result);
      setData(result);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err : new Error("TMDB request failed");
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetcher, key]);

  return { data, error, isLoading, refresh };
}

export function useTrending(timeWindow: TimeWindow = "day", enabled = true) {
  const key = enabled ? `trending:${timeWindow}` : null;
  const fetcher = useCallback(() => tmdbApi.getTrending(timeWindow), [timeWindow]);
  return useTmdbResource<TrendingResponse>(key, fetcher, enabled);
}

export function useNowPlaying(page = 1, enabled = true) {
  const key = enabled ? `now-playing:${page}` : null;
  const fetcher = useCallback(() => tmdbApi.getNowPlaying(page), [page]);
  return useTmdbResource<NowPlayingResponse>(key, fetcher, enabled);
}

export function useTopRated(page = 1, enabled = true) {
  const key = enabled ? `top-rated:${page}` : null;
  const fetcher = useCallback(() => tmdbApi.getTopRated(page), [page]);
  return useTmdbResource<TopRatedResponse>(key, fetcher, enabled);
}

export function useSearchMovies(query: string, page = 1, enabled = true) {
  const active = enabled && query.trim().length > 0;
  const key = active ? `search:${query}:${page}` : null;
  const fetcher = useCallback(() => tmdbApi.searchMovies(query, page), [page, query]);
  return useTmdbResource<SearchResponse>(key, fetcher, active);
}

export function useMovieDetails(movieId: number | null, enabled = true) {
  const active = enabled && !!movieId;
  const key = active ? `movie:${movieId}` : null;
  const fetcher = useCallback(() => tmdbApi.getMovieDetails(movieId as number), [movieId]);
  return useTmdbResource<MovieDetails>(key, fetcher, active);
}
