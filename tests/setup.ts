import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

// Prevent non-boolean attribute warnings from next/image mock usage in tests
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<"img">) => {
    const { alt, ...rest } = props;
    return React.createElement("img", { ...rest, alt: alt ?? "" });
  },
}));
