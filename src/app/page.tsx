import { connection } from "next/server";
import Navbar from "@/components/Navbar";
import LeaderBoard from "@/components/Leaderboard";
import connectDB from "@/database/db";
import Player, { type playerInterface } from "@/database/schemas/playerSchema";

export default async function Home() {
  await connection();
  await connectDB();

  const players = await Player.find().lean<playerInterface[]>();

  if (players.length === 0) {
    return <p>No players yet.</p>;
  }

  return (
    <div>
      {LeaderBoard(players, true)}
      {LeaderBoard(players, false)}
    </div>
  );
}
