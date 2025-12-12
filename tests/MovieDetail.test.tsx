/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MovieDetail } from "@/components/details/MovieDetail";
import { MovieDetailView } from "@/components/details/types";
import { CastMember, Video } from "@/lib/tmdb/types";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    back: vi.fn(),
    push: pushMock,
  }),
}));

const makeTrailer = (id: string, type: string): Video => ({
  id,
  key: `key-${id}`,
  name: `Trailer ${id}`,
  site: "YouTube",
  type,
  official: true,
});

const makeCast = (id: number): CastMember => ({
  id,
  name: `Actor ${id}`,
  character: `Role ${id}`,
  order: id,
  profile_path: `/p${id}.jpg`,
});

const baseData: MovieDetailView = {
  movie: {
    id: 123,
    title: "Zootopie 2",
    releaseYear: 2025,
    certification: "PG",
    overview: "Une suite attendue.",
    genres: [
      { id: 1, name: "Animation" },
      { id: 2, name: "Aventure" },
    ],
    runtime: 105,
    release_date: "2025-01-01",
    vote_average: 8.2,
    userRating: 82,
    posterUrl: "https://image.tmdb.org/t/p/w500/poster.jpg",
  },
  trailers: [makeTrailer("1", "Trailer"), makeTrailer("2", "Teaser")],
  crewBuckets: [
    { label: "Réalisateur", names: ["Someone"] },
    { label: "Scénario", names: ["Writer A", "Writer B"] },
  ],
  cast: Array.from({ length: 14 }, (_, idx) => makeCast(idx + 1)),
  totalCastCount: 20,
};

describe("MovieDetail", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("renders all key sections and counts", () => {
    render(<MovieDetail data={baseData} />);

    expect(screen.getByTestId("movie-title")).toHaveTextContent("Zootopie 2");
    expect(screen.getByTestId("movie-certification")).toHaveTextContent("PG");
    expect(screen.getByTestId("movie-genres")).toHaveTextContent("Animation");
    expect(screen.getByTestId("movie-runtime-rating")).toBeInTheDocument();
    expect(screen.getByTestId("movie-synopsis")).toHaveTextContent("Une suite attendue.");
    expect(screen.getByTestId("movie-poster")).toBeInTheDocument();
    expect(screen.getByTestId("movie-crew")).toBeInTheDocument();

    expect(screen.getAllByTestId("trailer-desktop-card")).toHaveLength(2);
    expect(screen.getByTestId("trailer-mobile-track").children).toHaveLength(2);

    // Cast shows 12 cards plus the "Voir tout" CTA
    expect(screen.getAllByTestId("movie-cast-item")).toHaveLength(12);
    expect(screen.getByTestId("movie-cast-see-all")).toBeInTheDocument();
  });

  it("goes back when clicking the retour button", () => {
    render(<MovieDetail data={baseData} />);
    fireEvent.click(screen.getByTestId("movie-back-button"));
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("advances trailers on mobile controls", () => {
    render(<MovieDetail data={baseData} />);
    const track = screen.getByTestId("trailer-mobile-track");
    const next = screen.getByTestId("trailer-next");
    const prev = screen.getByTestId("trailer-prev");

    expect(track.getAttribute("style")).toContain("translateX(-0%");
    fireEvent.click(next);
    expect(track.getAttribute("style")).toContain("translateX(-100%");
    fireEvent.click(prev);
    expect(track.getAttribute("style")).toContain("translateX(-0%");
  });

  it("opens credits page from see-all cast CTA", () => {
    render(<MovieDetail data={baseData} />);
    fireEvent.click(screen.getByTestId("movie-cast-see-all"));
    expect(pushMock).toHaveBeenCalledWith("/movie/123/credits");
  });
});
