"use client";

import type { ChoiceOption } from "@/lib/types";

type ChoiceChipProps = {
  option: ChoiceOption;
  selected: boolean;
  onSelect: (value: string) => void;
};

export function ChoiceChip({ option, selected, onSelect }: ChoiceChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`w-full rounded-3xl border px-4 py-4 text-left transition active:scale-[0.99] ${
        selected
          ? "border-rose-400 bg-rose-50 shadow-sm"
          : "border-orange-100 bg-white hover:border-orange-200 hover:bg-orange-50/50"
      }`}
    >
      <div className="text-base font-semibold text-slate-900">{option.label}</div>
      <div className="mt-1 text-sm text-slate-500">{option.hint}</div>
    </button>
  );
}
