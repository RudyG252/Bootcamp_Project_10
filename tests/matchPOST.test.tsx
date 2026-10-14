import { expect, test, describe, vi, beforeEach } from "vitest";
import { POST } from "../src/app/api/matches/route";
import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Match from "@/database/schemas/matchSchema";
import Player from "@/database/schemas/playerSchema";
import { isObjectIdOrHexString } from "mongoose";

vi.mock("@/database/db", () => ({ default: vi.fn() }));
vi.mock("@/database/schemas/matchSchema", () => ({
  default: { create: vi.fn() },
}));
vi.mock("@/database/schemas/playerSchema", () => ({
  default: { exists: vi.fn() },
}));
vi.mock("mongoose", () => ({
  isObjectIdOrHexString: vi.fn(),
}));
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({ data, ...init })),
  },
}));

// Helper function that mocks PostMan body inputs
function createMockRequest(bodyData: any) {
  return new Request("http://localhost/api/matches", {
    method: "POST",
    body: JSON.stringify(bodyData),
  });
}

// Unit Testing for POST for ../api/matches/route
describe("POST Unit Test", () => {
  beforeEach(() => {
    //Clears all mock calls before every test case
    vi.clearAllMocks();
    //Doesn't show mock/fake errors in the terminal
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  //Test Case 1: Valid Id and Field Format given
  test("Creates a match when all data is valid and returns status 201", async () => {
    const validBody = {
      format: "singles",
      team1: [{ player: "65c2a1b3e4b0f2a1c3d4e5f6", eloBefore: 500, eloAfter: 550 }],
      team2: [{ player: "65c2a1b3e4b0f2a1c3d4e5f7", eloBefore: 500, eloAfter: 450 }],
    };
    const mockCreatedMatch = { _id: "match123", ...validBody, status: "queued" };

    vi.mocked(connectDB).mockResolvedValue(undefined);
    //Treats mock id as valid MongoDB id
    vi.mocked(isObjectIdOrHexString).mockReturnValue(true as any);
    vi.mocked(Player.exists).mockResolvedValue(true as any);
    vi.mocked(Match.create).mockResolvedValue(mockCreatedMatch as any);

    const req = createMockRequest(validBody);
    await POST(req);

    expect(Match.create).toHaveBeenCalledWith({ format: "singles", team1: validBody.team1, team2: validBody.team2 });
    expect(NextResponse.json).toHaveBeenCalledWith(mockCreatedMatch, { status: 201 });
  });

  //Test Case 2: team1 or team2 is given an invalid format
  test("Returns 400 if team1 or team2 are not arrays", async () => {
    const invalidBody = {
      format: "singles",
      team1: "65c2a1b3e4b0f2a1c3d4e5f6",
      team2: [{ player: "65c2a1b3e4b0f2a1c3d4e5f7", eloBefore: 500, eloAfter: 450 }],
    };
    vi.mocked(connectDB).mockResolvedValue(undefined);

    const req = createMockRequest(invalidBody);
    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Both teams must be arrays" }, { status: 400 });
    expect(Match.create).not.toHaveBeenCalled();
  });

  //Test Case 3: If player does not exist in the database
  test("Returns 400 if a player does not exist in the database", async () => {
    const missingPlayerBody = {
      format: "singles",
      team1: [{ player: "Malformed ID or Non-existent Player" }],
      team2: [{ player: "65c2a1b3e4b0f2a1c3d4e5f7", eloBefore: 500, eloAfter: 450 }],
    };
    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(isObjectIdOrHexString).mockReturnValue(true as any);
    vi.mocked(Player.exists).mockResolvedValue(null as any); // Player doesn't exist

    const req = createMockRequest(missingPlayerBody);
    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Invalid or nonexistent player ID" }, { status: 400 });
    expect(Match.create).not.toHaveBeenCalled();
  });

  //Test Case 5: Server Runtime Catch
  test("Returns status 500 if the database writing action crashes", async () => {
    const validBody = { format: "1v1", team1: [], team2: [] };
    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(Match.create).mockRejectedValue(new Error("Database disconnected"));

    const req = createMockRequest(validBody);
    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Failed to Create Match" }, { status: 500 });
  });
  //Test Case 6: Invalid Elo Values
  test("Returns 400 if eloBefore or eloAfter is not a finite number between 0 and 1000", async () => {
    const invalidEloBody = {
      format: "singles",
      team1: [{ player: "65c2a1b3e4b0f2a1c3d4e5f6", eloBefore: -10, eloAfter: 1050 }],
      team2: [{ player: "65c2a1b3e4b0f2a1c3d4e5f7", eloBefore: 500, eloAfter: 450 }],
    };
    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(isObjectIdOrHexString).mockReturnValue(true as any);
    vi.mocked(Player.exists).mockResolvedValue(true as any);

    const req = createMockRequest(invalidEloBody);
    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Elo must be a finite number between 0 and 1000" },
      { status: 400 },
    );
    expect(Match.create).not.toHaveBeenCalled();
  });

  //Test Case 7: Invalid Player ID Format
  test("Returns 400 if player ID is not a valid ObjectId or hex string", async () => {
    const invalidPlayerIdBody = {
      format: "singles",
      team1: [{ player: "invalid-id-format" }],
      team2: [{ player: "65c2a1b3e4b0f2a1c3d4e5f7", eloBefore: 500, eloAfter: 450 }],
    };
    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(isObjectIdOrHexString).mockReturnValue(false as any); // Invalid ID format

    const req = createMockRequest(invalidPlayerIdBody);
    await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Invalid or nonexistent player ID" }, { status: 400 });
    expect(Match.create).not.toHaveBeenCalled();
  });
});
