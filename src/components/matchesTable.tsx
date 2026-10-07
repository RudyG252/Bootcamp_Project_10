type MatchesProps = {
  matches: any[];
};

export default function Matches({ matches }: MatchesProps) {
  const completedMatches = matches.filter((match) => match.status === "completed");

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Completed Matches</h2>

      {/* Table displaying completed matches */}
      <table className="w-full border-collapse border border-gray-400">
        <thead className="bg-blue-200 border border-gray-400">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Team 1</th>
            <th className="px-4 py-2 text-left font-semibold">Team 2</th>
            <th className="px-4 py-2 text-left font-semibold">Winner</th>
            <th className="px-4 py-2 text-left font-semibold">Elo Change</th>
          </tr>
        </thead>
        <tbody>
          {completedMatches.map((match) => (
            <tr key={match._id}>
              <td className="px-4 py-2 border-b">{match.team1.map((player) => player.player.name).join(" & ")}</td>
              <td className="px-4 py-2 border-b">{match.team2.map((player) => player.player.name).join(" & ")}</td>
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
