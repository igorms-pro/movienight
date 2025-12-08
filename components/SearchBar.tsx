"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Input, SIZE as INPUT_SIZE } from "baseui/input";
import { Search as SearchIcon } from "baseui/icon";
import { useSearchMovies } from "@/hooks/useTmdb";
import { useMovieStore } from "@/store/movieStore";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const { setSearchQuery } = useMovieStore();

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    setQuery(initialQuery);
    setDebounced(initialQuery);
  }, [initialQuery]);

  const { data, isLoading } = useSearchMovies(debounced, 1, debounced.trim().length > 2);
  const suggestions = useMemo(() => data?.results?.slice(0, 10) ?? [], [data?.results]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSearchQuery(trimmed);
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSuggestionClick = (id: number) => {
    setOpen(false);
    router.push(`/movie/${id}`);
  };

  return (
    <div className="relative w-full">
      <Input
        value={query}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(query);
          }
          if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="Rechercher un film, un réalisateur, un acteur"
        size={INPUT_SIZE.large}
        startEnhancer={() => <SearchIcon size={20} />}
        endEnhancer={() =>
          query.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setDebounced("");
                setOpen(false);
              }}
              aria-label="Effacer"
              className="w-7 h-7 rounded-full flex items-center justify-center border transition-colors"
              style={{
                backgroundColor: "var(--surface-strong)",
                borderColor: "var(--border-strong)",
                color: "var(--text-secondary)",
              }}
            >
              ✕
            </button>
          ) : null
        }
        overrides={{
          Root: {
            style: {
              borderTopLeftRadius: "14px",
              borderTopRightRadius: "14px",
              borderBottomLeftRadius: "14px",
              borderBottomRightRadius: "14px",
              backgroundColor: "var(--input-bg)",
            },
          },
          InputContainer: {
            style: {
              backgroundColor: "transparent",
            },
          },
          Input: {
            style: {
              backgroundColor: "transparent",
              color: "var(--text-primary)",
            },
          },
        }}
      />

      {open && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 rounded-xl mt-2 max-h-[420px] overflow-y-auto z-50 border shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          style={{
            backgroundColor: "var(--surface-strong)",
            borderColor: "var(--border-strong)",
            boxShadow: "0 10px 30px var(--shadow-strong)",
          }}
        >
          {isLoading && (
            <div
              className="flex items-center justify-between px-4 py-3 text-sm border-b"
              style={{ color: "var(--text-secondary)", borderColor: "var(--border-strong)" }}
            >
              Recherche...
            </div>
          )}

          <div className="divide-y" style={{ borderColor: "var(--border-strong)" }}>
            {suggestions.map((movie) => {
              const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
              const poster = movie.poster_path
                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                : null;
              return (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => handleSuggestionClick(movie.id)}
                  className="w-full text-left"
                  style={{ background: "transparent", border: "none", padding: 0 }}
                >
                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--hover-surface)]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <div
                      className="relative w-10 h-14 rounded-md overflow-hidden shrink-0"
                      style={{ backgroundColor: "var(--surface-elevated)" }}
                    >
                      {poster ? (
                        <Image
                          src={poster}
                          alt={movie.title}
                          fill
                          sizes="40px"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/40">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{movie.title}</div>
                      {year && <div className="text-sm text-[var(--text-secondary)]">{year}</div>}
                    </div>
                    <div className="ml-auto text-lg text-[var(--text-secondary)]">→</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
