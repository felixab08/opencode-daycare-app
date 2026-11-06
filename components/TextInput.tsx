import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  /** Font classes. The code-sized invitation code input overrides the 15px default. */
  textClass?: string;
}

export default function TextInput({ className, textClass = "text-[15px]", ...rest }: TextInputProps) {
  return (
    <input
      {...rest}
      className={`w-full rounded-[14px] border-[1.5px] border-line bg-card px-4 py-3.5 ${textClass} text-ink outline-none placeholder:text-muted focus:border-accent-soft ${className ?? ""}`}
    />
  );
}
