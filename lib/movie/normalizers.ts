import { MovieDetails } from "@/lib/tmdb/types";

const preferredRegions = ["US", "FR", "GB"];

export const pickCertification = (releaseDates: MovieDetails["release_dates"]) => {
  const entries = releaseDates?.results || [];
  for (const region of preferredRegions) {
    const cert = entries
      .find((r) => r.iso_3166_1 === region)
      ?.release_dates?.find((d) => d.certification)?.certification;
    if (cert) return cert;
  }
  return null;
};

export const pickTrailers = (videos: MovieDetails["videos"]) =>
  videos?.results?.filter((v) => v.type === "Trailer").slice(0, 3) || [];

export const pickCrewBuckets = (crew: NonNullable<MovieDetails["credits"]>["crew"] = []) => {
  const uniqueNames = (list: typeof crew) => Array.from(new Set(list.map((c) => c.name)));
  const buckets = [
    { label: "Director", names: uniqueNames(crew.filter((c) => c.job === "Director")) },
    { label: "Producer", names: uniqueNames(crew.filter((c) => c.job === "Producer")) },
    {
      label: "Executive Producer",
      names: uniqueNames(crew.filter((c) => c.job === "Executive Producer")),
    },
    {
      label: "Screenplay, Story",
      names: uniqueNames(crew.filter((c) => ["Screenplay", "Writer", "Story"].includes(c.job))),
    },
  ];
  return buckets.filter((b) => b.names.length > 0).slice(0, 4);
};
