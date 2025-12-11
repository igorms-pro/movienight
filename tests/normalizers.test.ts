import { describe, expect, it } from "vitest";
import { pickCertification, pickTrailers, pickCrewBuckets } from "@/lib/movie/normalizers";
import {
  formatRuntime,
  extractCertification,
  trimCredits,
  pickTrailers as pickTrailerHelpers,
} from "@/lib/tmdb/helpers";
import { Credits, MovieDetails, ReleaseDatesResponse, Video } from "@/lib/tmdb/types";

describe("movie normalizers", () => {
  it("picks certification with priority order", () => {
    const release_dates: MovieDetails["release_dates"] = {
      results: [
        {
          iso_3166_1: "FR",
          release_dates: [{ certification: "U" }],
        },
        {
          iso_3166_1: "US",
          release_dates: [{ certification: "PG" }],
        },
      ],
    };

    expect(pickCertification({ results: release_dates.results })).toBe("PG");
  });

  it("picks top 3 trailers", () => {
    const videos: MovieDetails["videos"] = {
      results: [
        { id: "1", key: "k1", name: "t1", site: "YouTube", type: "Trailer", official: true },
        { id: "2", key: "k2", name: "t2", site: "YouTube", type: "Teaser", official: true },
        { id: "3", key: "k3", name: "t3", site: "YouTube", type: "Trailer", official: true },
        { id: "4", key: "k4", name: "t4", site: "YouTube", type: "Trailer", official: true },
        { id: "5", key: "k5", name: "t5", site: "YouTube", type: "Trailer", official: true },
      ],
    };
    const trailers = pickTrailers(videos);
    expect(trailers).toHaveLength(3);
    expect(trailers.every((t) => t.type === "Trailer")).toBe(true);
  });

  it("builds crew buckets and limits to four groups", () => {
    const crew: NonNullable<MovieDetails["credits"]>["crew"] = [
      { job: "Director", name: "A", department: "Directing", id: 1, profile_path: null },
      { job: "Director", name: "A", department: "Directing", id: 1, profile_path: null },
      { job: "Producer", name: "B", department: "Production", id: 2, profile_path: null },
      { job: "Screenplay", name: "C", department: "Writing", id: 3, profile_path: null },
      { job: "Writer", name: "D", department: "Writing", id: 4, profile_path: null },
      { job: "Story", name: "E", department: "Writing", id: 5, profile_path: null },
    ];
    const buckets = pickCrewBuckets(crew);
    expect(buckets).toHaveLength(3);
    expect(buckets[0].names).toEqual(["A"]);
  });
});

describe("tmdb helpers", () => {
  it("formats runtime", () => {
    expect(formatRuntime(0)).toBeNull();
    expect(formatRuntime(45)).toBe("45m");
    expect(formatRuntime(125)).toBe("2h 5m");
  });

  it("extracts certification from release dates", () => {
    const releaseDates: ReleaseDatesResponse = {
      results: [
        { iso_3166_1: "DE", release_dates: [{ certification: "12" }] },
        { iso_3166_1: "FR", release_dates: [{ certification: "U" }] },
      ],
    };
    expect(extractCertification(releaseDates)).toBe("U");
  });

  it("trims credits to limits and roles", () => {
    const credits: Credits = {
      cast: Array.from({ length: 20 }, (_, i) => ({
        id: i,
        name: `Cast${i}`,
        character: `Role${i}`,
        profile_path: null,
        order: i,
      })),
      crew: [
        { job: "Director", name: "Dir", department: "Directing", id: 1, profile_path: null },
        { job: "Composer", name: "Music", department: "Sound", id: 2, profile_path: null },
        { job: "Writer", name: "Writer", department: "Writing", id: 3, profile_path: null },
      ],
    };
    const trimmed = trimCredits(credits, { castLimit: 5, crewLimit: 2 });
    expect(trimmed?.cast).toHaveLength(5);
    expect(trimmed?.crew).toHaveLength(2);
  });

  it("picks trailer videos from helpers", () => {
    const videos: Video[] = [
      { id: "1", key: "k1", name: "t1", site: "YouTube", type: "Teaser", official: true },
      { id: "2", key: "k2", name: "t2", site: "YouTube", type: "Trailer", official: true },
      { id: "3", key: "k3", name: "t3", site: "YouTube", type: "Trailer", official: true },
    ];
    expect(pickTrailerHelpers(videos, 1)).toHaveLength(1);
    expect(pickTrailerHelpers(undefined)).toHaveLength(0);
  });
});
