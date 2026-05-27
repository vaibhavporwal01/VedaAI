import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={cn(
          "focus-ring h-11 w-full rounded-full border border-line bg-white px-4 text-sm text-ink placeholder:text-disabled transition hover:border-[#DADADA] focus-visible:border-primary disabled:bg-[#F0F0F0] disabled:text-disabled",
          error && "border-brand text-brand focus-visible:border-brand",
          className
        )}
        {...props}
      />
      {error ? <p className="mt-2 text-xs font-medium text-brand">{error}</p> : null}
    </div>
  );
}
