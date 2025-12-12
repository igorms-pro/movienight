import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MovieDetails } from "@/lib/tmdb/types";

const notFoundMock = vi.fn();
const originalEnv = { ...process.env };

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
    process.env = { ...originalEnv, E2E_MOCK: "0", NEXT_PUBLIC_E2E_MOCK: "0" };
  });

  it("calls notFound for an invalid id", async () => {
    await expect(MovieDetailPage({ params: { id: "abc" } })).rejects.toThrow("NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("calls notFound when TMDB returns no data", async () => {
    vi.mocked(tmdbApi.getMovieDetails).mockResolvedValueOnce(null as unknown as MovieDetails);

    await expect(MovieDetailPage({ params: { id: "123" } })).rejects.toThrow("NOT_FOUND");
    expect(tmdbApi.getMovieDetails).toHaveBeenCalledWith(123);
    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("uses E2E mock data without calling TMDB", async () => {
    process.env.E2E_MOCK = "1";
    const element = await MovieDetailPage({ params: { id: "99" } });
    render(element);
    expect(tmdbApi.getMovieDetails).not.toHaveBeenCalled();
    expect(notFoundMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("movie-detail-component")).toBeInTheDocument();
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
      vote_count: 123,
      poster_path: "/poster.jpg",
      backdrop_path: "/backdrop.jpg",
      production_companies: [],
      tagline: "",
      budget: 0,
      revenue: 0,
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
