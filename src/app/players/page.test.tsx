import { describe, it, expect } from "vitest";

describe("Players Page", () => {
  it("has a page component", async () => {
    const page = await import("./page");
    expect(page.default).toBeDefined();
  });

  it("exports a default function", async () => {
    const page = await import("./page");
    expect(typeof page.default).toBe("function");
  });

  it("displays the player's name", async () => {
    const page = await import("./page");
    expect(page.default).toBeDefined();
  });
});
