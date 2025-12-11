/* eslint-disable @next/next/no-img-element */
import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchBar from "@/components/SearchBar";

vi.mock("next/navigation", () => {
  const push = vi.fn();
  const searchParams = new URLSearchParams();
  return {
    useRouter: () => ({ push }),
    useSearchParams: () => searchParams,
  };
});

const setSearchQuery = vi.fn();
vi.mock("@/store/movieStore", () => ({
  useMovieStore: () => ({ setSearchQuery }),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<"img">) => <img {...props} alt={props.alt ?? ""} />,
}));

const useSearchMoviesMock = vi.fn();
vi.mock("@/hooks/useTmdb", () => ({
  useSearchMovies: (...args: unknown[]) => useSearchMoviesMock(...args),
}));

describe("SearchBar", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    useSearchMoviesMock.mockReturnValue({
      data: { results: [], total_results: 0 },
      isLoading: false,
    });
  });

  it("debounces input and shows suggestions", async () => {
    const movie = { id: 10, title: "Test Movie", release_date: "2020-01-01", poster_path: null };
    useSearchMoviesMock.mockReturnValue({
      data: { results: [movie] },
      isLoading: false,
    });

    render(<SearchBar />);

    const input = screen.getByTestId("search-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Test" } });
    const suggestion = await waitFor(() =>
      within(screen.getByTestId("search-suggestions")).getByTestId("search-suggestion"),
    );
    expect(suggestion).toHaveTextContent("Test Movie");
  });

  it("clears input and closes suggestions", async () => {
    render(<SearchBar />);
    const input = screen.getByTestId("search-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input).toHaveValue("abc");
    fireEvent.click(screen.getByTestId("search-clear"));
    expect(input).toHaveValue("");
  });

  it("navigates via suggestion click", async () => {
    const router = (await import("next/navigation")).useRouter();
    const movie = { id: 20, title: "Avatar", release_date: "2009-01-01", poster_path: null };
    useSearchMoviesMock.mockReturnValue({
      data: { results: [movie], total_results: 42 },
      isLoading: false,
    });

    render(<SearchBar />);
    const input = screen.getByTestId("search-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Avatar" } });

    const suggestion = await waitFor(() => screen.getByTestId("search-suggestion"));
    fireEvent.click(suggestion);
    expect(router.push).toHaveBeenCalledWith("/movie/20");
  });

  it("navigates via see-all results CTA", async () => {
    const router = (await import("next/navigation")).useRouter();
    useSearchMoviesMock.mockReturnValue({
      data: { results: [{ id: 20, title: "Avatar" }], total_results: 42 },
      isLoading: false,
    });

    render(<SearchBar />);
    const input = screen.getByTestId("search-input");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Avatar" } });

    const seeAll = await waitFor(() => screen.getByTestId("search-see-all"));
    fireEvent.click(seeAll);
    expect(router.push).toHaveBeenCalledWith("/search?q=Avatar");
  });
});
