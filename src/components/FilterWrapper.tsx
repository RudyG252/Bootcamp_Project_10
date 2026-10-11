"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchBar } from "./SearchBar";

export default function FilterWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize local state from the current browser URL parameter
  const [activeFilter, setActiveFilter] = useState<string | null>(searchParams.get("playerId"));

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeFilter) {
      params.set("playerId", activeFilter);
    } else {
      params.delete("playerId");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [activeFilter, pathname, router, searchParams]);

  // Render your SearchBar supplying the required setFilter state setter method
  return <SearchBar setFilter={setActiveFilter} />;
}
