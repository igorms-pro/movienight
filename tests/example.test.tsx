import React from "react";
import { render } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/hooks/useMovies", () => ({
  useFeaturedMovies: () => ({ data: [], isLoading: false, error: null }),
  useNowPlayingMovies: () => ({ data: [], isLoading: false, error: null }),
  useTopRatedMovies: () => ({ data: [], isLoading: false, error: null }),
}));

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

describe("HomePage", () => {
  it("renders without crashing", async () => {
    const HomePage = (await import("@/app/page")).default;
    expect(() => render(<HomePage />)).not.toThrow();
  });
});
