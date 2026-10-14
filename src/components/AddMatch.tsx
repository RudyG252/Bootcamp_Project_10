"use client";
import { useState } from "react";
import PlayerSelect from "./PlayerSelect";

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

  // Search players and retain their full records for ELO updates.
  function playerSelect(value: string, setValue: (id: string) => void, label: string, placeholder = "Select player") {
    const player = players.find((p) => p._id === value);
    return (
      <PlayerSelect
        ariaLabel={label}
        placeholder={placeholder}
        value={player ? { value, label: player.name } : null}
        onChange={(option) => {
          if (option?.player) {
            const selectedPlayer = { ...option.player, _id: option.value };
            setPlayers((current) => [...current.filter((p) => p._id !== option.value), selectedPlayer]);
          }
          setValue(option?.value || "");
        }}
      />
    );
  }

  // The form on the page
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Add Match</h2>
        <p className="mt-1 text-sm text-slate-500">Record a result and update the players ratings.</p>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <label className="block text-sm font-medium text-slate-700">
          Match format
          <select
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="singles">Singles</option>
            <option value="doubles">Doubles</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Winning team
          <select
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
          >
            <option value="team1">Team 1 Wins</option>
            <option value="team2">Team 2 Wins</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <fieldset className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <legend className="px-1 text-sm font-semibold text-slate-700">Team 1</legend>
          <div className="space-y-3">
            {playerSelect(team1, setTeam1, "Select Team 1 Player")}
            {format === "doubles" && playerSelect(team1b, setTeam1b, "Select Team 1 Player 2", "Select partner")}
          </div>
        </fieldset>
        <fieldset className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <legend className="px-1 text-sm font-semibold text-slate-700">Team 2</legend>
          <div className="space-y-3">
            {playerSelect(team2, setTeam2, "Select Team 2 Player")}
            {format === "doubles" && playerSelect(team2b, setTeam2b, "Select Team 2 Player 2", "Select partner")}
          </div>
        </fieldset>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <button
          className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto lg:w-full"
          onClick={addMatch}
        >
          Add Match
        </button>
      </div>
    </div>
  );
}
