"use client";

import React from "react";
import { Spinner } from "baseui/spinner";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <Spinner $size={64} />
    </div>
  );
}
