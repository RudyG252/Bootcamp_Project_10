type MatchesProps = {
  matches: any[];
  playerName?: string;
  className?: string;
};

export default function Matches({ matches, className = "p-4" }: MatchesProps) {
  const completedMatches = matches.filter((match) => match.status === "completed");

  return (
    <div className={`min-w-0 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Completed Matches</h2>

      {/* Table displaying completed matches */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Completed matches, scroll to view more"
        className="max-h-[32rem] overflow-auto rounded-lg border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <table className="w-full min-w-[36rem] border-separate border-spacing-0 whitespace-nowrap text-sm">
          <thead className="bg-blue-200 border border-gray-400">
            <tr>
              <th scope="col" className="sticky top-0 z-10 bg-blue-100 px-4 py-3 text-left font-semibold">
                Team 1
              </th>
              <th scope="col" className="sticky top-0 z-10 bg-blue-100 px-4 py-3 text-left font-semibold">
                Team 2
              </th>
              <th scope="col" className="sticky top-0 z-10 bg-blue-100 px-4 py-3 text-left font-semibold">
                Winner
              </th>
              <th scope="col" className="sticky top-0 z-10 bg-blue-100 px-4 py-3 text-left font-semibold">
                Elo Change
              </th>
            </tr>
          </thead>
          <tbody>
            {completedMatches.map((match) => (
              <tr key={match._id} className="hover:bg-slate-50">
                <td className="px-4 py-2 border-b">
                  {match.team1.map((player: any) => player.player.name).join(" & ")}
                </td>
                <td className="px-4 py-2 border-b">
                  {match.team2.map((player: any) => player.player.name).join(" & ")}
                </td>
                <td className="px-4 py-2 border-b">{match.winner === "team1" ? "Team 1" : "Team 2"}</td>
                <td className="px-4 py-2 border-b">
                  {match.team1.reduce((acc: number, player: any) => acc + player.eloChange, 0)} /{" "}
                  {match.team2.reduce((acc: number, player: any) => acc + player.eloChange, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
