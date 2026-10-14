import { expect, test, describe, vi, beforeEach } from "vitest";
import { DELETE } from "../src/app/api/matches/[id]/route"; // Adjust path to match your layout
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/database/db";
import Match from "@/database/schemas/matchSchema";

vi.mock("@/database/db", () => ({ default: vi.fn() }));

vi.mock("@/database/schemas/matchSchema", () => ({
  default: {
    findByIdAndDelete: vi.fn(),
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

// Helper function that mocks getting ID from the URL
function createMockContext(idValue: string) {
  return {
    params: Promise.resolve({ id: idValue }),
  } as any;
}

// Helper to simulate an incoming DELETE(request, context)
function createMockRequest() {
  return new Request("http://localhost/api/matches", {
    method: "DELETE",
  });
}

describe("DELETE Unit Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  //Test Case 1: Wellformed ID provided and in database (gets DELETED)
  test("Returns 200 and success message when match is successfully deleted", async () => {
    const validId = "6ab9b7dfa4775089d71b67bb";
    const mockDeletedMatch = { _id: validId, format: "singles", status: "completed" };

    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(mongoose.isValidObjectId).mockReturnValue(true); // ID format is valid
    vi.mocked(Match.findByIdAndDelete).mockResolvedValue(mockDeletedMatch as any); // DB finds and deletes it

    const req = createMockRequest();
    const ctx = createMockContext(validId);

    await DELETE(req, ctx);

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(Match.findByIdAndDelete).toHaveBeenCalledWith(validId);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Match Successfully Deleted", deletedData: mockDeletedMatch },
      { status: 200 },
    );
  });

  //Test Case 2: Malformed ID in the URL
  test("Returns 400 if the ID provided in the URL parameters is malformed", async () => {
    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(mongoose.isValidObjectId).mockReturnValue(false); // Simulate bad ID structure

    const req = createMockRequest();
    const ctx = createMockContext("invalid-id-123");

    await DELETE(req, ctx);

    expect(mongoose.isValidObjectId).toHaveBeenCalledWith("invalid-id-123");
    expect(Match.findByIdAndDelete).not.toHaveBeenCalled(); // Ensures database execution was blocked!
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Malformed ID In The URL" }, { status: 400 });
  });

  //Test Case 3: Wellformed ID in URL but not in database
  test("Returns 404 if the ID format is correct but the match does not exist in the database", async () => {
    const validId = "6ab9b7dfa4775089d71b67bb";

    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(mongoose.isValidObjectId).mockReturnValue(true);
    vi.mocked(Match.findByIdAndDelete).mockResolvedValue(null); // Database returns null (not found)

    const req = createMockRequest();
    const ctx = createMockContext(validId);

    await DELETE(req, ctx);

    expect(Match.findByIdAndDelete).toHaveBeenCalledWith(validId);
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "No Match Found With Given ID" }, { status: 404 });
  });

  //Test Case 4: Server Error Catch
  test("Returns 500 if the database action throws a critical error", async () => {
    const validId = "6ab9b7dfa4775089d71b67bb";
    const databaseError = new Error("MongoDB Connection Refused");

    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(mongoose.isValidObjectId).mockReturnValue(true);
    vi.mocked(Match.findByIdAndDelete).mockRejectedValue(databaseError); // Force a database failure

    const req = createMockRequest();
    const ctx = createMockContext(validId);

    await DELETE(req, ctx);

    expect(NextResponse.json).toHaveBeenCalledWith(databaseError, { status: 500 });
  });

  //Test Case 5: Server Runtime Catch
  test("Returns status 500 if the database writing action crashes", async () => {
    const validId = "6ab9b7dfa4775089d71b67bb";
    const runtimeError = new Error("Unexpected Server Crash");

    vi.mocked(connectDB).mockResolvedValue(undefined);
    vi.mocked(mongoose.isValidObjectId).mockReturnValue(true);
    vi.mocked(Match.findByIdAndDelete).mockRejectedValue(runtimeError); // Force a runtime failure

    const req = createMockRequest();
    const ctx = createMockContext(validId);

    await DELETE(req, ctx);

    expect(NextResponse.json).toHaveBeenCalledWith(runtimeError, { status: 500 });
  });
});
