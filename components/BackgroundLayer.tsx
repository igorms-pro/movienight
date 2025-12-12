"use client";

import React from "react";
import { useMovieStore } from "@/store/movieStore";

export default function BackgroundLayer() {
  const currentMovie = useMovieStore((s) => s.currentMovie);

  const backdropUrl = currentMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${currentMovie.backdrop_path}`
    : currentMovie?.poster_path
      ? `https://image.tmdb.org/t/p/w1280${currentMovie.poster_path}`
      : currentMovie?.posterUrl || null;

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    // Log whenever the background image changes (dev only)
    // eslint-disable-next-line no-console
    console.info(
      "[BG] update",
      {
        id: currentMovie?.id,
        title: currentMovie?.title,
        backdrop: currentMovie?.backdrop_path,
        posterUrl: currentMovie?.posterUrl,
      },
      "resolvedUrl:",
      backdropUrl,
    );
  }, [
    currentMovie?.id,
    currentMovie?.title,
    currentMovie?.backdrop_path,
    currentMovie?.posterUrl,
    backdropUrl,
  ]);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {backdropUrl ? (
        <>
          <div
            className="absolute inset-0 scale-105 blur-[18px] brightness-50"
            style={{
              backgroundImage: `url(${backdropUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,13,0.75),rgba(11,11,13,0.92))]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.04),transparent_30%),#0b0b0d]" />
      )}
    </div>
  );
}
