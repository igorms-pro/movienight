import { test, expect } from "@playwright/test";

test.describe("Credits page", () => {
  test("shows crew and cast with toggles and back link", async ({ page }) => {
    await page.goto("/movie/1/credits");

    await expect(page.getByTestId("credits-page")).toBeVisible();
    await expect(page.getByTestId("credits-title")).toContainText("Zootopie 2");

    const crewList = page.getByTestId("credits-crew-list");
    await expect(crewList).toBeVisible();
    await expect(crewList.getByTestId("credits-crew-item")).toHaveCount(2);

    const castList = page.getByTestId("credits-cast-list");
    await expect(castList).toBeVisible();
    await expect(castList.getByTestId("credits-cast-item")).toHaveCount(2);

    // Toggle sections closed and open again
    await page.getByTestId("credits-crew-toggle").click();
    await expect(crewList).toBeHidden();
    await page.getByTestId("credits-crew-toggle").click();
    await expect(crewList).toBeVisible();

    await page.getByTestId("credits-cast-toggle").click();
    await expect(castList).toBeHidden();
    await page.getByTestId("credits-cast-toggle").click();
    await expect(castList).toBeVisible();

    await page.getByTestId("credits-back-button").click();
    await expect(page).toHaveURL(/\/movie\/1$/);
  });
});
