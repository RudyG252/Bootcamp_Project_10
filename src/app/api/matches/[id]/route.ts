import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Match from "@/database/schemas/matchSchema";
import mongoose from "mongoose";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface MatchFormat {
  _id: mongoose.Types.ObjectId | string;
  format: string;
  team1: mongoose.Types.ObjectId[];
  team2: mongoose.Types.ObjectId[];
  status: string;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await connectDB();
    //currentID stores the id value that was pasted in PostMan
    //EX: localhost:3000/app/api/matches/6ab9b7dfa4775089d71b67bb
    const { id: currentID } = await context.params;
    //currentID == 6ab9b7dfa4775089d71b67bb

    //Reads the input given in the Body Tab in PostMan
    const body = await request.json();
    //newID stores the new id value that was inputed in PostMan Body Tab
    // { newID: "6ab9b7dfa4775089d71b6712" }
    const { newID } = body;
    //newID = 6ab9b7dfa4775089d71b6712

    //Checks if newID was provided in Body in PostMan
    if (!newID) {
      return NextResponse.json({ error: "A newID must be provided" }, { status: 400 });
    }

    //Checks if either currentID and newID is Malformed. Catches currentID first
    for (const [key, value] of Object.entries({ currentID, newID })) {
      if (!mongoose.isValidObjectId(value)) {
        return NextResponse.json({ error: `The ${key} is malformed.` }, { status: 400 });
      }
    }

    //Finds the Match that contains currentID in its Schema
    const originalMatch = (await Match.findById(currentID).lean()) as MatchFormat | null;
    //Catches Well-formed IDs (IDs that are valid but not found in the database)
    if (!originalMatch) {
      return NextResponse.json({ error: "No Match Found With Given ID" }, { status: 404 });
    }

    //Checks if the newID provided already exist in the data or the same as the currentID
    const existingNewMatch = await Match.findById(newID).lean();
    if (existingNewMatch) {
      return NextResponse.json(
        { error: "There is already a Match containing the given newID OR newID is the same as currentID" },
        { status: 409 },
      );
    }

    //Creates a new Match with the newID
    const newMatchDocument: MatchFormat = {
      //currentID is overwritten with the newID
      _id: newID,
      format: originalMatch.format,
      team1: originalMatch.team1,
      team2: originalMatch.team2,
      status: originalMatch.status,
    };

    //savedNewMatch send the new Match containing the updated ID to MongoDB
    const savedNewMatch = await Match.create(newMatchDocument);
    //Match containing the old ID (currentID) is still in the MongoDB so this line deletes that Match with the old ID from the data base.
    await Match.findByIdAndDelete(currentID);
    return NextResponse.json({ message: "Match ID Updated", data: savedNewMatch, status: 200 });

    //Catches Other errors I didn't think of.
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await connectDB();
    //Grabs the ID to be deleted from the URL
    const { id: deleteID } = await context.params;

    if (!mongoose.isValidObjectId(deleteID)) {
      return NextResponse.json({ error: "Malformed ID In The URL" }, { status: 400 });
    }
    //Deletes the Match with ID matching deleteID
    const deletedMatch = await Match.findByIdAndDelete(deleteID);

    if (!deletedMatch) {
      return NextResponse.json({ error: "No Match Found With Given ID" }, { status: 404 });
    }
    return NextResponse.json({ message: "Match Successfully Deleted", deletedData: deletedMatch, status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
