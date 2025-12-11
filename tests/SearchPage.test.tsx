import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    (tmdbApi.searchMovies as vi.Mock).mockResolvedValue({
      results: [
        { id: 1, title: "Avatar", poster_path: "/p1.jpg", release_date: "2009-01-01" },
        { id: 2, title: "Avatar 2", poster_path: "/p2.jpg", release_date: "2022-01-01" },
      ],
      total_results: 3,
    });

    render(<SearchPage />);

    await waitFor(() => expect(screen.getAllByTestId("search-card").length).toBe(2));
    expect(screen.getAllByText(/avatar/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("search-load-more")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("search-load-more"));
    expect(tmdbApi.searchMovies).toHaveBeenCalledTimes(2);
  });

  it("shows empty state when no results", async () => {
    (tmdbApi.searchMovies as vi.Mock).mockResolvedValue({
      results: [],
      total_results: 0,
    });

    render(<SearchPage />);
    await waitFor(() => expect(screen.getByTestId("search-empty")).toBeInTheDocument());
  });
});
