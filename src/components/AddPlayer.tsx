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
    <div className="p-4">
      <h2 className="text-xl font-bold">Add Player</h2>
      <input className="border p-1 block" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        className="border p-1 block"
        type="number"
        value={elo_s}
        onChange={(e) => setEloS(Number(e.target.value))}
      />
      <input
        className="border p-1 block"
        type="number"
        value={elo_d}
        onChange={(e) => setEloD(Number(e.target.value))}
      />
      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={addPlayer}>
        Add Player
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
