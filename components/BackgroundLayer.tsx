"use client";

import React, { useEffect, useState } from "react";
import { useMovieStore } from "@/store/movieStore";

export default function BackgroundLayer() {
  const currentMovie = useMovieStore((s) => s.currentMovie);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const backdropUrl = currentMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${currentMovie.backdrop_path}`
    : currentMovie?.poster_path
      ? `https://image.tmdb.org/t/p/w1280${currentMovie.poster_path}`
      : currentMovie?.posterUrl || null;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const t = document.documentElement.getAttribute("data-theme");
    if (t === "light" || t === "dark") setTheme(t);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          const next = document.documentElement.getAttribute("data-theme");
          if (next === "light" || next === "dark") setTheme(next);
        }
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [currentMovie]);

  const veilColor = theme === "light" ? "rgba(255,255,255,0.42)" : "var(--bg-overlay-strong)";
  const heroHeight = "620px";

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      data-testid="background-layer"
      data-has-image={Boolean(backdropUrl)}
    >
      {backdropUrl ? (
        <div
          className="absolute top-0 left-0 right-0 overflow-hidden"
          style={{
            height: heroHeight,
            maskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
          }}
        >
          <div
            className="absolute inset-0 scale-105 blur-[18px]"
            style={{
              backgroundImage: `url(${backdropUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(18px) brightness(var(--bg-blur-brightness))",
            }}
            data-testid="background-image"
            data-current-url={backdropUrl}
          />
          <div
            className="absolute inset-0"
            style={{
              background: veilColor,
              mixBlendMode: theme === "light" ? "screen" : "normal",
              opacity: 1,
            }}
            data-testid="background-overlay"
            data-overlay-color={veilColor}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.04),transparent_30%),#0b0b0d]" />
      )}
    </div>
  );
}
