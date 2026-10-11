import MatchesTable from "@/components/matchesTable";
import connectDB from "@/database/db";
import Player from "@/database/schemas/playerSchema";
import Match from "@/database/schemas/matchSchema";
import FilterWrapper from "@/components/FilterWrapper"; // Import the client bridge wrapper

export const dynamic = "force-dynamic";

interface MatchesProps {
  searchParams: Promise<{ playerId?: string }>;
}

export default async function Matches({ searchParams }: MatchesProps) {
  await connectDB();

  const { playerId } = await searchParams;

  // Filter matches where the playerId provided is in team1 or team2
  const query = playerId
    ? {
        $or: [{ "team1.player": playerId }, { "team2.player": playerId }],
      }
    : {}; // If playerId not found, fetches all matches

  const matches = await Match.find(query)
    .populate({ path: "team1.player", model: Player, select: "name" })
    .populate({ path: "team2.player", model: Player, select: "name" })
    .lean();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-4">Matches</h1>

      <div className="mb-6 flex justify-center">
        {/* Swapped with FilterWrapper to bridge the required setFilter state layout */}
        <FilterWrapper />
      </div>

      {matches.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No matches found for this selection.</p>
      ) : (
        <MatchesTable matches={matches} />
      )}
    </div>
  );
}
