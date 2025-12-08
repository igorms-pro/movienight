import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders heading", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /movienight/i })).toBeInTheDocument();
  });
});
