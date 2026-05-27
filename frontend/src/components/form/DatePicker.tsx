import { CalendarPlus } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface DatePickerProps {
  value?: string;
  error?: string;
  onChange: (value: string) => void;
}

export function DatePicker({ value, error, onChange }: DatePickerProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-bold text-ink">Due Date</span>
      <div className="relative">
        <Input
          error={error}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(event) => onChange(event.target.value)}
          type="date"
          value={value}
        />
        <CalendarPlus className="pointer-events-none absolute right-4 top-[11px] text-ink" size={22} />
      </div>
    </label>
  );
}
