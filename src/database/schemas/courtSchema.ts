import mongoose, { Schema } from "mongoose";

const courtSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  // The queue will be a list of matches currently queued on this court, so it will use a reference to a match object
  // This will allow us to immediately update player elo data when a match is changed from playing to completed
  queue: [
    {
      type: Schema.Types.ObjectId,
      ref: "Match",
    },
  ],
});

const Court = mongoose.models.Court || mongoose.model("Court", courtSchema);

export default Court;
