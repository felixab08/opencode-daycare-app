import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function TextInput({ className, ...rest }: TextInputProps) {
  return (
    <input
      {...rest}
      className={`w-full rounded-[14px] border-[1.5px] border-line bg-card px-4 py-3.5 text-[15px] text-ink outline-none placeholder:text-muted focus:border-accent-soft ${className ?? ""}`}
    />
  );
}
