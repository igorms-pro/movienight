import { test, expect, Page } from "@playwright/test";

type MovieLite = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
};

const makeMovie = (id: number): MovieLite => ({
  id,
  title: `Movie ${id}`,
  overview: "Overview",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  release_date: "2020-01-01",
  vote_average: 7,
  vote_count: 100,
  genre_ids: [1],
});

async function mockTmdb(page: Page) {
  const trending = [1, 2, 3, 4].map(makeMovie);
  const nowPlaying = [5, 6, 7, 8].map(makeMovie);
  const topRated = [9, 10, 11, 12].map(makeMovie);
  const detailIds = [...trending, ...nowPlaying, ...topRated].map((m) => m.id);
  const details = Object.fromEntries(
    detailIds.map((id) => [
      id,
      {
        ...makeMovie(id),
        runtime: 120,
        genres: [{ id: 1, name: "Genre" }],
        production_companies: [],
        tagline: "",
        budget: 0,
        revenue: 0,
      },
    ]),
  );

  await page.route("**/3/trending/movie/day**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: trending }),
    }),
  );

  await page.route("**/3/movie/now_playing**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: nowPlaying }),
    }),
  );

  await page.route("**/3/movie/top_rated**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: topRated }),
    }),
  );

  await page.route("**/3/movie/**", (route) => {
    const url = new URL(route.request().url());
    const parts = url.pathname.split("/");
    const maybeId = Number(parts[parts.length - 1]);
    if (!Number.isNaN(maybeId) && details[maybeId]) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(details[maybeId]),
      });
    }
    return route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({}),
    });
  });
}

async function getTranslateX(locator: ReturnType<Page["getByTestId"]>) {
  const matrix = await locator.evaluate((el) => getComputedStyle(el).transform);
  if (!matrix || matrix === "none") return 0;
  const match = matrix.match(/matrix\(.*?, .*?, .*?, .*?, ([\-\d\.]+),/);
  return match ? Number(match[1]) : 0;
}

test.describe("Home page", () => {
  test("desktop experience renders hero and carousels", async ({ page }) => {
    await mockTmdb(page);
    await page.goto("/");

    await expect(page.getByTestId("hero-section")).toBeVisible();
    await expect(page.getByTestId("hero-carousel")).toBeVisible();

    const nowPlaying = page.getByTestId("now-playing-section");
    const topRated = page.getByTestId("top-rated-section");

    const nowPlayingTrack = nowPlaying.getByTestId("movie-carousel-track");
    await expect(nowPlayingTrack).toBeVisible();
    const nowPlayingCount = await nowPlayingTrack.getByTestId("movie-card").count();
    expect(nowPlayingCount).toBeGreaterThan(0);

    const topRatedTrack = topRated.getByTestId("movie-carousel-track");
    await expect(topRatedTrack).toBeVisible();
    const topRatedCount = await topRatedTrack.getByTestId("movie-card").count();
    expect(topRatedCount).toBeGreaterThan(0);
  });

  test("mobile experience: sticky header, hero ctas, carousel paging", async ({ page }) => {
    await mockTmdb(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const brandRow = page.getByTestId("header-brand-row");
    const search = page.getByTestId("header-search");
    await expect(brandRow).toBeVisible();
    await expect(search).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(brandRow).toBeHidden();
    await expect(search).toBeVisible();

    await expect(page.getByTestId("hero-mobile-ctas")).toBeVisible();
    await expect(page.getByTestId("hero-dots-mobile")).toBeVisible();

    const nowPlaying = page.getByTestId("now-playing-section");
    const mobileTrack = nowPlaying.getByTestId("movie-carousel-mobile-track");
    await expect(mobileTrack).toBeVisible();

    const pages = nowPlaying.getByTestId("movie-carousel-mobile-page");
    await expect(pages.nth(0).getByTestId("movie-card")).toHaveCount(2);

    const prev = nowPlaying.getByTestId("movie-carousel-mobile-prev");
    const next = nowPlaying.getByTestId("movie-carousel-mobile-next");
    await expect(prev).toBeDisabled();
    await expect(next).not.toBeDisabled();

    await next.click();
    await expect.poll(async () => getTranslateX(mobileTrack), { timeout: 3000 }).toBeLessThan(-10);
    await expect(prev).not.toBeDisabled();

    await prev.click();
    await expect
      .poll(async () => Math.abs(await getTranslateX(mobileTrack)), { timeout: 3000 })
      .toBeLessThan(5);
    await expect(prev).toBeDisabled();
    await expect(next).not.toBeDisabled();
  });
});
