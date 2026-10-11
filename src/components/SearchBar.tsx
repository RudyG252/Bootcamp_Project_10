"use client";

import React from "react";
import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";

export interface PlayerOption {
  value: string; // Will hold your unique MongoDB player ID string
  label: string; // Will hold the printable username string
}

interface SearchBarProps {
  // Accepts the required state tracking method from the page container
  setFilter: (playerId: string | null) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ setFilter }) => {
  // Automatically fetches data from your MongoDB backend endpoint as users type
  const loadOptions = async (inputValue: string): Promise<PlayerOption[]> => {
    try {
      // If the search bar is empty, query without filters to show default options
      const queryParam = inputValue.trim() ? `?search=${encodeURIComponent(inputValue.trim())}` : "";

      const response = await fetch(`/api/players${queryParam}`);

      if (!response.ok) throw new Error("Failed to fetch players");

      const players = await response.json();

      // Safely map your data payload if your schema handles objects with '_id' or 'id'
      return players.map((player: { _id?: string; id?: string; name: string }) => ({
        value: player._id || player.id || "",
        label: player.name || "Unknown Player",
      }));
    } catch (error) {
      console.error("Error loading search choices:", error);
      return [];
    }
  };

  const handleChange = (newValue: SingleValue<PlayerOption>) => {
    if (newValue) {
      // Transmit the player ID up to the page filter hook
      setFilter(newValue.value);
    } else {
      // Pass null when the user clears out the search selection
      setFilter(null);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px" }}>
      <AsyncSelect
        cacheOptions
        defaultOptions={true} // Allows options to populate instantly when clicking into the bar
        loadOptions={loadOptions}
        onChange={handleChange}
        isClearable={true}
        placeholder="Search matches by player name..."
        instanceId="player-match-search-select"
      />
    </div>
  );
};
