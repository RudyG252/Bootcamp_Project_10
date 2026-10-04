import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Player from "@/database/schemas/playerSchema";
import mongoose from "mongoose";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface PlayerFormat {
  _id: mongoose.Types.ObjectId | string;
  name: string;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await connectDB();

    const { id: currentID } = await context.params;

    const body = await request.json();

    const { newID } = body;

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

    const originalPlayer = (await Player.findById(currentID).lean()) as PlayerFormat | null;
    //Catches Well-formed IDs (IDs that are valid but not found in the database)
    if (!originalPlayer) {
      return NextResponse.json({ error: "No Player Found With Given ID" }, { status: 404 });
    }

    //Checks if the newID provided already exist in the data or the same as the currentID
    const existingNewPlayer = await Player.findById(newID).lean();
    if (existingNewPlayer) {
      return NextResponse.json(
        { error: "There is already a Player containing the given newID OR newID is the same as currentID" },
        { status: 409 },
      );
    }
    //Creates a new Player with the new id and required informations based on the Player Schema
    const newPlayerDocument: PlayerFormat = {
      _id: newID,
      name: originalPlayer.name,
    };

    //Creates/Updates a Player with a new ID.
    const savedNewPlayer = await Player.create(newPlayerDocument);
    //Deletes the old Player information containing the old ID from the database
    await Player.findByIdAndDelete(currentID);
    return NextResponse.json({ message: "Player ID Updated", data: savedNewPlayer, status: 200 });

    //Catches Other errors.
  } catch (error) {
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

    //Deletes the Player with ID matching deleteID
    const deletedPlayer = await Player.findByIdAndDelete(deleteID);
    if (!deletedPlayer) {
      return NextResponse.json({ error: "No Player Found With Given ID" }, { status: 404 });
    }
    return NextResponse.json({ message: "Player Succesfully Deleted", deletedData: deletedPlayer, status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
