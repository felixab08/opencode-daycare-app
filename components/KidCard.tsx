import Link from "next/link";
import type { Kid } from "./kids-data";

interface KidCardProps {
  kid: Kid;
}

function ChevronIcon() {
  return (
    <svg
      className="flex-none text-muted"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function LinkedParentsLabel(parentCount: number): string {
  if (parentCount === 0) return "sin padres vinculados";
  if (parentCount === 1) return "1 padre vinculado";
  return `${parentCount} padres vinculados`;
}

export default function KidCard({ kid }: KidCardProps) {
  const parentCount = kid.parents.length;

  return (
    <Link
      href={`/kids/${kid.slug}`}
      className="group flex items-center gap-3.5 min-w-0 bg-card border border-line rounded-[18px] p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,0.5)] transition duration-150 hover:border-accent-soft hover:-translate-y-0.5"
    >
      <div
        className="flex-none flex h-12 w-12 items-center justify-center rounded-full font-fredoka font-semibold text-[19px]"
        style={{ backgroundColor: kid.avatar.background, color: kid.avatar.text }}
      >
        {kid.firstName[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-fredoka font-semibold text-[16px] text-ink truncate">{kid.firstName} {kid.lastName}</div>
        <div className="text-[13px] text-muted">{kid.ageYears} años · {LinkedParentsLabel(parentCount)}</div>
      </div>
      {kid.allergies.length > 0 ? (
        kid.allergies.map((allergy) => (
          <span key={allergy} className="flex-none text-[11px] font-extrabold px-[9px] py-[5px] rounded-full bg-allergy-warm text-accent">
            {allergy}
          </span>
        ))
      ) : parentCount === 0 ? (
        <span className="flex-none text-[11px] font-extrabold px-[9px] py-[5px] rounded-full bg-allergy-pink text-accent">
          VINCULAR
        </span>
      ) : (
        <ChevronIcon />
      )}
    </Link>
  );
}
