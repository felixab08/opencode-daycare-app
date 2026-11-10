"use client";

import { useEffect, useRef, useState } from "react";
import TextInput from "./TextInput";
import type { Kid } from "./kids-data";

interface AddKidModalProps {
  /** Position the new kid will occupy in the list → cycles the pastel avatar pairs. */
  avatarIndex: number;
  onClose: () => void;
  onAddKid: (kid: Kid) => void;
}

const MONTH_LABELS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// Pastel pairs from kids-data.ts (identity data, no design tokens)
const PASTEL_AVATARS: Kid["avatar"][] = [
  { background: "#A9D9E8", text: "#1F7A93" },
  { background: "#F4B8CC", text: "#C44A7A" },
  { background: "#B9DEC4", text: "#3E8B62" },
  { background: "#F4DC8E", text: "#9A7B1E" },
  { background: "#C9B6E8", text: "#7B5FC0" },
];

const labelClasses = "block text-[12px] font-bold tracking-[0.7px] text-muted mb-2";

// "Martina López" → "martina-lopez" (ASCII, lowercase, spaces to hyphens)
function toAsciiSlug(fullName: string): string {
  return fullName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// First word vs the rest; single word → empty lastName
function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

// "2022-03-12" (input[type=date] value) → "12 mar 2022" (same visible text as kids-data)
function formatKidDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTH_LABELS[month - 1]} ${year}`;
}

export default function AddKidModal({ avatarIndex, onClose, onAddKid }: AddKidModalProps) {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [allergiesText, setAllergiesText] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const canSave = fullName.trim() !== "" && birthDate !== "";

  useEffect(() => {
    firstFieldRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleHideClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget) onClose();
  }

  function handleSave() {
    if (!canSave) return;

    const { firstName, lastName } = splitFullName(fullName);
    const today = new Date();
    const birthYear = Number(birthDate.slice(0, 4));
    const allergyNote = medicalNotes.trim();
    const allergies = allergiesText
      .split(",")
      .map((tag) => tag.trim().toUpperCase())
      .filter(Boolean);

    const newKid: Kid = {
      slug: toAsciiSlug(fullName),
      firstName,
      lastName,
      ageYears: today.getFullYear() - birthYear, // display-only on the card, no birthday adjustment
      birthDate: formatKidDate(birthDate),
      room: "Soles",
      entryDate: `${MONTH_LABELS[today.getMonth()]} ${today.getFullYear()}`,
      allergies,
      ...(allergyNote ? { allergyNote } : {}),
      avatar: PASTEL_AVATARS[avatarIndex % PASTEL_AVATARS.length],
      parents: [],
    };
    onAddKid(newKid);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex overflow-y-auto bg-ink/40 p-4 sm:p-10"
      onClick={handleHideClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-kid-title"
        className="my-auto w-full max-w-[520px] overflow-hidden rounded-[24px] border border-line bg-canvas-warm shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-[26px] py-5">
          <button type="button" onClick={onClose} className="text-[15px] font-bold text-muted">
            Cancelar
          </button>
          <span id="add-kid-title" className="font-fredoka font-semibold text-[18px] text-ink">
            Agregar niño
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={`text-[15px] font-extrabold ${canSave ? "text-accent" : "text-muted"}`}
          >
            Guardar
          </button>
        </div>

        <div className="px-[26px] py-6">
          <label htmlFor="add-kid-name" className={labelClasses}>
            NOMBRE COMPLETO
          </label>
          <TextInput
            ref={firstFieldRef}
            id="add-kid-name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Ej. Martina López"
            className="mb-[18px]"
          />

          <div className="flex gap-3.5 mb-[18px]">
            <div className="flex-1">
              <label htmlFor="add-kid-birth-date" className={labelClasses}>
                FECHA DE NACIMIENTO
              </label>
              <TextInput
                id="add-kid-birth-date"
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className={labelClasses}>SALA</label>
              <div className="flex w-full items-center gap-2 rounded-[14px] border-[1.5px] border-line bg-card px-4 py-3.5 text-[15px] font-bold text-ink">
                Soles
                <span className="flex-1" />
                <svg className="flex-none text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          <label htmlFor="add-kid-allergies" className={labelClasses}>
            ALERGIAS (ETIQUETAS)
          </label>
          <TextInput
            id="add-kid-allergies"
            value={allergiesText}
            onChange={(event) => setAllergiesText(event.target.value)}
            placeholder="Ej. Maní, Lactosa"
            className="mb-[18px]"
          />

          <label htmlFor="add-kid-medical-notes" className={labelClasses}>
            NOTAS MÉDICAS
          </label>
          <textarea
            id="add-kid-medical-notes"
            value={medicalNotes}
            onChange={(event) => setMedicalNotes(event.target.value)}
            placeholder="Indicaciones, medicación, contactos…"
            className="min-h-[90px] w-full resize-y rounded-[14px] border-[1.5px] border-line bg-card px-4 py-3.5 text-[15px] leading-[1.5] text-ink outline-none placeholder:text-muted focus:border-accent-soft"
          />
        </div>
      </div>
    </div>
  );
}
