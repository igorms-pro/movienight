"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import MovieCardSearch from "@/components/movies/MovieCardSearch";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { tmdbApi } from "@/lib/tmdb/api";
import { Movie } from "@/lib/tmdb/types";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
    setResults([]);
    setTotalResults(0);
    setError(null);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setIsLoading(true);
      try {
        const response = await tmdbApi.searchMovies(query, page);
        setTotalResults(response.total_results);
        setResults((prev) => (page === 1 ? response.results : [...prev, ...response.results]));
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la recherche");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [page, query]);

  const hasMore = useMemo(() => results.length < totalResults, [results.length, totalResults]);

  return (
    <div className="w-full max-w-[1180px] mx-auto px-3 md:px-0 pb-14" data-testid="search-page">
      <div className="mb-8">
        <h1 className="text-[32px] font-semibold uppercase">
          {query ? `${query}${totalResults ? ` — ${totalResults} résultats` : ""}` : "Recherche"}
        </h1>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>

      {query && results.length === 0 && !isLoading && !error ? (
        <div className="text-center py-[60px] px-5 text-theme-secondary" data-testid="search-empty">
          Aucun résultat trouvé pour “{query}”
        </div>
      ) : null}

      {results.length > 0 && (
        <div className="grid grid-cols-6 gap-6 max-[1400px]:grid-cols-5 max-[1200px]:grid-cols-4 max-[900px]:grid-cols-3 max-[640px]:grid-cols-2">
          {results.map((movie) => (
            <MovieCardSearch key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {isLoading && (
        <div className="py-10">
          <LoadingSpinner />
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            className="px-5 py-3 rounded-full border transition text-theme-primary"
            style={{ borderColor: "var(--border-strong)" }}
            data-testid="search-load-more"
          >
            Charger plus
          </button>
        </div>
      )}

      {!query && (
        <p className="text-theme-secondary" data-testid="search-placeholder">
          Tapez une recherche dans la barre en haut pour commencer.
        </p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[1180px] mx-auto px-3 md:px-0 pb-14" data-testid="search-page">
          <div className="py-10">
            <LoadingSpinner />
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
