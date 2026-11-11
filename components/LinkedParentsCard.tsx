"use client";

import type { Kid } from "./kids-data";

interface LinkedParentsCardProps {
  kid: Kid;
}

const parentStatusText = (isActive: boolean): string => (isActive ? "activa" : "invitación enviada");

export default function LinkedParentsCard({ kid }: LinkedParentsCardProps) {
  return (
    <div className="bg-card border border-line rounded-2xl px-4.5 py-4">
      <div className="font-extrabold text-[12.5px] tracking-[0.8px] text-muted mb-3.5">PADRES VINCULADOS</div>
      <div className="flex flex-col gap-3.5">
        {kid.parents.map((parent) => (
          <div key={parent.name} className="flex items-center gap-3">
            <div
              className="flex-none flex h-10 w-10 items-center justify-center rounded-full font-fredoka font-semibold text-[16px] text-white"
              style={{ backgroundColor: parent.avatarColor }}
            >
              {parent.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-[14.5px] text-ink">{parent.name}</div>
              <div className="text-[12.5px] text-muted">{parent.relation} · {parentStatusText(parent.isActive)}</div>
            </div>
            {parent.isActive ? (
              <span className="flex-none text-[10.5px] font-extrabold px-[9px] py-1 rounded-full bg-parent-active text-achievement">ACTIVA</span>
            ) : (
              <span className="flex-none text-[10.5px] font-extrabold px-[9px] py-1 rounded-full bg-parent-pending text-[#9A7B1E]">PENDIENTE</span>
            )}
          </div>
        ))}
        <button
          type="button"
          disabled
          className="flex items-center gap-3 pt-2 cursor-default"
          id="link-parent"
        >
          <span className="flex-none flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-dashed border-line text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </span>
          <span className="font-extrabold text-[14.5px] text-accent">Vincular otro padre</span>
        </button>
      </div>
    </div>
  );
}
