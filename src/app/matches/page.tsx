import MatchesTable from "@/components/matchesTable";
import AddMatch from "@/components/AddMatch";
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Matches</h1>
        <p className="mt-1 text-sm text-slate-500">Browse completed matches or record a new result.</p>
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section
          aria-label="Match history"
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          {matches.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No matches found for this selection.</p>
          ) : (
            <div className="min-w-0">
              <MatchesTable matches={matches} className="p-0" />
            </div>
          )}
        </section>
        <aside aria-label="Add a match" className="min-w-0">
          <AddMatch />
        </aside>
      </div>
    </div>
  );
}
