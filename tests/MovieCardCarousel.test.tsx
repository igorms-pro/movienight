import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MovieCardCarousel from "@/components/movies/MovieCardCarousel";
import { Movie } from "@/lib/tmdb/types";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("next/image", () => ({
  default: (props: React.ComponentProps<"img">) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt ?? ""} {...props} />;
  },
}));

const movie: Movie = {
  id: 42,
  title: "Example",
  overview: "Overview",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  release_date: "2020-01-01",
  vote_average: 7,
  vote_count: 10,
  genre_ids: [1],
};

describe("MovieCardCarousel", () => {
  beforeEach(() => pushMock.mockClear());

  it("navigates on click", () => {
    render(<MovieCardCarousel movie={movie} />);
    fireEvent.click(screen.getByTestId("movie-card"));
    expect(pushMock).toHaveBeenCalledWith("/movie/42");
  });

  it("navigates on keyboard activation", () => {
    render(<MovieCardCarousel movie={movie} />);
    const card = screen.getByTestId("movie-card");
    fireEvent.keyDown(card, { key: "Enter" });
    expect(pushMock).toHaveBeenCalledWith("/movie/42");
  });
});
