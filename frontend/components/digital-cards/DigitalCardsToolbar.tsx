import { Search, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface DigitalCardsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

export function DigitalCardsToolbar({
  searchQuery,
  onSearchChange,
  onAddClick,
}: DigitalCardsToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Title and Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Digital Business Cards</h1>
          <p className="text-slate-500 mt-1">Create and manage your digital business cards.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
          <Link href="/review-generator" passHref>
            <Button 
              variant="outline"
              className="w-full sm:w-auto font-semibold gap-2"
            >
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              Review Generator
            </Button>
          </Link>
          <Button 
            onClick={onAddClick} 
            className="bg-indigo-600 hover:bg-indigo-700 shadow-sm text-white font-semibold w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Digital Card
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search digital business cards..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-4 bg-white border-slate-200 focus-visible:ring-indigo-500 w-full"
        />
      </div>
    </div>
  );
}
