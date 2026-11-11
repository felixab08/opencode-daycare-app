"use client";

import { useEffect, useRef, useState } from "react";
import TextInput from "./TextInput";
import type { Kid, KidParent } from "./kids-data";

interface LinkParentModalProps {
  kid: Kid;
  onClose: () => void;
  /** Receives the derived pending parent so the owner of the list can add it. */
  onInvite: (parent: KidParent) => void;
}

type Relation = "Mamá" | "Papá" | "Tutor/a";

const RELATION_OPTIONS: Relation[] = ["Mamá", "Papá", "Tutor/a"];

// Pastel parent-avatar colors from kids-data.ts (identity data, no design tokens)
const PARENT_AVATAR_COLORS = ["#C9B6E8", "#A9C7E8", "#F4DC8E", "#A9D9E8", "#F4B8CC", "#B9DEC4"];

const INVITE_CODE_LENGTH = 5;
const INVITE_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// 5 random A-Z0-9 characters, generated once per modal opening (not per render)
function generateInviteCode(): string {
  let code = "";
  for (let index = 0; index < INVITE_CODE_LENGTH; index++) {
    code += INVITE_CODE_ALPHABET[Math.floor(Math.random() * INVITE_CODE_ALPHABET.length)];
  }
  return code;
}

const labelClasses = "block text-[12px] font-bold tracking-[0.7px] text-muted mb-2";

export default function LinkParentModal({ kid, onClose, onInvite }: LinkParentModalProps) {
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [relation, setRelation] = useState<null | Relation>(null);
  // useState initializer → exactly one code per opening; the modal unmounts on close
  const [inviteCode] = useState(generateInviteCode);

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const canSend = parentName.trim() !== "" && parentEmail.trim() !== "" && relation !== null;

  useEffect(() => {
    firstFieldRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleBackdropClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget) onClose();
  }

  function handleSend() {
    if (parentName.trim() === "" || parentEmail.trim() === "" || relation === null) return;

    onInvite({
      name: parentName.trim(),
      relation,
      isActive: false, // pending until the parent activates their account
      avatarColor: PARENT_AVATAR_COLORS[kid.parents.length % PARENT_AVATAR_COLORS.length],
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink/40 p-4 sm:p-10"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-parent-title"
        className="m-auto w-full max-w-[480px] overflow-hidden rounded-[24px] border border-line bg-canvas-warm shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-[26px] py-5">
          <div>
            <span id="link-parent-title" className="block font-fredoka font-semibold text-[18px] text-ink">
              Vincular padre
            </span>
            <span className="block text-[13px] text-muted">a {kid.firstName} {kid.lastName}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] bg-line text-muted"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="px-[26px] py-[22px]">
          <div className="mb-5 flex gap-[11px] rounded-[14px] bg-announcement/10 px-4 py-[13px]">
            <svg className="mt-px flex-none" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <span className="text-[13.5px] leading-[1.45] text-announcement">
              Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {kid.firstName}.
            </span>
          </div>

          <label htmlFor="link-parent-name" className={labelClasses}>
            NOMBRE DEL PADRE/MADRE
          </label>
          <TextInput
            ref={firstFieldRef}
            id="link-parent-name"
            value={parentName}
            onChange={(event) => setParentName(event.target.value)}
            placeholder="Ej. Diego Fernández"
            className="mb-[18px]"
          />

          <label htmlFor="link-parent-email" className={labelClasses}>
            EMAIL
          </label>
          <TextInput
            id="link-parent-email"
            type="email"
            value={parentEmail}
            onChange={(event) => setParentEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
            className="mb-[18px]"
          />

          <span className={labelClasses}>PARENTESCO</span>
          <div className="mb-5 flex gap-[9px]">
            {RELATION_OPTIONS.map((option) => {
              const isSelected = relation === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRelation(option)}
                  aria-pressed={isSelected}
                  className={`flex-1 rounded-full border-[1.5px] py-[11px] font-extrabold text-[14px] ${
                    isSelected
                      ? "border-announcement/40 bg-announcement/20 text-announcement"
                      : "border-line bg-card text-ink/70"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mb-5 rounded-[16px] border-[1.5px] border-dashed border-line bg-canvas-warm px-[18px] py-[18px] text-center">
            <div className={labelClasses}>CÓDIGO DE INVITACIÓN</div>
            <div className="font-fredoka font-semibold text-[34px] tracking-[7px] text-muted">{inviteCode}</div>
            <div className="mt-[6px] text-[13px] text-muted">Vence en 7 días</div>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={`flex w-full items-center justify-center gap-2.25 rounded-[14px] bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent-warm))] py-3.5 font-extrabold text-[15.5px] text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] ${
              canSend ? "" : "cursor-default opacity-50"
            }`}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>
            Enviar invitación
          </button>
        </div>
      </div>
    </div>
  );
}
