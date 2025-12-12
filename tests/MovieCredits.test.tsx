/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MovieCredits from "@/components/details/MovieCredits";
import { CastMember, Credits, MovieDetails } from "@/lib/tmdb/types";

const openMock = vi.fn();
window.open = openMock as unknown as typeof window.open;

const makeCrew = (i: number) => ({
  id: i,
  name: `Crew ${i}`,
  job: "Director",
  profile_path: `/crew${i}.jpg`,
  department: "Directing",
});

const makeCast = (i: number): CastMember => ({
  id: i,
  name: `Actor ${i}`,
  character: `Role ${i}`,
  order: i,
  profile_path: `/cast${i}.jpg`,
});

const movie: MovieDetails = {
  id: 42,
  title: "Credit Test",
  overview: "",
  release_date: "2024-01-01",
  vote_average: 7.2,
  vote_count: 100,
  genres: [],
  runtime: 120,
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  credits: undefined,
  videos: { results: [] },
  release_dates: { results: [] },
  production_companies: [],
  tagline: "",
  budget: 0,
  revenue: 0,
};

const credits: Credits = {
  cast: Array.from({ length: 22 }, (_, idx) => makeCast(idx + 1)),
  crew: Array.from({ length: 18 }, (_, idx) => makeCrew(idx + 1)),
};

describe("MovieCredits", () => {
  beforeEach(() => {
    openMock.mockClear();
  });

  it("renders title, sections, and initial slices", () => {
    render(<MovieCredits movie={movie} credits={credits} />);

    expect(screen.getByTestId("credits-title")).toHaveTextContent("Credit Test");
    expect(screen.getAllByTestId("credits-crew-item")).toHaveLength(12); // initial slice
    expect(screen.getAllByTestId("credits-cast-item")).toHaveLength(18); // initial slice
    expect(screen.getByTestId("credits-crew-more")).toBeInTheDocument();
    expect(screen.getByTestId("credits-cast-more")).toBeInTheDocument();
  });

  it("toggles crew and cast visibility", () => {
    render(<MovieCredits movie={movie} credits={credits} />);

    fireEvent.click(screen.getByTestId("credits-crew-toggle"));
    expect(screen.queryByTestId("credits-crew-list")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("credits-cast-toggle"));
    expect(screen.queryByTestId("credits-cast-list")).not.toBeInTheDocument();
  });

  it("loads more crew and cast when clicking show more", () => {
    render(<MovieCredits movie={movie} credits={credits} />);

    fireEvent.click(screen.getByTestId("credits-crew-more"));
    expect(screen.getAllByTestId("credits-crew-item")).toHaveLength(18); // all crew

    fireEvent.click(screen.getByTestId("credits-cast-more"));
    expect(screen.getAllByTestId("credits-cast-item")).toHaveLength(22); // all cast
  });

  it("opens TMDB person links on click", () => {
    render(<MovieCredits movie={movie} credits={credits} />);
    fireEvent.click(screen.getAllByTestId("credits-crew-item")[0]);
    expect(openMock).toHaveBeenCalledWith("https://www.themoviedb.org/person/1", "_blank");
  });

  it("shows empty state when no data", () => {
    render(
      <MovieCredits
        movie={movie}
        credits={{
          cast: [],
          crew: [],
        }}
      />,
    );

    expect(screen.getByTestId("credits-empty")).toBeInTheDocument();
  });
});
