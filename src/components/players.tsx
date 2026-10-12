import MatchesTable from "@/components/matchesTable";
import connectDB from "@/database/db";
import Player from "@/database/schemas/playerSchema";
import Match from "@/database/schemas/matchSchema";
import FilterWrapper from "./FilterWrapper";

export const dynamic = "force-dynamic";

interface PlayersProps {
  playerId?: string;
}

export default async function Players({ playerId }: PlayersProps) {
  await connectDB();

  // To test the filter, put { name: "" } in between .findOne() like this:
  // const playerData = await Player.findOne({ name: "Rudy" }).lean();
  const playerData = playerId ? await Player.findById(playerId).lean() : await Player.findOne().lean();

  if (!playerData) {
    return <p>No players found.</p>;
  }

  const matches = await Match.find()
    .populate({ path: "team1.player", model: Player, select: "name" })
    .populate({ path: "team2.player", model: Player, select: "name" })
    .lean();

  const player = {
    name: playerData.name,
    elo_s: playerData.elo_s,
    elo_d: playerData.elo_d,
  };

  const playerMatches = matches.filter((match: any) => {
    return (
      match.team1.some((p: any) => p.player?.name === player.name) ||
      match.team2.some((p: any) => p.player?.name === player.name)
    );
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold ">{player.name}</h1>

        <div className="flex gap-6 mt-4">
          <div className="border rounded-lg p-4">
            <p className="text-gray-500">Singles ELO</p>
            <p className="text-2xl font-bold">{player.elo_s}</p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-gray-500">Doubles ELO</p>
            <p className="text-2xl font-bold">{player.elo_d}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <MatchesTable matches={JSON.parse(JSON.stringify(playerMatches))} playerName={player.name} className="p-0" />
      </div>
    </div>
  );
}
