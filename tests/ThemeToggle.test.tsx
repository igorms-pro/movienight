import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import ThemeToggle from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  it("defaults to dark and toggles to light", () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole("button", { name: /Basculer le thème/i });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    fireEvent.click(button);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("restores stored theme", () => {
    localStorage.setItem("theme", "light");
    render(<ThemeToggle />);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});
