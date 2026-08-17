"use client";

import { ReviewType } from "@/lib/service-reviews";
import { cn } from "@/lib/utils";

interface ReviewTypeSelectorProps {
  selectedType: ReviewType;
  onSelect: (type: ReviewType) => void;
}

const REVIEW_TYPES: { type: ReviewType; label: string; description: string }[] = [
  { type: "short", label: "Short", description: "1–2 sentences" },
  { type: "medium", label: "Medium", description: "2–4 sentences" },
  { type: "long", label: "Long", description: "4–7 sentences" },
];

export function ReviewTypeSelector({
  selectedType,
  onSelect,
}: ReviewTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Review Length
      </p>
      <div className="flex gap-2">
        {REVIEW_TYPES.map(({ type, label, description }) => {
          const isSelected = type === selectedType;
          return (
            <button
              key={type}
              id={`review-type-${type}`}
              onClick={() => onSelect(type)}
              className={cn(
                "flex-1 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1",
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"
              )}
              aria-pressed={isSelected}
            >
              <span className="block font-semibold">{label}</span>
              <span
                className={cn(
                  "block text-xs mt-0.5",
                  isSelected ? "text-indigo-200" : "text-slate-400"
                )}
              >
                {description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
