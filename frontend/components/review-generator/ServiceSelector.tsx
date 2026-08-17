"use client";

import { CanonicalService } from "@/lib/service-reviews";
import { cn } from "@/lib/utils";

interface ServiceSelectorProps {
  services: string[];
  selectedService: string | null;
  onSelect: (service: string) => void;
}

export function ServiceSelector({
  services,
  selectedService,
  onSelect,
}: ServiceSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Select a Service
      </p>
      <div className="flex flex-wrap gap-2">
        {services.map((service) => {
          const isSelected = service === selectedService;
          return (
            <button
              key={service}
              id={`service-btn-${service.replace(/[\s&/]/g, "-").toLowerCase()}`}
              onClick={() => onSelect(service)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1",
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"
              )}
              aria-pressed={isSelected}
            >
              {service}
            </button>
          );
        })}
      </div>
    </div>
  );
}
