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
    // {format, team1, team2}
    const body = await request.json();

    //TODO: Create a match using Match.create() with format, team1, team2 and queued as the status

    //TODO: return a NextResponse.json() with the match and a successful status code
  } catch (error) {
    console.error(error);

    //TODO: return a NextResponse.json() with the error and an error status code
  }
}

// Getting a list of all matches
export async function GET() {
  try {
    await connectDB();

    //TODO: Create a list of matches in the database using Match.find()

    //TODO: return a NextResponse.json() with the list of matches and a successful status code
  } catch (error) {
    console.error(error);

    //TODO: return a NextResponse.json() with the error and an error status code
  }
}
