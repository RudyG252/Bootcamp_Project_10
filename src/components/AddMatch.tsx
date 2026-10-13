"use client";
import { useEffect, useState } from "react";

//Form
export default function AddMatch() {
  const [players, setPlayers] = useState<any[]>([]);
  const [team1, setTeam1] = useState(""); // id of team 1's first player
  const [team1b, setTeam1b] = useState(""); // id of team 1's second player
  const [team2, setTeam2] = useState(""); // id of team 2's first player
  const [team2b, setTeam2b] = useState(""); // id of team 2's second player
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
    const doubles = format === "doubles";

    // Determine which ELO to use based on the match format
    const key = doubles ? "elo_d" : "elo_s";

    // The picked ids on each team
    const ids1 = doubles ? [team1, team1b] : [team1];
    const ids2 = doubles ? [team2, team2b] : [team2];
    const allIds = [...ids1, ...ids2];

    // Check every spot is filled and nobody is picked twice
    if (allIds.includes("")) {
      setError("Pick a player for every spot");
      return;
    }
    if (new Set(allIds).size !== allIds.length) {
      setError("The same player can't be picked twice");
      return;
    }

    // find the chosen players
    const team1Players = ids1.map((id) => players.find((p) => p._id === id));
    const team2Players = ids2.map((id) => players.find((p) => p._id === id));

    // Team ELO
    const average = (team: any[]) => team.reduce((sum, p) => sum + p[key], 0) / team.length;
    const elo1 = average(team1Players);
    const elo2 = average(team2Players);

    // A is higher ELO, B is lower ELO
    const team1IsA = elo1 >= elo2;
    const eloA = Math.max(elo1, elo2);
    const eloB = Math.min(elo1, elo2);
    const aWon = (winner === "team1") === team1IsA; // true if the higher ELO team won

    //Update Elo
    const expectedA = 1 / (1 + 10 ** ((eloB - eloA) / 400));
    const changeA = Math.round(32 * ((aWon ? 1 : 0) - expectedA));
    const newEloA = eloA + changeA;
    const newEloB = eloB - changeA;
    // Elo Change
    const change1 = team1IsA ? newEloA - eloA : newEloB - eloB;
    const change2 = team1IsA ? newEloB - eloB : newEloA - eloA;

    // Create a match object to send to the API
    const member = (p: any, change: number) => ({
      player: p._id,
      eloBefore: p[key],
      eloAfter: p[key] + change,
      eloChange: change,
    });

    //POST the match to the API
    const response = await fetch("/api/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        format,
        team1: team1Players.map((p) => member(p, change1)),
        team2: team2Players.map((p) => member(p, change2)),
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

    // PUT every player, stop if one fails
    for (const p of team1Players) {
      if (!(await updatePlayer(p, key, p[key] + change1, data._id))) return;
    }
    for (const p of team2Players) {
      if (!(await updatePlayer(p, key, p[key] + change2, data._id))) return;
    }

    setError("");
    alert("Match added successfully!");
    window.location.reload();
  }

  // A dropdown listing all players
  function playerSelect(value: string, setValue: (id: string) => void, label: string) {
    return (
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="">{label}</option>
        {players.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>
    );
  }

  // The form on the page
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Add Match</h2>
      {playerSelect(team1, setTeam1, "Select Team 1 Player")}
      {format === "doubles" && playerSelect(team1b, setTeam1b, "Select Team 1 Player 2")}
      {playerSelect(team2, setTeam2, "Select Team 2 Player")}
      {format === "doubles" && playerSelect(team2b, setTeam2b, "Select Team 2 Player 2")}

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
