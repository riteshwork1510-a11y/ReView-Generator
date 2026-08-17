import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ReviewHistoryToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export function ReviewHistoryToolbar({
  searchQuery,
  onSearchChange,
  onClear,
}: ReviewHistoryToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search businesses..."
          className="pl-9 pr-10 w-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
