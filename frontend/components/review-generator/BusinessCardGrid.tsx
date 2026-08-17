import { Business } from "@/types/business";
import { ApplicationSettings } from "@/types/settings";
import { BusinessDigitalCard } from "./BusinessDigitalCard";
import { EmptyBusinessState } from "./EmptyBusinessState";
import { BusinessCardSkeleton } from "./BusinessCardSkeleton";

interface BusinessCardGridProps {
  businesses: Business[];
  settings?: ApplicationSettings | null;
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (business: Business) => void;
  onDelete: (business: Business) => void;
}

export function BusinessCardGrid({
  businesses,
  settings,
  isLoading,
  onAdd,
  onEdit,
  onDelete
}: BusinessCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <BusinessCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return <EmptyBusinessState onAdd={onAdd} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <BusinessDigitalCard 
          key={business.id} 
          business={business} 
          settings={settings}
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}
