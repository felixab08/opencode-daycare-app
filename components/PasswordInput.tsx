"use client";

import { useState, type ChangeEvent } from "react";

interface PasswordInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

export default function PasswordInput({ value, defaultValue, placeholder, onChange }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full rounded-[14px] border-[1.5px] border-line bg-card py-3.5 pl-4 pr-10 text-[15px] text-ink outline-none placeholder:text-muted focus:border-accent-soft"
      />
      <button
        type="button"
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={show}
        onClick={() => setShow((current) => !current)}
        className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted transition duration-150 hover:text-accent"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}
