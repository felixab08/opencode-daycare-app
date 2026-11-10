"use client";

import { useState, type ReactNode } from "react";
import KidCard from "./KidCard";
import type { Kid } from "./kids-data";

interface KidsGridProps {
  kids: Kid[]; // dynamic list owned by the parent screen (starts as the kids-data array)
  children?: ReactNode; // slot rendered between the search box and the grid (e.g. the "SALA SOLES" divider)
}

export default function KidsGrid({ kids, children }: KidsGridProps) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredKids = normalizedQuery
    ? kids.filter(
        (kid) =>
          kid.firstName.toLowerCase().includes(normalizedQuery) ||
          kid.lastName.toLowerCase().includes(normalizedQuery),
      )
    : kids;

  return (
    <>

      <div className="flex items-center gap-2.75 bg-card border border-line rounded-[14px] px-4 py-3 mb-5.5">
        <svg className="flex-none text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          placeholder="Buscar niño…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full border-none bg-transparent text-[15px] text-ink focus:outline-none"
        />
      </div>

      {children}

      {filteredKids.length === 0 ? (
        <p className="text-[14.5px] text-muted">No hay niños que coincidan con la búsqueda</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredKids.map((kid) => (
            <KidCard key={kid.slug} kid={kid} />
          ))}
        </div>
      )}
    </>
  );
}
