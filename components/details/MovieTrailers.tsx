"use client";

import React from "react";
import Image from "next/image";
import { Video } from "@/lib/tmdb/types";

type Props = {
  trailers: Video[];
};

export default function MovieTrailers({ trailers }: Props) {
  if (!trailers.length) return null;

  return (
    <div className="mb-[60px]" data-testid="movie-trailers">
      <h2 className="text-2xl font-semibold mb-6">Bandes annonces</h2>
      <div className="flex gap-4 overflow-x-auto pb-2.5 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {trailers.map((video) => (
          <button
            key={video.id}
            className="shrink-0 w-80 text-left cursor-pointer"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, "_blank")}
          >
            <div className="relative w-full pt-[56.25%] bg-[#1a1a1a] rounded-lg overflow-hidden mb-2">
              <Image
                src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                alt={video.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="320px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-[60px] h-[60px] rounded-full bg-white/90 flex items-center justify-center text-2xl text-black">
                  ▶
                </div>
              </div>
            </div>
            <p className="text-sm text-[#999] uppercase">{video.type}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
