type MatchesProps = {
  matches: any[];
};

export default function Matches({ matches }: MatchesProps) {
  const completedMatches = matches.filter((match) => match.status === "completed");

  return (
    <div>
      <h2>Completed Matches</h2>

      {/* Table displaying completed matches */}
      {/* Sorted elo table from highest -> lowest */}
      <table>
        <thead>
          <tr>
            <th>Players</th>
            <th>Winner</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {completedMatches.map((match) => (
            <tr key={match._id}>
              <td>
                {match.team1.map((player) => player.player.name).join(" & ")} vs{" "}
                {match.team2.map((player) => player.player.name).join(" & ")}
              </td>
              <td>{match.winner === "team1" ? "Team 1" : "Team 2"}</td>
              <td>{match.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
