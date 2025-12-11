"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, KIND as BTN_KIND, SIZE as BTN_SIZE, SHAPE as BTN_SHAPE } from "baseui/button";
import { Video } from "@/lib/tmdb/types";

type Props = {
  trailers: Video[];
};

const TrailerCard = ({ video, isActive }: { video: Video; isActive: boolean }) => (
  <div
    className={`w-full transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
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
  </div>
);

export default function MovieTrailers({ trailers }: Props) {
  const [current, setCurrent] = useState(0);
  const canPrev = current > 0;
  const canNext = current < trailers.length - 1;

  useEffect(() => {
    setCurrent(0);
  }, [trailers.length]);

  if (!trailers.length) return null;

  return (
    <div className="mb-[60px]" data-testid="movie-trailers">
      <h2 className="text-2xl font-semibold mb-6">Bandes annonces</h2>

      {/* Desktop: horizontal list */}
      <div className="hidden md:flex gap-4 overflow-x-auto pb-2.5 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {trailers.map((video) => (
          <button
            key={video.id}
            className="shrink-0 w-80 text-left cursor-pointer"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, "_blank")}
          >
            <TrailerCard video={video} isActive />
          </button>
        ))}
      </div>

      {/* Mobile: single card with prev/next */}
      <div className="md:hidden">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-400 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {trailers.map((video, idx) => (
              <div key={video.id} className="w-full shrink-0">
                <button
                  className="w-full text-left"
                  onClick={() =>
                    window.open(`https://www.youtube.com/watch?v=${video.key}`, "_blank")
                  }
                >
                  <TrailerCard video={video} isActive={idx === current} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-3">
          <Button
            kind={BTN_KIND.secondary}
            size={BTN_SIZE.compact}
            shape={BTN_SHAPE.pill}
            onClick={() => canPrev && setCurrent((c) => Math.max(0, c - 1))}
            disabled={!canPrev}
            aria-label="Précédent"
          >
            ←
          </Button>
          <Button
            kind={BTN_KIND.secondary}
            size={BTN_SIZE.compact}
            shape={BTN_SHAPE.pill}
            onClick={() => canNext && setCurrent((c) => Math.min(trailers.length - 1, c + 1))}
            disabled={!canNext}
            aria-label="Suivant"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  );
}
