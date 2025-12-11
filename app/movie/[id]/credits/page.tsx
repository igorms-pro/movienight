import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button, KIND as BTN_KIND, SIZE as BTN_SIZE } from "baseui/button";
import { tmdbApi } from "@/lib/tmdb/api";
import { CastMember, Credits } from "@/lib/tmdb/types";

export const revalidate = 300;

type PageProps = {
  params: { id: string };
};

type CrewEntry = {
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  id: number;
};

const sortCrew = (crew: Credits["crew"] = []) => {
  const importance = new Map<string, number>([
    ["Director", 1],
    ["Producer", 2],
    ["Executive Producer", 3],
    ["Screenplay", 4],
    ["Writer", 5],
    ["Story", 6],
  ]);
  return [...crew].sort((a, b) => {
    const aScore = importance.get(a.job) || 99;
    const bScore = importance.get(b.job) || 99;
    if (aScore !== bScore) return aScore - bScore;
    return (a.name || "").localeCompare(b.name || "");
  });
};

async function getData(id: number) {
  try {
    const movie = await tmdbApi.getMovieDetails(id);
    if (!movie) return null;
    const credits = movie.credits || null;
    return { movie, credits };
  } catch (error) {
    console.error("Error loading credits page", error);
    return null;
  }
}

export default async function MovieCreditsPage({ params }: PageProps) {
  const movieId = Number(params.id);
  if (!movieId || Number.isNaN(movieId)) {
    notFound();
  }

  const data = await getData(movieId);
  if (!data || !data.credits) {
    notFound();
  }

  const { movie, credits } = data;

  const sortedCrew: CrewEntry[] = sortCrew(credits.crew);
  const cast = credits.cast || [];

  return (
    <div className="py-[60px] flex justify-center" data-testid="credits-page">
      <div className="w-full max-w-[1400px] px-5 space-y-10">
        <div className="flex items-center gap-4">
          <Link href={`/movie/${movie.id}`} className="inline-flex">
            <Button kind={BTN_KIND.secondary} size={BTN_SIZE.compact}>
              ← Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{movie.title} — Crédits & Casting</h1>
        </div>

        <section className="space-y-4" data-testid="credits-crew">
          <h2 className="text-2xl font-semibold">Équipe</h2>
          <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
            {sortedCrew.map((c) => (
              <button
                key={`${c.id}-${c.job}`}
                className="w-full flex items-center gap-3 rounded-lg p-3 transition-transform duration-200 hover:scale-[1.02] text-left cursor-pointer border"
                style={{
                  backgroundColor: "var(--card-bg, #111)",
                  borderColor: "var(--border-strong, #333)",
                }}
                onClick={() => window.open(`https://www.themoviedb.org/person/${c.id}`, "_blank")}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#1a1a1a] shrink-0">
                  {c.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                      alt={c.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="48px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-[#666]">
                      N/A
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-[#999]">{c.job}</div>
                  <div className="text-base font-semibold text-white">{c.name}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4" data-testid="credits-cast">
          <h2 className="text-2xl font-semibold">Casting</h2>
          <div className="grid grid-cols-6 gap-6 max-[1280px]:grid-cols-4 max-[768px]:grid-cols-2">
            {cast.map((actor: CastMember) => (
              <button
                key={actor.id}
                className="text-center cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                onClick={() =>
                  window.open(`https://www.themoviedb.org/person/${actor.id}`, "_blank")
                }
              >
                <div className="relative w-full pt-[100%] rounded-lg overflow-hidden bg-[#1a1a1a] mb-3">
                  {actor.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="150px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#666] text-xs">
                      Pas d&apos;image
                    </div>
                  )}
                </div>
                <div className="text-sm font-semibold mb-1 text-white">{actor.name}</div>
                <div className="text-xs text-[#999]">{actor.character}</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
