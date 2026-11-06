"use client";

import { useState } from "react";
import Link from "next/link";
import PasswordInput from "./PasswordInput";
import TextInput from "./TextInput";

const inputLabelClasses = "block text-[12px] font-bold tracking-[0.7px] text-muted";

export default function ActivateForm() {
  const [code, setCode] = useState("7K4P9");
  const [email, setEmail] = useState("lucia.fernandez@gmail.com");
  const [password, setPassword] = useState("contraseña");
  const [consented, setConsented] = useState(true);

  return (
    <div>
      <label htmlFor="activate-code" className={inputLabelClasses}>
        CÓDIGO DE INVITACIÓN
      </label>
      <TextInput
        id="activate-code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        textClass="font-fredoka text-[18px] font-bold tracking-[3px]"
        className="mb-[18px]"
      />

      <label htmlFor="activate-email" className={inputLabelClasses}>
        EMAIL
      </label>
      <TextInput
        id="activate-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mb-[18px]"
      />

      <label htmlFor="activate-password" className={inputLabelClasses}>
        CREAR CONTRASEÑA
      </label>
      <PasswordInput value={password} onChange={(value) => setPassword(value)} className="mb-[18px]" />

      <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-[14px] bg-canvas-warm px-4 py-3.5">
        <input
          type="checkbox"
          checked={consented}
          onChange={(event) => setConsented(event.target.checked)}
          className="sr-only peer"
        />
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-[8px] border-[1.5px] peer-focus-visible:ring-2 peer-focus-visible:ring-accent-soft ${
            consented ? "border-achievement bg-achievement" : "border-line bg-card"
          }`}
        >
          {consented && (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <span className="text-[14px] leading-[1.45] text-muted">
          Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.
        </span>
      </label>

      <Link
        href="/"
        className="block rounded-[15px] bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent-warm))] py-[15px] text-center font-extrabold text-[16px] text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)]"
      >
        Activar mi cuenta
      </Link>
    </div>
  );
}
