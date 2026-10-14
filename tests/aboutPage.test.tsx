import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import About from "@/app/about/page";

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}));

vi.mock("@/components/Leaderboard", () => ({
  default: (_players: unknown, isSingles: boolean) => (
    <div>{isSingles ? "Singles Leaderboard" : "Doubles Leaderboard"}</div>
  ),
}));

vi.mock("@/data/mockPlayers", () => ({
  mockPlayers: [],
}));

describe("About page", () => {
  it("renders the club title and description", () => {
    render(<About />);

    expect(
      screen.getByRole("heading", {
        name: /about the cal poly badminton club/i,
      }),
    ).toBeTruthy();

    expect(screen.getByText(/this app is a home for the cal poly badminton club/i)).toBeTruthy();
  });

  it("renders links to the club's social media", () => {
    render(<About />);

    expect(screen.getByRole("link", { name: "instagram" }).getAttribute("href")).toBe(
      "https://www.instagram.com/slobadminton/?hl=en",
    );

    expect(screen.getByRole("link", { name: "linktree" }).getAttribute("href")).toContain(
      "https://linktr.ee/calpolybadminton",
    );

    expect(screen.getByRole("link", { name: "facebook" }).getAttribute("href")).toBe(
      "https://www.facebook.com/groups/calpolybadmintonteam/",
    );
  });

  it("renders all three How it works steps", () => {
    render(<About />);

    expect(screen.getByText(/matched with players with similar elo/i)).toBeTruthy();
    expect(screen.getByText(/log your win\/loss/i)).toBeTruthy();
    expect(screen.getByText(/elo will be updated automatically/i)).toBeTruthy();
  });
});
