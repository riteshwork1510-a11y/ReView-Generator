import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { BusinessForm } from "./BusinessForm";
import { Business, BusinessCreateInput } from "@/types/business";

interface BusinessFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Business | null;
  onSubmit: (data: BusinessCreateInput) => Promise<void>;
  isSubmitting: boolean;
}

export function BusinessFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting
}: BusinessFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => !isSubmitting && onOpenChange(val)}>
      <DialogContent showCloseButton={false} className="sm:max-w-4xl p-0 overflow-hidden bg-white max-h-[90vh]">
        <BusinessForm 
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
