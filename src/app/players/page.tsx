import { playerInterface } from "@/database/schemas/playerSchema";
import mongoose from "mongoose";

export const mockPlayers = [
  {
    _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
    name: "BobBad",
    elo_s: 200,
    elo_d: 400,
    matches: [],
  },
  {
    _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
    name: "BobGood",
    elo_s: 700,
    elo_d: 800,
    matches: [],
  },
  {
    _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439013"),
    name: "BobMid",
    elo_s: 500,
    elo_d: 600,
    matches: [],
  },
] as playerInterface[];

import Players from "@/components/players";

export default function Page() {
  return <Players />;
}
