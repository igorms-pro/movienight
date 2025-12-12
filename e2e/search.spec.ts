import { test, expect } from "@playwright/test";

test.describe("Search experience", () => {
  test("header search suggestions navigate to movie", async ({ page }) => {
    await page.goto("/");

    const input = page.getByTestId("search-input");
    await input.click();
    await input.fill("Avatar");

    const suggestionItems = page.getByTestId("search-suggestion");
    await expect(suggestionItems).toHaveCount(3, { timeout: 10_000 });

    await suggestionItems.first().click();
    await expect(page).toHaveURL(/\/movie\/13$/);
  });

  test("search results page renders cards and navigates", async ({ page }) => {
    await page.goto("/search?q=Matrix");

    await expect(page.getByTestId("search-page")).toBeVisible();
    await expect(page.getByTestId("search-page").getByRole("heading", { level: 1 })).toContainText(
      "Matrix — 6 résultats",
    );

    const cards = page.getByTestId("search-card");
    await expect(cards).toHaveCount(3);

    await cards.first().click();
    await expect(page).toHaveURL(/\/movie\/13$/);
  });

  test("search load more appends results", async ({ page }) => {
    await page.route("**/3/search/movie**", (route) => {
      const url = new URL(route.request().url());
      const pageParam = Number(url.searchParams.get("page") || "1");
      const base = [
        { id: pageParam * 10 + 1, title: `Movie ${pageParam}-1`, poster_path: "/poster.jpg" },
        { id: pageParam * 10 + 2, title: `Movie ${pageParam}-2`, poster_path: "/poster.jpg" },
      ];
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          page: pageParam,
          results: base.map((m) => ({
            ...m,
            overview: "Overview",
            backdrop_path: "/backdrop.jpg",
            release_date: "2020-01-01",
            vote_average: 7,
            vote_count: 100,
            genre_ids: [1],
          })),
          total_pages: 2,
          total_results: 4,
        }),
      });
    });

    await page.goto("/search?q=Playwright");
    const cards = page.getByTestId("search-card");
    await expect(cards).toHaveCount(3);

    const loadMore = page.getByTestId("search-load-more");
    await expect(loadMore).toBeVisible();
    await loadMore.click();

    await expect(cards).toHaveCount(6, { timeout: 5000 });
    await expect(page.getByTestId("search-load-more")).toBeHidden();
  });
});
