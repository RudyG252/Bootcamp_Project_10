"use client";

import PlayerSelect from "./PlayerSelect";

export type { PlayerOption } from "./PlayerSelect";

interface SearchBarProps {
  setFilter: (playerId: string | null) => void;
}

export const SearchBar = ({ setFilter }: SearchBarProps) => (
  <div style={{ width: "100%", maxWidth: "400px" }}>
    <PlayerSelect onChange={(option) => setFilter(option?.value || null)} />
  </div>
);
