import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const originalEnv = { ...process.env };

describe("tmdbApi with E2E mock", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      E2E_MOCK: "1",
      NEXT_PUBLIC_E2E_MOCK: "1",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns mocked trending data", async () => {
    const { tmdbApi } = await import("@/lib/tmdb/api");
    const res = await tmdbApi.getTrending("day");
    expect(res.results).toHaveLength(4);
    expect(res.results[0].title).toBe("Mock Movie 1");
  });

  it("returns mocked movie details", async () => {
    const { tmdbApi } = await import("@/lib/tmdb/api");
    const details = await tmdbApi.getMovieDetails(42);
    expect(details?.id).toBe(42);
    expect(details?.credits?.cast?.length).toBeGreaterThan(0);
  });
});

describe("tmdbApi calls request in non-mock mode", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      E2E_MOCK: "0",
      NEXT_PUBLIC_E2E_MOCK: "0",
      NEXT_PUBLIC_TMDB_API_KEY: "key",
      NEXT_PUBLIC_TMDB_LANG: "fr-FR",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetModules();
  });

  it("calls request with the expected params for movie details", async () => {
    const requestMock = vi.fn().mockResolvedValue({});

    vi.doMock("@/lib/tmdb/client", () => ({
      request: requestMock,
      tmdbLanguage: "fr-FR",
    }));

    const { tmdbApi } = await import("@/lib/tmdb/api");

    await tmdbApi.getMovieDetails(7);

    expect(requestMock).toHaveBeenCalledWith("/movie/7", {
      params: {
        append_to_response: "credits,videos,release_dates",
        include_image_language: "fr-FR,null",
        language: "fr-FR",
      },
    });
  });
});
