import { NextResponse } from "next/server";

import connectDB from "@/database/db";
import Player from "@/database/schemas/playerSchema";

// Creating a player in the database
export async function POST(request: Request) {
  try {
    await connectDB();

    // Body should have the following format: {name, elo, matches}, however elo and matches are optional
    const body = await request.json();

    //TODO: Create a match using Player.create() with format, team1, team2 and queued as the status

    //TODO: return a NextResponse.json() with the match and a successful status code
  } catch (error) {
    console.error(error);
    //TODO: return a NextResponse.json() with the error and an error status code
  }
}

// Getting a list of all players
export async function GET() {
  try {
    await connectDB();

    //TODO: Create a list of players using Player.find()

    //TODO: return a NextResponse.json() with the list of players and a successful status code
  } catch (error) {
    console.error(error);

    //TODO: return a NextResponse.json() with the error and an error status code
  }
}
