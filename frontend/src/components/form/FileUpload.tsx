"use client";

import type { ChangeEvent, InputHTMLAttributes } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  fileName?: string;
  error?: string;
  onFileName: (name?: string) => void;
}

export function FileUpload({ inputProps, fileName, error, onFileName }: FileUploadProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    inputProps.onChange?.(event);
    onFileName(event.target.files?.[0]?.name);
  };

  return (
    <div>
      <label
        className={cn(
          "focus-within:ring-brand focus-within:ring-offset-page flex min-h-[202px] cursor-pointer flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-[#DADADA] bg-white px-6 text-center transition hover:border-primary focus-within:ring-2 focus-within:ring-offset-2",
          error && "border-brand bg-brand/5"
        )}
      >
        <input {...inputProps} className="sr-only" type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={handleChange} />
        <span className="grid size-10 place-items-center rounded-xl bg-white text-primary shadow-soft">
          <UploadCloud size={24} />
        </span>
        <span className="mt-4 text-base font-medium text-ink">{fileName ?? "Choose a file or drag & drop it here"}</span>
        <span className="mt-1 text-sm text-disabled">PDF, JPEG, PNG, upto 10MB</span>
        <span className="mt-5 inline-flex h-9 min-h-9 items-center justify-center rounded-full border border-line bg-white px-6 text-sm font-medium text-ink transition hover:bg-soft">
          Browse Files
        </span>
      </label>
      <p className="mt-4 text-center text-base text-mutedMcp">Upload images of your preferred document/image</p>
      {error ? <p className="mt-2 text-sm font-medium text-brand">{error}</p> : null}
    </div>
  );
}
