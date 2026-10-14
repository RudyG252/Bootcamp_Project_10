import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    cleanup();
  });

  it("displays the Home link", () => {
    render(<Navbar />);

    const link = screen.getByRole("link", { name: "Home" });
    expect(link.getAttribute("href")).toBe("/");
  });

  it("displays the Players link", () => {
    render(<Navbar />);

    const link = screen.getByRole("link", { name: "Players" });
    expect(link.getAttribute("href")).toBe("/players");
  });

  it("displays the Matches link", () => {
    render(<Navbar />);

    const link = screen.getByRole("link", { name: "Matches" });
    expect(link.getAttribute("href")).toBe("/matches");
  });
});
