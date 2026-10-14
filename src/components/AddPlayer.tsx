"use client";
import { useState } from "react";

export default function AddPlayer() {
  const [name, setName] = useState("");
  const [elo_s, setEloS] = useState(300);
  const [elo_d, setEloD] = useState(300);
  const [error, setError] = useState("");

  // Function to add a player
  async function addPlayer() {
    const response = await fetch("/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, elo_s, elo_d }),
    });

    // Message display
    const data = await response.json();
    if (response.ok) {
      setError("");
      alert("Player added successfully!");
    } else {
      setError(data.error || "An error occurred while adding the player.");
    }
  }

  // What it looks like on page
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Add Player</h2>
        <p className="mt-1 text-sm text-slate-500">Add a player and set their starting ratings.</p>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Player name
        <input
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Enter player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <label className="block text-sm font-medium text-slate-700">
          Singles ELO
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            type="number"
            value={elo_s}
            onChange={(e) => setEloS(Number(e.target.value))}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Doubles ELO
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            type="number"
            value={elo_d}
            onChange={(e) => setEloD(Number(e.target.value))}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <button
          className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-auto lg:w-full"
          onClick={addPlayer}
        >
          Add Player
        </button>
      </div>
    </div>
  );
}
