"use client";

import React from "react";
import Image from "next/image";
import { Button, KIND as BTN_KIND, SIZE as BTN_SIZE } from "baseui/button";
import { CrewEntry } from "./types";

type Props = {
  crew: CrewEntry[];
  showCrew: boolean;
  onToggle: () => void;
  displayedCrew: CrewEntry[];
  onShowMore: () => void;
  hasMore: boolean;
};

export default function CreditsCrew({
  crew,
  showCrew,
  onToggle,
  displayedCrew,
  onShowMore,
  hasMore,
}: Props) {
  return (
    <section className="space-y-4 md:px-0" data-testid="credits-crew">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 text-2xl font-semibold bg-transparent border-none p-0 focus:outline-none"
        style={{ color: "var(--text-primary, #fff)" }}
        data-testid="credits-crew-toggle"
      >
        Équipe
        <span className="text-lg" style={{ color: "var(--text-primary, #fff)" }}>
          {showCrew ? "▴" : "▾"}
        </span>
      </button>
      {showCrew && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4" data-testid="credits-crew-list">
            {displayedCrew.map((c) => (
              <button
                key={`${c.id}-${c.job}`}
                className="w-full flex items-center gap-3 rounded-lg p-3 transition-transform duration-200 hover:scale-[1.02] text-left cursor-pointer border"
                style={{
                  backgroundColor: "var(--card-bg, #111)",
                  borderColor: "var(--border-strong, #333)",
                }}
                onClick={() => window.open(`https://www.themoviedb.org/person/${c.id}`, "_blank")}
                data-testid="credits-crew-item"
                data-person-id={c.id}
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
                  <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {c.job}
                  </div>
                  <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                    {c.name}
                  </div>
                </div>
              </button>
            ))}
            {displayedCrew.length === 0 && (
              <div style={{ color: "var(--text-secondary)" }}>
                Aucune donnée pour l&apos;équipe.
              </div>
            )}
          </div>
          {hasMore && (
            <Button
              kind={BTN_KIND.secondary}
              size={BTN_SIZE.compact}
              onClick={onShowMore}
              overrides={{
                BaseButton: {
                  style: {
                    color: "var(--text-primary)",
                    backgroundColor: "var(--card-bg-strong)",
                    borderColor: "var(--border-strong)",
                    ":hover": {
                      backgroundColor: "var(--hover-surface)",
                      borderColor: "var(--border-stronger)",
                    },
                  },
                },
              }}
              data-testid="credits-crew-more"
            >
              Voir plus ({crew.length - displayedCrew.length} restants)
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
