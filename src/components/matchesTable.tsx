type MatchesProps = {
  matches: any[];
};

export default function Matches({ matches }: MatchesProps) {
  const completedMatches = matches.filter((match) => match.status === "completed");
  const leaderboard = matches
    .flatMap((match) => match.team1.concat(match.team2))
    .reduce((acc, player) => {
      const existingPlayer = acc.find((p) => p.player._id === player.player._id);
      if (existingPlayer) {
        existingPlayer.eloAfter = player.eloAfter;
      } else {
        acc.push({ ...player });
      }
      return acc;
    }, [])
    .sort((a, b) => (b.eloAfter ?? b.player.elo) - (a.eloAfter ?? a.player.elo));

  return (
    <div>
      <h2>Leaderboard</h2>
      {/* Sorted elo table from highest -> lowest */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-blue-500">Rank</th>
            <th className="px-4 py-2 text-left font-semibold">Player</th>
            <th className="px-4 py-2 text-left font-semibold">Elo</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={player.player._id}>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{player.player.name}</td>
              <td className="px-4 py-2">{player.eloAfter ?? player.player.elo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Completed Matches</h2>

      {/* Table displaying completed matches */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Players</th>
            <th className="px-4 py-2 text-left font-semibold">Winner</th>
            <th className="px-4 py-2 text-left font-semibold">Elo Change</th>
          </tr>
        </thead>
        <tbody>
          {completedMatches.map((match) => (
            <tr key={match._id}>
              <td className="px-4 py-2 border-b">
                {match.team1.map((player) => player.player.name).join(" & ")} vs{" "}
                {match.team2.map((player) => player.player.name).join(" & ")}
              </td>
              <td className="px-4 py-2 border-b">{match.winner === "team1" ? "Team 1" : "Team 2"}</td>
              <td className="px-4 py-2 border-b">
                {match.team1.reduce((acc, player) => acc + player.eloChange, 0)} /{" "}
                {match.team2.reduce((acc, player) => acc + player.eloChange, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
