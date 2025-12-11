import { test, expect } from "@playwright/test";

test.describe("Search experience", () => {
  test("header search suggestions navigate to movie", async ({ page }) => {
    await page.goto("/");

    const input = page.getByTestId("search-input");
    await input.click();
    await input.fill("Avatar");

    const suggestionItems = page.getByTestId("search-suggestion");
    await expect(suggestionItems).toHaveCount(2, { timeout: 10_000 });

    await suggestionItems.first().click();
    await expect(page).toHaveURL(/\/movie\/13$/);
  });

  test("search results page renders cards and navigates", async ({ page }) => {
    await page.goto("/search?q=Matrix");

    await expect(page.getByTestId("search-page")).toBeVisible();
    await expect(page.getByTestId("search-page").getByRole("heading", { level: 1 })).toContainText(
      "Matrix — 2 résultats",
    );

    const cards = page.getByTestId("search-card");
    await expect(cards).toHaveCount(2);

    await cards.first().click();
    await expect(page).toHaveURL(/\/movie\/13$/);
  });
});
