import { create } from "zustand";
import { MovieDetails } from "@/lib/tmdb/types";

type CurrentMovie = (Partial<MovieDetails> & { posterUrl?: string | null }) | null;

type MovieState = {
  currentMovie: CurrentMovie;
  searchQuery: string;
  setCurrentMovie: (movie: CurrentMovie) => void;
  setSearchQuery: (query: string) => void;
  clear: () => void;
};

export const useMovieStore = create<MovieState>((set) => ({
  currentMovie: null,
  searchQuery: "",
  setCurrentMovie: (movie) => set({ currentMovie: movie }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clear: () => set({ currentMovie: null, searchQuery: "" }),
}));
