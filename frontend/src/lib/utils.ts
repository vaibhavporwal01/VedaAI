import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
    .format(date)
    .replace(/\//g, "-");
}

export function toInputDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function isPastDate(value: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(value);
  selected.setHours(0, 0, 0, 0);
  return selected < today;
}
