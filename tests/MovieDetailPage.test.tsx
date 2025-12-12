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
    <div data-testid="movie-detail-component" {...props} />
  ),
}));

vi.mock("@/components/details/MovieDetail", () => ({
  __esModule: true,
  default: () => <div data-testid="movie-detail-component" />,
}));

vi.mock("@/lib/tmdb/api", () => ({
  tmdbApi: {
    getMovieDetails: vi.fn(),
  },
}));

import MovieDetailPage from "@/app/movie/[id]/page";
import { tmdbApi } from "@/lib/tmdb/api";

describe("MovieDetailPage (app/movie/[id])", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
    vi.mocked(tmdbApi.getMovieDetails).mockReset();
  });

  it("calls notFound for an invalid id", async () => {
    await expect(MovieDetailPage({ params: { id: "abc" } })).rejects.toThrow("NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("calls notFound when TMDB returns no data", async () => {
    vi.mocked(tmdbApi.getMovieDetails).mockResolvedValueOnce(null);

    await expect(MovieDetailPage({ params: { id: "123" } })).rejects.toThrow("NOT_FOUND");
    expect(tmdbApi.getMovieDetails).toHaveBeenCalledWith(123);
    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("renders the MovieDetail component when data is available", async () => {
    vi.mocked(tmdbApi.getMovieDetails).mockResolvedValueOnce({
      id: 7,
      title: "Test movie",
      overview: "Overview",
      runtime: 100,
      genres: [{ id: 1, name: "Genre" }],
      release_date: "2024-01-01",
      vote_average: 7.2,
      poster_path: "/poster.jpg",
      backdrop_path: "/backdrop.jpg",
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      release_dates: {
        results: [{ iso_3166_1: "US", release_dates: [{ certification: "PG" }] }],
      },
    });

    const element = await MovieDetailPage({ params: { id: "7" } });
    render(element);

    expect(notFoundMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("movie-detail-component")).toBeInTheDocument();
  });
});
