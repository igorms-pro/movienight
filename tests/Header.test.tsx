import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/Header";

vi.mock("@/components/SearchBar", () => ({
  __esModule: true,
  default: () => <div data-testid="search-bar-mock" />,
}));

vi.mock("@/components/ThemeToggle", () => ({
  __esModule: true,
  default: () => <button data-testid="theme-toggle-mock" />,
}));

describe("Header", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn() as unknown as (x?: number | ScrollToOptions, y?: number) => void;
  });

  it("shows brand row before scrolling", () => {
    render(<Header />);
    expect(screen.getByTestId("header-brand-row")).toBeVisible();
    expect(screen.getByTestId("header-search")).toBeInTheDocument();
    expect(screen.getAllByTestId("theme-toggle-mock").length).toBeGreaterThan(0);
  });

  it("hides brand row on scroll (mobile) and keeps search visible", () => {
    render(<Header />);

    Object.defineProperty(window, "scrollY", { value: 100, writable: true });
    fireEvent.scroll(window);

    const brandRow = screen.getByTestId("header-brand-row");
    expect(brandRow.className).toContain("hidden");
    expect(screen.getByTestId("header-search")).toBeInTheDocument();
  });
});
