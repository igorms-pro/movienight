import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import MovieCarousel from "@/components/movies/MovieCarousel";
import { Movie } from "@/lib/tmdb/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const makeMovie = (id: number): Movie => ({
  id,
  title: `Movie ${id}`,
  overview: "Overview",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  release_date: "2020-01-01",
  vote_average: 7,
  vote_count: 100,
  genre_ids: [1],
});

describe("MovieCarousel", () => {
  it("renders desktop track and paged mobile grid", () => {
    const movies = [1, 2, 3, 4, 5].map(makeMovie);
    render(<MovieCarousel movies={movies} title="Now Playing" />);

    expect(screen.getByTestId("movie-carousel")).toBeInTheDocument();
    expect(screen.getByTestId("movie-carousel-track")).toBeInTheDocument();

    const pages = screen.getAllByTestId("movie-carousel-mobile-page");
    expect(pages.length).toBe(Math.ceil(movies.length / 2));
    expect(within(pages[0]).getAllByTestId("movie-card")).toHaveLength(2);
    const lastPageCards = within(pages[pages.length - 1]).getAllByTestId("movie-card");
    expect(lastPageCards.length).toBe(1);
  });

  it("slides mobile pages when nav buttons are clicked", async () => {
    const movies = [1, 2, 3, 4].map(makeMovie);
    render(<MovieCarousel movies={movies} title="Trending" />);

    const track = screen.getByTestId("movie-carousel-mobile-track") as HTMLElement;
    expect(track.style.transform).toContain("0%");

    const prev = screen.getByTestId("movie-carousel-mobile-prev");
    const next = screen.getByTestId("movie-carousel-mobile-next");

    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();

    fireEvent.click(next);
    await waitFor(() => {
      expect(track.style.transform).toContain("-100%");
    });

    expect(prev).not.toBeDisabled();
    expect(next).toBeDisabled();

    fireEvent.click(prev);
    await waitFor(() => {
      expect(track.style.transform).toContain("0%");
    });

    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();
  });
});
