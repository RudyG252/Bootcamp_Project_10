"use client";

import { useId } from "react";
import AsyncSelect from "react-select/async";

interface SearchPlayer {
  _id?: string;
  id?: string;
  name: string;
  elo_s: number;
  elo_d: number;
  matches: string[];
}

export interface PlayerOption {
  value: string;
  label: string;
  player?: SearchPlayer;
}

export async function loadPlayerOptions(inputValue: string): Promise<PlayerOption[]> {
  try {
    const query = inputValue.trim();
    const queryParam = query ? `?search=${encodeURIComponent(query)}` : "";
    const response = await fetch(`/api/players${queryParam}`);
    if (!response.ok) throw new Error("Failed to fetch players");

    const players: SearchPlayer[] = await response.json();
    return players.map((player) => ({
      value: player._id || player.id || "",
      label: player.name || "Unknown Player",
      player,
    }));
  } catch (error) {
    console.error("Error loading search choices:", error);
    return [];
  }
}

interface PlayerSelectProps {
  onChange: (option: PlayerOption | null) => void;
  value?: PlayerOption | null;
  placeholder?: string;
  ariaLabel?: string;
}

export default function PlayerSelect({
  onChange,
  value,
  placeholder = "Search matches by player name...",
  ariaLabel = "Search players",
}: PlayerSelectProps) {
  const instanceId = useId();

  return (
    <AsyncSelect<PlayerOption>
      cacheOptions
      defaultOptions
      loadOptions={loadPlayerOptions}
      onChange={onChange}
      value={value}
      isClearable
      maxMenuHeight={240}
      placeholder={placeholder}
      aria-label={ariaLabel}
      instanceId={instanceId}
      className="text-sm"
      styles={{
        control: (base) => ({ ...base, minHeight: 42, borderRadius: 8 }),
        menu: (base) => ({ ...base, zIndex: 20 }),
        option: (base) => ({ ...base, whiteSpace: "normal", overflowWrap: "anywhere" }),
      }}
    />
  );
}
