import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MovieDetails } from "@/lib/tmdb/types";
import HeroCarousel from "@/components/hero/HeroCarousel";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const makeMovie = (id: number): MovieDetails => ({
  id,
  title: `Movie ${id}`,
  overview: "Overview",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  release_date: "2020-01-01",
  vote_average: 7.5,
  vote_count: 1200,
  genre_ids: [1, 2],
  genres: [],
  runtime: 120,
  production_companies: [],
  tagline: "",
  budget: 0,
  revenue: 0,
});

describe("HeroCarousel", () => {
  afterEach(() => {
    pushMock.mockClear();
  });

  it("renders slides and dots with test ids", () => {
    render(<HeroCarousel movies={[makeMovie(1), makeMovie(2), makeMovie(3)]} />);

    expect(screen.getByTestId("hero-carousel")).toBeInTheDocument();
    expect(screen.getAllByTestId("hero-slide")).toHaveLength(3);
    expect(screen.getByTestId("hero-dots-mobile")).toBeInTheDocument();
    expect(screen.getByTestId("hero-dots-desktop")).toBeInTheDocument();
  });

  it("triggers navigation from mobile CTA buttons", () => {
    render(<HeroCarousel movies={[makeMovie(10)]} />);

    fireEvent.click(screen.getByTestId("hero-mobile-play"));
    expect(pushMock).toHaveBeenCalledWith("/movie/10");

    pushMock.mockClear();
    fireEvent.click(screen.getByTestId("hero-mobile-info"));
    expect(pushMock).toHaveBeenCalledWith("/movie/10");
  });
});
