import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

// Prevent non-boolean attribute warnings from next/image mock usage in tests
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<"img">) => {
    const { alt, fill, priority, quality, unoptimized, ...rest } = props as Record<string, unknown>;
    const normalized = {
      ...rest,
      alt: alt ?? "",
      // Stringify non-boolean-safe props to silence React warnings in tests
      fill: fill === true ? "true" : fill === false ? "false" : fill,
      priority: priority === true ? "true" : priority === false ? "false" : priority,
      quality: quality ?? undefined,
      unoptimized: unoptimized === true ? "true" : unoptimized === false ? "false" : unoptimized,
    };
    return React.createElement("img", normalized);
  },
}));
