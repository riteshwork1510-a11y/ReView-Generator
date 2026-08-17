import { Business } from "@/types/business";
import { ApplicationSettings } from "@/types/settings";
import { BusinessDigitalCard } from "../review-generator/BusinessDigitalCard";
import { BusinessCardSkeleton } from "../review-generator/BusinessCardSkeleton";
import { DigitalCardsEmptyState } from "./DigitalCardsEmptyState";

interface DigitalCardGridProps {
  businesses: Business[];
  settings?: ApplicationSettings | null;
  isLoading: boolean;
  onView: (business: Business) => void;
  onEdit: (business: Business) => void;
  onDelete: (business: Business) => void;
  isSearchEmpty: boolean;
  onClearSearch?: () => void;
  onAddClick: () => void;
}

export function DigitalCardGrid({
  businesses,
  settings,
  isLoading,
  onView,
  onEdit,
  onDelete,
  isSearchEmpty,
  onClearSearch,
  onAddClick,
}: DigitalCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <BusinessCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <DigitalCardsEmptyState 
        isSearchEmpty={isSearchEmpty} 
        onAdd={onAddClick} 
        onClearSearch={onClearSearch} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <BusinessDigitalCard 
          key={business.id} 
          business={business} 
          settings={settings}
          onView={onView}
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}
