import { expect, test, describe, vi, beforeEach } from "vitest";
import { PUT } from "../src/app/api/matches/[id]/route";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/database/db";
import Match from "@/database/schemas/matchSchema";

vi.mock("@/database/schemas/matchSchema", () => ({
  default: {
    findById: vi.fn(() => ({
      lean: vi.fn(),
    })),
    findByIdAndUpdate: vi.fn(),
  },
}));

vi.mock("mongoose", () => ({
  default: {
    isValidObjectId: vi.fn(),
  },
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({ data, ...init })),
  },
}));
vi.mock("@/database/db", () => ({
  default: vi.fn(),
}));

//Helper function that mocks getting the id value in the URL
function createMockContext(idValue: string) {
  return {
    params: Promise.resolve({ id: idValue }),
  } as any;
}
//Helper function that mocks PostMan body inputs
function createMockRequest(bodyData: any) {
  return new Request("http://localhost/api/matches", {
    method: "PUT",
    body: JSON.stringify(bodyData),
  });
}

// Unit Testing for POST for ../api/matches//[id]/route
describe("PUT Unit Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  //Test Case 1: ID in the URL is Malformed
  test("Returns 400 if the ID provided in the URL parameters is malformed ", async () => {
    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(mongoose.isValidObjectId).mockReturnValue(false); // Simulate bad ID formatting

    const req = createMockRequest({ format: "singles" });
    const ctx = createMockContext("Malformed ID");

    await PUT(req, ctx);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "The id provided is malformed." }, { status: 400 });
  });

  //Test Case 2: ID provided in the URL is valid but not in the database and all required fields are provided in the body
  test("Returns 200 and performs an upsert if a valid ID does not exist but all 3 required fields are provided", async () => {
    const validId = "6ab9b7dfa4775089d71b67bb";
    const bodyPayload = { format: "singles", team1: ["Person1"], team2: ["Person2"] };
    const mockCreatedMatch = { _id: validId, ...bodyPayload };

    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(mongoose.isValidObjectId).mockReturnValue(true);

    // Simulate Match.findById(id).lean() returning null (Not Found)
    const findByIdSpy = vi.spyOn(Match, "findById");
    findByIdSpy.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as any);

    vi.mocked(Match.findByIdAndUpdate).mockResolvedValue(mockCreatedMatch as any);

    const req = createMockRequest(bodyPayload);
    const ctx = createMockContext(validId);

    await PUT(req, ctx);

    expect(Match.findByIdAndUpdate).toHaveBeenCalledWith(validId, bodyPayload, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "New Match Succesfully Created", newData: mockCreatedMatch },
      { status: 200 },
    );
  });

  //Test Case 3: ID is valid but not in the database also missing required fields in body
  test("Returns 404 if a valid ID does not exist and any required upsert fields are missing", async () => {
    const validId = "6ab9b7dfa4775089d71b67bb";
    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(mongoose.isValidObjectId).mockReturnValue(true);

    const findByIdSpy = vi.spyOn(Match, "findById");
    findByIdSpy.mockReturnValue({ lean: vi.fn().mockResolvedValue(null) } as any);

    const req = createMockRequest({ format: "1v1" }); // Missing team1 and team2!
    const ctx = createMockContext(validId);

    await PUT(req, ctx);

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        error:
          "No Match Found With Given ID. Provide all 3 required fields in the body { format, team1, team2 } to create a new Match",
      },
      { status: 404 },
    );
    expect(Match.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  //Test Case 4: ID is found in the database and all required fields provided
  test("Returns 200 and updates match properties when an ID matches a database record", async () => {
    const validId = "6ab9b7dfa4775089d71b67bb";
    const existingMatch = { _id: validId, format: "singles", team1: ["Person1"], team2: ["Person2"] };
    const updatePayload = { status: "completed", winner: "team1" };
    const updatedMatch = { ...existingMatch, ...updatePayload };

    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(mongoose.isValidObjectId).mockReturnValue(true);

    const findByIdSpy = vi.spyOn(Match, "findById");
    findByIdSpy.mockReturnValue({ lean: vi.fn().mockResolvedValue(existingMatch) } as any);

    vi.mocked(Match.findByIdAndUpdate).mockResolvedValue(updatedMatch as any);

    const req = createMockRequest(updatePayload);
    const ctx = createMockContext(validId);

    await PUT(req, ctx);

    expect(Match.findByIdAndUpdate).toHaveBeenCalledWith(validId, updatePayload, { new: true, runValidators: true });
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Existing Match Successfully Updated", newData: updatedMatch },
      { status: 200 },
    );
  });

  //Test Case 5: ID is found in the database but missing required fields
  test("Returns 400 if an existing match matches the ID but no update fields are passed in the request body", async () => {
    const validId = "6ab9b7dfa4775089d71b67bb";
    const existingMatch = { _id: validId, format: "singles" };

    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(mongoose.isValidObjectId).mockReturnValue(true);

    const findByIdSpy = vi.spyOn(Match, "findById");
    findByIdSpy.mockReturnValue({ lean: vi.fn().mockResolvedValue(existingMatch) } as any);

    const req = createMockRequest({ format: "doubles" }); // format is provided, but team1/team2/winner/status are all omitted!
    const ctx = createMockContext(validId);

    await PUT(req, ctx);

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        error:
          "Provide atleast 1 of the fields in the body { team1, team2, winner, status } to update an existing Match",
      },
      { status: 400 },
    );
    expect(Match.findByIdAndUpdate).not.toHaveBeenCalled();
  });
});
