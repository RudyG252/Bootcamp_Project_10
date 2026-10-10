import MatchesTable from "@/components/matchesTable";
import connectDB from "@/database/db";
import Player from "@/database/schemas/playerSchema";
import Match from "@/database/schemas/matchSchema";

export const dynamic = "force-dynamic";

export default async function Matches() {
  await connectDB();

  const matches = await Match.find()
    .populate({ path: "team1.player", model: Player, select: "name" })
    .populate({ path: "team2.player", model: Player, select: "name" })
    .lean();

  if (matches.length === 0) {
    return <p>No matches yet.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl text-center font-bold mb-4">Matches</h1>
      <MatchesTable matches={matches} />
    </div>
  );
}
