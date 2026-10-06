import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Player from "@/database/schemas/playerSchema";
import mongoose from "mongoose";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await request.json();
    const { name, elo_s, elo_d, matches } = body;

    //Checks if if the ID provided in the URL is Malformed
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: `The id provided is malformed.` }, { status: 400 });
    }

    const originalPlayer = await Player.findById(id).lean();
    //Catches Well-formed IDs (IDs that are valid but not found in the database)
    if (!originalPlayer) {
      if (!name) {
        return NextResponse.json(
          { error: "No Player Found With Given ID. Provide the required field { name }" },
          { status: 404 },
        );
      }
      const create_player = await Player.findByIdAndUpdate(
        id,
        { name, elo_s, elo_d, matches },
        { new: true, upsert: true, runValidators: true },
      );
      return NextResponse.json({ message: "New Player Succesfully Created", newData: create_player }, { status: 200 });
    }

    if (!name && !elo_s && !elo_d && !matches) {
      return NextResponse.json(
        {
          error: "Provide atleast 1 of the fields in the body { name, elo_s, elo_d, matches }",
        },
        { status: 400 },
      );
    }

    const update_player = await Player.findByIdAndUpdate(
      id,
      { name, elo_s, elo_d, matches },
      { new: true, runValidators: true },
    );
    return NextResponse.json(
      { message: "Existing Player Sucessfully Updated", newData: update_player },
      { status: 200 },
    );

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
    return NextResponse.json({ message: "Player Succesfully Deleted", deletedData: deletedPlayer }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
