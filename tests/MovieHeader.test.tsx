import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MovieHeader from "@/components/details/MovieHeader";
import { MovieDetailView } from "@/components/details/types";

const movie: MovieDetailView["movie"] = {
  id: 99,
  title: "Header Test",
  releaseYear: 2024,
  certification: "PG-13",
  overview: "",
  genres: [
    { id: 1, name: "Action" },
    { id: 2, name: "Comedy" },
  ],
  runtime: 125,
  release_date: "2024-01-01",
  vote_average: 7.8,
  userRating: 78,
  posterUrl: "",
};

describe("MovieHeader", () => {
  it("renders title, certification, genres, runtime and rating bar", () => {
    render(<MovieHeader movie={movie} />);
    expect(screen.getByText("Header Test (2024)")).toBeInTheDocument();
    expect(screen.getByText("PG-13")).toBeInTheDocument();
    expect(screen.getByText("Action,")).toBeInTheDocument();
    expect(screen.getByText("78%")).toBeInTheDocument();
    expect(screen.getByText("2h 5m")).toBeInTheDocument();
  });
});
