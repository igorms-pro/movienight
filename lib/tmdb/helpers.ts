import { Credits, ReleaseDatesResponse, Video } from "./types";

export function formatRuntime(minutes?: number | null): string | null {
  if (!minutes || minutes <= 0) return null;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h${mins > 0 ? ` ${mins}m` : ""}`;
}

export function extractCertification(releaseDates?: ReleaseDatesResponse | null): string | null {
  if (!releaseDates?.results?.length) return null;
  const market =
    releaseDates.results.find((r) => r.iso_3166_1 === "US") ??
    releaseDates.results.find((r) => r.iso_3166_1 === "FR") ??
    releaseDates.results[0];
  return market?.release_dates?.[0]?.certification || null;
}

export function trimCredits(
  credits: Credits | undefined,
  options?: { castLimit?: number; crewLimit?: number },
): Credits | null {
  if (!credits) return null;
  const castLimit = options?.castLimit ?? 12;
  const crewLimit = options?.crewLimit ?? 12;

  const crewRoles = ["Director", "Writer", "Screenplay", "Story", "Executive Producer", "Producer"];

  return {
    cast: credits.cast.slice(0, castLimit),
    crew: credits.crew.filter((c) => crewRoles.includes(c.job)).slice(0, crewLimit),
  };
}

export function pickTrailers(videos: Video[] | undefined, limit = 3): Video[] {
  if (!videos) return [];
  return videos.filter((v) => v.type === "Trailer").slice(0, limit);
}
