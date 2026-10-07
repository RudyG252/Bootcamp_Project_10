import { NextResponse } from "next/server";

import connectDB from "@/database/db";
import Match from "@/database/schemas/matchSchema";
import { isObjectIdOrHexString } from "mongoose";
import Player from "@/database/schemas/playerSchema";

// Creating a match in the database
// Note: eventually we will have to add a match to a player's match list whenever we create one but we
//       will not worry about that quite yet.
export async function POST(request: Request) {
  try {
    await connectDB();

    // body should contain data like the following:
    const body = await request.json();
    const { format, team1, team2 } = body;
    //TODO: Create a match using Match.create() with format, team1, team2 and queued as the status
    const create_match = await Match.create({ format, team1, team2 });
    //TODO: return a NextResponse.json() with the match and a successful status code

    const validElo = (elo: unknown) => typeof elo === "number" && Number.isFinite(elo) && elo >= 0 && elo <= 1000;

    if (!Array.isArray(team1) || !Array.isArray(team2)) {
      return NextResponse.json({ error: "Both teams must be arrays" }, { status: 400 });
    }

    for (const member of [...team1, ...team2]) {
      if (
        typeof member?.player !== "string" ||
        !isObjectIdOrHexString(member.player) ||
        !(await Player.exists({ _id: member.player }))
      ) {
        return NextResponse.json({ error: "Invalid or nonexistent player ID" }, { status: 400 });
      }

      if ([member.eloBefore, member.eloAfter].some((elo) => elo !== undefined && !validElo(elo))) {
        return NextResponse.json({ error: "Elo must be a finite number between 0 and 1000" }, { status: 400 });
      }
    }

    return NextResponse.json(create_match, { status: 201 });
  } catch (error) {
    console.error(error);

    //TODO: return a NextResponse.json() with the error and an error status code
    return NextResponse.json({ error: "Failed to Create Match" }, { status: 500 });
  }
}

// Getting a list of all matches
export async function GET() {
  try {
    await connectDB();

    //TODO: Create a list of matches in the database using Match.find()
    const match_list = await Match.find();
    //TODO: return a NextResponse.json() with the list of matches and a successful status code
    return NextResponse.json(match_list, { status: 200 });
  } catch (error) {
    console.error(error);

    //TODO: return a NextResponse.json() with the error and an error status code
    return NextResponse.json({ error: "Failed to Find Matches" }, { status: 500 });
  }
}
