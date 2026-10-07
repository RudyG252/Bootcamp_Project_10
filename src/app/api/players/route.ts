import { NextResponse } from "next/server";

import connectDB from "@/database/db";
import Player from "@/database/schemas/playerSchema";
import { isObjectIdOrHexString } from "mongoose";
import Match from "@/database/schemas/matchSchema";

// Creating a player in the database
export async function POST(request: Request) {
  try {
    await connectDB();

    // Body should have the following format: {name, elo, matches}, however elo and matches are optional
    const body = await request.json();

    const { name, elo_s, elo_d, matches } = body;

    // Validate the input data for player Rules

    const trimmedName = typeof name === "string" ? name.trim() : "";

    if (trimmedName.length < 2 || trimmedName.length > 57) {
      return NextResponse.json({ error: "Invalid player name" }, { status: 400 });
    }

    if (elo_s !== undefined && (!Number.isFinite(elo_s) || elo_s < 0 || elo_s > 1000)) {
      return NextResponse.json({ error: "Invalid elo_s value" }, { status: 400 });
    }

    if (elo_d !== undefined && (!Number.isFinite(elo_d) || elo_d < 0 || elo_d > 1000)) {
      return NextResponse.json({ error: "Invalid elo_d value" }, { status: 400 });
    }

    // Match List check TODO

    // Validate the input data for Match Rules

    if (matches !== undefined) {
      if (!Array.isArray(matches)) {
        return NextResponse.json({ error: "matches must be an array" }, { status: 400 });
      }

      for (const id of matches) {
        if (typeof id !== "string" || !isObjectIdOrHexString(id) || !(await Match.exists({ _id: id }))) {
          return NextResponse.json({ error: "Invalid or nonexistent match ID" }, { status: 400 });
        }
      }
    }

    //TODO: Create a match using Player.create() with format, team1, team2 and queued as the status
    const create_player = await Player.create({
      name: trimmedName,
      elo_s,
      elo_d,
      matches,
    });

    //TODO: return a NextResponse.json() with the match and a successful status code
    return NextResponse.json(create_player, { status: 201 });
  } catch (error) {
    console.error(error);
    //TODO: return a NextResponse.json() with the error and an error status code
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
  }
}

// Getting a list of all players
export async function GET() {
  try {
    await connectDB();

    //TODO: Create a list of players using Player.find()
    const player_list = await Player.find();

    //TODO: return a NextResponse.json() with the list of players and a successful status code
    return NextResponse.json(player_list, { status: 200 });
  } catch (error) {
    console.error(error);

    //TODO: return a NextResponse.json() with the error and an error status code
    return NextResponse.json({ error: "Failed to find players" }, { status: 500 });
  }
}
