import { create } from "zustand";
import { MovieDetails } from "@/lib/tmdb/types";

type MovieState = {
  currentMovie: MovieDetails | null;
  searchQuery: string;
  setCurrentMovie: (movie: MovieDetails | null) => void;
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
