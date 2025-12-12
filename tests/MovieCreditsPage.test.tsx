import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const notFoundMock = vi.fn();

vi.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    notFoundMock();
    throw new Error("NOT_FOUND");
  },
}));

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: () => (props: React.ComponentProps<"div">) => (
    <div data-testid="movie-credits-component" {...props} />
  ),
}));

vi.mock("@/components/details/MovieCredits", () => ({
  __esModule: true,
  default: () => <div data-testid="movie-credits-component" />,
}));

vi.mock("@/lib/tmdb/api", () => ({
  tmdbApi: {
    getMovieDetails: vi.fn(),
  },
}));

import MovieCreditsPage from "@/app/movie/[id]/credits/page";
import { tmdbApi } from "@/lib/tmdb/api";

describe("MovieCreditsPage (app/movie/[id]/credits)", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
    vi.mocked(tmdbApi.getMovieDetails).mockReset();
  });

  it("calls notFound for an invalid id", async () => {
    await expect(MovieCreditsPage({ params: { id: "abc" } })).rejects.toThrow("NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("calls notFound when TMDB returns no data", async () => {
    vi.mocked(tmdbApi.getMovieDetails).mockResolvedValueOnce(null);

    await expect(MovieCreditsPage({ params: { id: "123" } })).rejects.toThrow("NOT_FOUND");
    expect(tmdbApi.getMovieDetails).toHaveBeenCalledWith(123);
    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("renders the MovieCredits component when data is available", async () => {
    vi.mocked(tmdbApi.getMovieDetails).mockResolvedValueOnce({
      id: 8,
      title: "Credits movie",
      overview: "Overview",
      release_date: "2024-02-02",
      vote_average: 7.1,
      vote_count: 500,
      genres: [{ id: 1, name: "Genre" }],
      runtime: 99,
      poster_path: "/poster.jpg",
      backdrop_path: "/backdrop.jpg",
      production_companies: [],
      tagline: "",
      budget: 0,
      revenue: 0,
      videos: { results: [] },
      credits: {
        cast: [{ id: 10, name: "Cast A", character: "Role A", order: 0, profile_path: "/c1.jpg" }],
        crew: [
          {
            id: 20,
            name: "Director",
            job: "Director",
            department: "Directing",
            profile_path: null,
          },
        ],
      },
      release_dates: {
        results: [{ iso_3166_1: "US", release_dates: [{ certification: "PG" }] }],
      },
    });

    const element = await MovieCreditsPage({ params: { id: "8" } });
    render(element);

    expect(notFoundMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("movie-credits-component")).toBeInTheDocument();
  });
});
