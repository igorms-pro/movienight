"use client";

import React from "react";

type CrewBucket = { label: string; names: string[] };

type Props = {
  crewBuckets: CrewBucket[];
};

export default function MovieCrewBuckets({ crewBuckets }: Props) {
  if (!crewBuckets.length) return null;
  return (
    <div
      className="grid grid-cols-2 gap-x-10 gap-y-3 max-[640px]:grid-cols-1"
      data-testid="movie-crew"
    >
      {crewBuckets.map((bucket) => (
        <div key={bucket.label}>
          <div className="text-lg text-theme-secondary">{bucket.label}</div>
          <div className="text-lg text-theme-primary font-semibold">{bucket.names.join(", ")}</div>
        </div>
      ))}
    </div>
  );
}
