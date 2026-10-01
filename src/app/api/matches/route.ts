import { NextResponse } from "next/server";

import connectDB from "@/database/db";
import Match from "@/database/schemas/matchSchema";

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
