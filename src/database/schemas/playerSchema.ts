import mongoose, { Schema } from "mongoose";

export interface playerInterface {
  _id: mongoose.Types.ObjectId;
  name: String;
  elo_s: number;
  elo_d: number;
  matches: Schema.Types.ObjectId[];
}

const playerSchema = new Schema<playerInterface>({
  name: {
    type: String,
    required: true,
  },

  elo_s: {
    type: Number,
    default: 300,
  },

  elo_d: {
    type: Number,
    default: 300,
  },
  // This will be a list of references to matches stored in our database
  matches: [
    {
      type: Schema.Types.ObjectId,
      ref: "Match",
    },
  ],
});

const Player = mongoose.models.Player || mongoose.model<playerInterface>("Player", playerSchema);

export default Player;
