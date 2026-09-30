import mongoose, { Schema } from "mongoose";

const playerSchema = new Schema({
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

const Player = mongoose.models.Player || mongoose.model("Player", playerSchema);

export default Player;
