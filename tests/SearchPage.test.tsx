import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SearchPage from "@/app/search/page";
import { tmdbApi } from "@/lib/tmdb/api";

vi.mock("next/navigation", () => {
  const params = new URLSearchParams();
  params.set("q", "avatar");
  return {
    useSearchParams: () => params,
    useRouter: () => ({ push: vi.fn() }),
  };
});

vi.mock("@/lib/tmdb/api", () => ({
  tmdbApi: {
    searchMovies: vi.fn(),
  },
}));

describe("SearchPage", () => {
  it("renders results and load more", async () => {
    const searchMock = tmdbApi.searchMovies as ReturnType<typeof vi.fn>;
    searchMock.mockResolvedValueOnce({
      results: [
        { id: 1, title: "Avatar", poster_path: "/p1.jpg", release_date: "2009-01-01" },
        { id: 2, title: "Avatar 2", poster_path: "/p2.jpg", release_date: "2022-01-01" },
      ],
      total_results: 4,
    });
    searchMock.mockResolvedValueOnce({
      results: [
        { id: 3, title: "Avatar 3", poster_path: "/p3.jpg", release_date: "2026-01-01" },
        { id: 4, title: "Avatar 4", poster_path: "/p4.jpg", release_date: "2028-01-01" },
      ],
      total_results: 4,
    });

    await act(async () => {
      render(<SearchPage />);
    });

    await waitFor(() => expect(screen.getAllByTestId("search-card").length).toBe(2));
    expect(screen.getAllByText(/avatar/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("search-load-more")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("search-load-more"));
    });
    await waitFor(() => expect(tmdbApi.searchMovies).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getAllByTestId("search-card").length).toBe(4));
  });

  it("shows empty state when no results", async () => {
    const searchMock = tmdbApi.searchMovies as ReturnType<typeof vi.fn>;
    searchMock.mockResolvedValue({
      results: [],
      total_results: 0,
    });

    await act(async () => {
      render(<SearchPage />);
    });
    await waitFor(() => expect(screen.getByTestId("search-empty")).toBeInTheDocument());
  });
});
