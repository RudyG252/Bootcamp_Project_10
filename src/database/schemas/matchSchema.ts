import mongoose, { Schema } from "mongoose";

// Player data for a match (Name, Elo Change).
// This will allow us to see elo history as we are only storing current elo in player data
const matchPlayerSchema = new Schema(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    eloBefore: {
      type: Number,
    },

    eloChange: {
      type: Number,
    },

    eloAfter: {
      type: Number,
    },
  },
  {
    _id: false,
  },
);

const matchSchema = new Schema({
  format: {
    type: String,
    enum: ["singles", "doubles"],
    required: true,
  },

  // teams use a list (1-2 people for doubles or singles) of the data type we defined above
  team1: {
    type: [matchPlayerSchema],
    required: true,
  },

  team2: {
    type: [matchPlayerSchema],
    required: true,
  },

  winner: {
    type: String,
    enum: ["team1", "team2"],
  },

  // This will be relavant for our court queing system
  status: {
    type: String,
    enum: ["queued", "playing", "completed"],
    default: "queued",
  },
});

const Match = mongoose.models.Match || mongoose.model("Match", matchSchema);

export default Match;
