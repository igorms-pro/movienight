import { useCallback, useEffect, useState } from "react";
import { tmdbApi } from "@/lib/tmdb/api";
import { Movie, MovieDetails } from "@/lib/tmdb/types";

type MovieListState = {
  data: Movie[];
  isLoading: boolean;
  error: string | null;
};

type MovieDetailsState = {
  data: MovieDetails[];
  isLoading: boolean;
  error: string | null;
};

const fetchLimited = (movies: Movie[], limit: number) => movies.slice(0, limit);

const useAsync = <T>(fetcher: () => Promise<T>, deps: unknown[] = []) => {
  const [state, setState] = useState<{
    data: T | null;
    isLoading: boolean;
    error: string | null;
  }>({
    data: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const result = await fetcher();
        if (!cancelled) {
          setState({ data: result, isLoading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Une erreur est survenue",
          });
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
};

export const useTrendingMovies = (limit = 20) => {
  const { data, isLoading, error } = useAsync(async () => {
    const response = await tmdbApi.getTrending("day");
    return fetchLimited(response.results, limit);
  }, [limit]);

  return {
    data: data ?? [],
    isLoading,
    error,
  } as MovieListState;
};

export const useNowPlayingMovies = (limit = 20) => {
  const { data, isLoading, error } = useAsync(async () => {
    const response = await tmdbApi.getNowPlaying(1);
    return fetchLimited(response.results, limit);
  }, [limit]);

  return {
    data: data ?? [],
    isLoading,
    error,
  } as MovieListState;
};

export const useTopRatedMovies = (limit = 20) => {
  const { data, isLoading, error } = useAsync(async () => {
    const response = await tmdbApi.getTopRated(1);
    return fetchLimited(response.results, limit);
  }, [limit]);

  return {
    data: data ?? [],
    isLoading,
    error,
  } as MovieListState;
};

const fetchMovieDetailsBatch = async (ids: number[]) => {
  const detailed = await Promise.all(
    ids.map(async (id) => {
      try {
        return await tmdbApi.getMovieDetails(id);
      } catch {
        return null;
      }
    }),
  );
  return detailed.filter((item): item is MovieDetails => Boolean(item));
};

export const useFeaturedMovies = (count = 4) => {
  const [state, setState] = useState<MovieDetailsState>({
    data: [],
    isLoading: false,
    error: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const trending = await tmdbApi.getTrending("day");
      const ids = trending.results.slice(0, count).map((movie) => movie.id);
      const detailed = await fetchMovieDetailsBatch(ids);
      setState({ data: detailed, isLoading: false, error: null });
    } catch (err) {
      setState({
        data: [],
        isLoading: false,
        error: err instanceof Error ? err.message : "Une erreur est survenue",
      });
    }
  }, [count]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        await load();
      } catch (error) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : "Une erreur est survenue",
          }));
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [load]);

  return state;
};
