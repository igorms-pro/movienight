import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

// Prevent non-boolean attribute warnings from next/image mock usage in tests
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<"img">) => {
    // Strip Next-specific props to avoid React DOM warnings in tests
    const { alt, ...rest } = props as Record<string, unknown>;
    return React.createElement("img", {
      ...rest,
      alt: alt ?? "",
    });
  },
}));
