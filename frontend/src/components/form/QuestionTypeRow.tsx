"use client";

import { ChevronDown, Minus, Plus, X } from "lucide-react";
import { QUESTION_TYPE_OPTIONS } from "@/lib/constants";
import type { QuestionTypeConfig } from "@/types";

interface QuestionTypeRowProps {
  row: QuestionTypeConfig;
  index: number;
  onChange: (index: number, row: QuestionTypeConfig) => void;
  onRemove: (index: number) => void;
}

function Counter({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex-1">
      <span className="hidden text-center text-base font-bold text-ink max-tablet:block">{label}</span>
      <div className="mt-2 flex h-11 min-w-[100px] items-center justify-between rounded-full bg-white px-2 text-base font-bold text-ink desktop:mt-0">
        <button className="focus-ring grid size-8 place-items-center rounded-full text-disabled hover:text-ink" type="button" onClick={() => onChange(Math.max(1, value - 1))}>
          <Minus size={16} />
        </button>
        <span>{value}</span>
        <button className="focus-ring grid size-8 place-items-center rounded-full text-disabled hover:text-ink" type="button" onClick={() => onChange(label === "No. of Questions" ? Math.min(50, value + 1) : value + 1)}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export function QuestionTypeRow({ row, index, onChange, onRemove }: QuestionTypeRowProps) {
  return (
    <div className="relative rounded-[28px] bg-white p-4 desktop:grid desktop:grid-cols-[443px_16px_100px_100px] desktop:items-center desktop:gap-x-4 desktop:rounded-none desktop:bg-transparent desktop:p-0">
      <div className="relative">
        <select
          className="focus-ring h-11 w-full appearance-none rounded-full border-0 bg-white px-4 pr-11 text-sm font-medium text-ink shadow-none hover:bg-soft desktop:text-base"
          value={row.type}
          onChange={(event) => onChange(index, { ...row, type: event.target.value })}
        >
          {QUESTION_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink" size={16} />
      </div>
      <button className="focus-ring absolute right-8 mt-[-34px] grid size-8 place-items-center rounded-full text-ink hover:bg-soft desktop:static desktop:mt-0 desktop:size-4" type="button" onClick={() => onRemove(index)} aria-label="Remove question type">
        <X size={20} className="desktop:size-4" />
      </button>
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-[28px] bg-soft p-3 desktop:contents">
        <Counter label="No. of Questions" value={row.count} onChange={(count) => onChange(index, { ...row, count })} />
        <Counter label="Marks" value={row.marks} onChange={(marks) => onChange(index, { ...row, marks })} />
      </div>
    </div>
  );
}
