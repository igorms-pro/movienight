"use client";

import React from "react";
import { Spinner } from "baseui/spinner";

type LoadingSpinnerProps = {
  size?: number;
  message?: string;
  minHeight?: string;
};

export default function LoadingSpinner({
  size = 64,
  message,
  minHeight = "60vh",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4" style={{ minHeight }}>
      <Spinner $size={size} />
      {message && <p className="text-theme-secondary text-sm">{message}</p>}
    </div>
  );
}
