"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  onDateRangeChange: (range: { dateFrom?: string; dateTo?: string }) => void;
  className?: string;
}

function getMonthRange(offset: number): { from: Date; to: Date } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const to = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  return { from, to };
}

function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const PRESETS = [
  { label: "All", value: "all" },
  { label: "Previous Month", value: "previous" },
  { label: "Current Month", value: "current" },
] as const;

export function DateRangeFilter({
  onDateRangeChange,
  className,
}: DateRangeFilterProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [activePreset, setActivePreset] = React.useState<string>("all");

  const applyRange = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      onDateRangeChange({
        dateFrom: toISODateString(range.from),
        dateTo: toISODateString(range.to),
      });
    } else if (!range?.from && !range?.to) {
      onDateRangeChange({});
    }
  };

  const handlePreset = (value: string) => {
    setActivePreset(value);
    if (value === "all") {
      applyRange(undefined);
    } else if (value === "previous") {
      const { from, to } = getMonthRange(-1);
      applyRange({ from, to });
    } else if (value === "current") {
      const { from, to } = getMonthRange(0);
      applyRange({ from, to });
    }
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setActivePreset("");
    applyRange(range);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {PRESETS.map((preset) => (
        <Button
          key={preset.value}
          type="button"
          variant={activePreset === preset.value ? "default" : "outline"}
          size="sm"
          onClick={() => handlePreset(preset.value)}
        >
          {preset.label}
        </Button>
      ))}
      <DatePickerWithRange
        date={date}
        onDateChange={handleDateChange}
        placeholder="Pick a date range"
      />
    </div>
  );
}
