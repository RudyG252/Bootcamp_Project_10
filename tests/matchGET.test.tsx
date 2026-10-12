import { expect, test, describe, vi, beforeEach } from "vitest";
import { GET } from "../src/app/api/matches/route";
import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Match from "@/database/schemas/matchSchema";

vi.mock("@/database/schemas/matchSchema", () => ({
  default: {
    find: vi.fn(),
  },
}));
//Mocks a NextResponse
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({ data, ...init })),
  },
}));
//Mocks a MongoDB connection
vi.mock("@/database/db", () => ({
  default: vi.fn(),
}));

// Unit Testing for GET for ../api/matches/route
describe("GET Unit Test", () => {
  //beforeEach() runs Before every Test Case
  beforeEach(() => {
    //Clears all mock calls before every test case
    vi.clearAllMocks();
    //Doesn't show mock/fake errors in the terminal
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  //Test Case 1: Non-Empty DataBase
  test("Returns a list of Matches and a 200 status if successful", async () => {
    const mockMatches = [
      { id: "1", team1: "Player1", team2: "Player2", status: "queued" },
      { id: "2", team1: "Player3", team2: "Player4", status: "completed" },
    ];

    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(Match.find).mockResolvedValue(mockMatches);

    const response = await GET();

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(Match.find).toHaveBeenCalledTimes(1);

    expect(NextResponse.json).toHaveBeenCalledWith(mockMatches, { status: 200 });
  });
  //Test Case 2: Empty DataBase
  test("Returns an empty array if there are no matches in the database and returns a statsus 200", async () => {
    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(Match.find).mockResolvedValue([]);
    await GET();
    expect(NextResponse.json).toHaveBeenCalledWith([], { status: 200 });
  });

  //Test Case 3: Error Handling
  test("Return status 500 and error message database query fails", async () => {
    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(Match.find).mockRejectedValue(new Error("MongoDB Connection Timeout"));

    await GET();

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Failed to Find Matches" }, { status: 500 });
  });
});
