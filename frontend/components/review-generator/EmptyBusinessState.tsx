import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyBusinessStateProps {
  onAdd: () => void;
}

export function EmptyBusinessState({ onAdd }: EmptyBusinessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
        <Building2 className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">No Business Added</h3>
      <p className="text-slate-500 mb-6 max-w-sm">
        Create your first business digital card to start generating reviews.
      </p>
      <Button 
        onClick={onAdd}
        className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
      >
        + Add Business
      </Button>
    </div>
  );
}
