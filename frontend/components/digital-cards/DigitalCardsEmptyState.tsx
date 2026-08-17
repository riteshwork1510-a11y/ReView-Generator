import { Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DigitalCardsEmptyStateProps {
  isSearchEmpty: boolean;
  onAdd: () => void;
  onClearSearch?: () => void;
}

export function DigitalCardsEmptyState({
  isSearchEmpty,
  onAdd,
  onClearSearch,
}: DigitalCardsEmptyStateProps) {
  if (isSearchEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
          <Search className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No digital business cards found</h3>
        <p className="text-slate-500 mb-6 max-w-sm">
          Try a different search term.
        </p>
        {onClearSearch && (
          <Button 
            variant="outline"
            onClick={onClearSearch}
            className="shadow-sm bg-white"
          >
            Clear Search
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
        <Building2 className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">No Digital Business Cards Yet</h3>
      <p className="text-slate-500 mb-6 max-w-sm">
        Create your first digital business card to get started.
      </p>
      <Button 
        onClick={onAdd}
        className="bg-indigo-600 hover:bg-indigo-700 shadow-sm text-white font-semibold"
      >
        + Create Digital Card
      </Button>
    </div>
  );
}
