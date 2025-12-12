import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const originalEnv = { ...process.env };
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

const setEnv = (overrides: Record<string, string | undefined> = {}) => {
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_TMDB_API_KEY: "key",
    NEXT_PUBLIC_TMDB_LANG: "fr-FR",
    NODE_ENV: "test",
    ...overrides,
  };
};

describe("tmdb client request", () => {
  beforeEach(() => {
    vi.resetModules();
    consoleErrorSpy.mockClear();
    setEnv();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns data on success", async () => {
    const getMock = vi.fn().mockResolvedValue({ data: { ok: true } });

    vi.doMock("axios", () => ({
      __esModule: true,
      default: {
        create: () => ({ get: getMock }),
        isAxiosError: () => false,
      },
    }));

    const { request } = await import("@/lib/tmdb/client");
    const res = await request("/hello", { params: { a: 1 } });

    expect(getMock).toHaveBeenCalledWith("/hello", { params: { a: 1 } });
    expect(res).toEqual({ ok: true });
  });

  it("logs axios errors verbosely in development", async () => {
    setEnv({ NODE_ENV: "development" });
    const error = {
      isAxiosError: true,
      response: { status: 500, statusText: "Server" },
      message: "boom",
      code: "ERR",
    };
    const getMock = vi.fn().mockRejectedValue(error);

    vi.doMock("axios", () => ({
      __esModule: true,
      default: {
        create: () => ({ get: getMock }),
        isAxiosError: (err: unknown) => (err as { isAxiosError?: boolean })?.isAxiosError === true,
      },
    }));

    const { request } = await import("@/lib/tmdb/client");

    await expect(request("/fail")).rejects.toBe(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[TMDB API Error]",
      expect.objectContaining({
        url: "/fail",
        status: 500,
        message: "boom",
        code: "ERR",
      }),
    );
  });

  it("logs axios errors minimally in production", async () => {
    setEnv({ NODE_ENV: "production" });
    const error = {
      isAxiosError: true,
      response: { status: 401, statusText: "Unauthorized" },
      message: "bad",
      code: "ERR",
    };
    const getMock = vi.fn().mockRejectedValue(error);

    vi.doMock("axios", () => ({
      __esModule: true,
      default: {
        create: () => ({ get: getMock }),
        isAxiosError: (err: unknown) => (err as { isAxiosError?: boolean })?.isAxiosError === true,
      },
    }));

    const { request } = await import("@/lib/tmdb/client");

    await expect(request("/auth")).rejects.toBe(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[TMDB API Error]",
      expect.objectContaining({
        url: "/auth",
        status: 401,
        timestamp: expect.any(String),
      }),
    );
  });

  it("logs non-axios errors", async () => {
    setEnv({ NODE_ENV: "production" });
    const error = new Error("network down");
    const getMock = vi.fn().mockRejectedValue(error);

    vi.doMock("axios", () => ({
      __esModule: true,
      default: {
        create: () => ({ get: getMock }),
        isAxiosError: () => false,
      },
    }));

    const { request } = await import("@/lib/tmdb/client");

    await expect(request("/other")).rejects.toBe(error);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[TMDB Request Failed]",
      expect.objectContaining({
        url: "/other",
        timestamp: expect.any(String),
      }),
    );
  });
});
