"use client";
import { useEffect, useState } from "react";

//Form
export default function AddMatch() {
  const [players, setPlayers] = useState<any[]>([]);
  const [team1, setTeam1] = useState(""); // id of the team 1 player
  const [team2, setTeam2] = useState(""); // id of the team 2 player
  const [format, setFormat] = useState("singles");
  const [winner, setWinner] = useState("team1");
  const [error, setError] = useState("");

  // Fetch players from the API
  useEffect(() => {
    fetch("/api/players")
      .then((response) => response.json())
      .then(setPlayers);
  }, []);

  // Update player ELO and matches
  async function updatePlayer(player: any, key: string, newElo: number, matchId: string) {
    const response = await fetch(`/api/players/${player._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [key]: newElo, matches: [...player.matches, matchId] }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(`Could not update ${player.name}: ${data.error}`); // say which player failed and why
    }
    return response.ok;
  }

  // Function to add a match
  async function addMatch() {
    // find the two chosen players
    const player1 = players.find((p) => p._id === team1);
    const player2 = players.find((p) => p._id === team2);
    // Check if both players are selected and are different
    if (!player1 || !player2 || player1 === player2) {
      setError("Pick two different players");
      return;
    }

    // Determine which ELO to use based on the match format
    const key = format === "singles" ? "elo_s" : "elo_d";

    // A is higher ELO, B is lower ELO
    const player1IsA = player1[key] >= player2[key];
    const eloA = player1IsA ? player1[key] : player2[key];
    const eloB = player1IsA ? player2[key] : player1[key];
    const aWon = (winner === "team1") === player1IsA; // true if the higher ELO player won

    //Update Elo
    const expectedA = 1 / (1 + 10 ** ((eloB - eloA) / 400));
    const changeA = Math.round(32 * ((aWon ? 1 : 0) - expectedA));
    const newEloA = eloA + changeA;
    const newEloB = eloB - changeA;

    //Which Elo to update for each player
    const newElo1 = player1IsA ? newEloA : newEloB;
    const newElo2 = player1IsA ? newEloB : newEloA;

    //POST the match to the API
    const response = await fetch("/api/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        format,
        team1: [{ player: player1._id, eloBefore: player1[key], eloAfter: newElo1, eloChange: newElo1 - player1[key] }],
        team2: [{ player: player2._id, eloBefore: player2[key], eloAfter: newElo2, eloChange: newElo2 - player2[key] }],
        winner,
        status: "completed",
      }),
    });

    //error handling
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "An error occurred while adding the match.");
      return;
    }

    // PUT both players, stop if one fails
    if (!(await updatePlayer(player1, key, newElo1, data._id))) return;
    if (!(await updatePlayer(player2, key, newElo2, data._id))) return;

    setError("");
    alert("Match added successfully!");
    window.location.reload();
  }

  // The form on the page
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Add Match</h2>
      <select value={team1} onChange={(e) => setTeam1(e.target.value)}>
        <option value="">Select Team 1 Player</option>
        {players.map((player) => (
          <option key={player._id} value={player._id}>
            {player.name}
          </option>
        ))}
      </select>

      <select value={team2} onChange={(e) => setTeam2(e.target.value)}>
        <option value="">Select Team 2 Player</option>
        {players.map((player) => (
          <option key={player._id} value={player._id}>
            {player.name}
          </option>
        ))}
      </select>

      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="singles">Singles</option>
        <option value="doubles">Doubles</option>
      </select>

      <select value={winner} onChange={(e) => setWinner(e.target.value)}>
        <option value="team1">Team 1 Wins</option>
        <option value="team2">Team 2 Wins</option>
      </select>

      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={addMatch}>
        Add Match
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
