import { playerInterface } from "@/database/schemas/playerSchema";
import AddPlayer from "@/components/AddPlayer";
import mongoose from "mongoose";
import Players from "@/components/players";
import FilterWrapper from "@/components/FilterWrapper";

export const mockPlayers = [
  // {
  //   _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
  //   name: "BobBad",
  //   elo_s: 200,
  //   elo_d: 400,
  //   matches: [],
  // },
  // {
  //   _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439012"),
  //   name: "BobGood",
  //   elo_s: 700,
  //   elo_d: 800,
  //   matches: [],
  // },
  // {
  //   _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439013"),
  //   name: "BobMid",
  //   elo_s: 500,
  //   elo_d: 600,
  //   matches: [],
  // },
] as playerInterface[];

export default async function Page({ searchParams }: { searchParams: Promise<{ playerId?: string }> }) {
  const { playerId } = await searchParams;

  return (
    <div>
      <AddPlayer />
      <div className="h-15 w-full rounded-lg mb-6 flex items-center justify-center">
        <FilterWrapper />
      </div>
      <Players playerId={playerId} />
    </div>
  );
}
