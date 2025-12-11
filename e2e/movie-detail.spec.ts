import { test, expect, Page } from "@playwright/test";

async function mockMovieDetail(page: Page, movieId = 1) {
  const detail = {
    id: movieId,
    title: "Zootopie 2",
    overview: "Une suite attendue.",
    runtime: 105,
    genres: [
      { id: 16, name: "Animation" },
      { id: 35, name: "Comédie" },
    ],
    release_date: "2025-11-26",
    vote_average: 7.8,
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
    videos: {
      results: [
        { id: "tr1", key: "abc123", name: "Bande-annonce", site: "YouTube", type: "Trailer" },
      ],
    },
    credits: {
      cast: [
        { id: 10, name: "Judy Hopps", character: "Judy", order: 0, profile_path: "/c1.jpg" },
        { id: 11, name: "Nick Wilde", character: "Nick", order: 1, profile_path: "/c2.jpg" },
      ],
      crew: [
        { id: 20, name: "Byron Howard", job: "Director" },
        { id: 21, name: "Clark Spencer", job: "Producer" },
      ],
    },
    release_dates: {
      results: [
        {
          iso_3166_1: "US",
          release_dates: [{ certification: "PG" }],
        },
      ],
    },
  };

  await page.route("**/3/movie/**", (route) => {
    const url = new URL(route.request().url());
    const parts = url.pathname.split("/");
    const maybeId = Number(parts[parts.length - 1]);
    if (maybeId === movieId) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(detail),
      });
    }
    return route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({}),
    });
  });
}

test.describe("Movie detail page", () => {
  test("renders detail and navigates to credits", async ({ page }) => {
    await mockMovieDetail(page, 1);
    await page.goto("/movie/1");

    await expect(page.getByTestId("movie-detail")).toBeVisible();
    await expect(page.getByTestId("movie-title")).toHaveText(/Zootopie 2/);
    await expect(page.getByTestId("movie-poster")).toBeVisible();
    await expect(page.getByTestId("movie-synopsis")).toBeVisible();
    await expect(page.getByTestId("movie-crew")).toBeVisible();

    await expect(page.getByTestId("movie-trailers")).toBeVisible();
    await expect(page.getByTestId("trailer-desktop-card")).toHaveCount(1);

    await expect(page.getByTestId("movie-cast-grid").getByTestId("movie-cast-item")).toHaveCount(2);

    await page.getByTestId("movie-cast-see-all").click();
    await expect(page).toHaveURL(/\/movie\/1\/credits/);
    await expect(page.getByTestId("credits-page")).toBeVisible();
  });
});
