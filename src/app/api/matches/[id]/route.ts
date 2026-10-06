import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Match from "@/database/schemas/matchSchema";
import mongoose from "mongoose";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await connectDB();
    //Stores the id value that was pasted in PostMan
    //EX: localhost:3000/app/api/matches/6ab9b7dfa4775089d71b67bb
    const { id } = await context.params;
    //id == 6ab9b7dfa4775089d71b67bb

    //Reads the input given in the Body Tab in PostMan
    const body = await request.json();
    const { format, team1, team2, winner, status } = body;

    //Checks if if the ID provided in the URL is Malformed
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: `The id provided is malformed.` }, { status: 400 });
    }

    //Finds the Match that contains currentID in its Schema
    const originalMatch = await Match.findById(id).lean();
    //Catches Well-formed IDs (IDs that are valid but not found in the database)
    if (!originalMatch) {
      //Makes sure atleast one of the requried fields is provided in the body.
      if (!format || !team1 || !team2) {
        return NextResponse.json(
          {
            error:
              "No Match Found With Given ID. Provide all 3 required fields in the body { format, team1, team2 } to create a new Match",
          },
          { status: 404 },
        );
      }
      //Creates a new match when a Wellformed ID was provided but not in the database.
      //upsert: true makes it so if an ID is not found in the database it will create a match with the given ID and Fields.
      const create_match = await Match.findByIdAndUpdate(
        id,
        { format, team1, team2, winner, status },
        { new: true, upsert: true, runValidators: true },
      );
      return NextResponse.json({ message: "New Match Succesfully Created", newData: create_match }, { status: 200 });
    }

    //Makes sure atleast one of the requried fields is provided in the body.
    if (!team1 && !team2 && !winner && !status) {
      return NextResponse.json(
        {
          error:
            "Provide atleast 1 of the fields in the body { team1, team2, winner, status } to update an existing Match",
        },
        { status: 400 },
      );
    }
    //Updates Match info when a Wellformed ID matches an existing ID in the database
    const update_match = await Match.findByIdAndUpdate(
      id,
      { team1, team2, winner, status },
      { new: true, runValidators: true },
    );
    return NextResponse.json(
      { message: "Existing Match Successfully Updated", newData: update_match },
      { status: 200 },
    );

    //Catches Other errors I didn't think of.
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
    //Deletes the Match with ID matching deleteID
    const deletedMatch = await Match.findByIdAndDelete(deleteID);

    if (!deletedMatch) {
      return NextResponse.json({ error: "No Match Found With Given ID" }, { status: 404 });
    }
    return NextResponse.json({ message: "Match Successfully Deleted", deletedData: deletedMatch }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
