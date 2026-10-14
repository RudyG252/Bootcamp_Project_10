import LeaderBoard from "@/components/Leaderboard";
import connectDB from "@/database/db";
import Player, { type playerInterface } from "@/database/schemas/playerSchema";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDB();
  const players = await Player.find().lean<playerInterface[]>();

  if (players.length === 0) {
    return <p className="px-4 py-8 text-center text-gray-500">No players yet.</p>;
  }

  return (
    <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
      {LeaderBoard(players, true)}
      {LeaderBoard(players, false)}
    </div>
  );
}
