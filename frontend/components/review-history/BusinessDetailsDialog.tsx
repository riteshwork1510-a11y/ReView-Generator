import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Business } from "@/types/business";
import {
  MapPin,
  Building,
  Phone,
  PhoneCall,
  MessageCircle,
  Mail,
  Globe,
  Star,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface BusinessDetailsDialogProps {
  business: Business | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BusinessDetailsDialog({
  business,
  open,
  onOpenChange,
}: BusinessDetailsDialogProps) {
  if (!business) return null;

  const handleCopyLink = async () => {
    if (!business.google_review_url) return;
    try {
      await navigator.clipboard.writeText(business.google_review_url);
      toast.add({
        title: "Success",
        description: "Google Review link copied.",
        type: "success",
      });
    } catch {
      toast.add({
        title: "Error",
        description: "Unable to copy review link.",
        type: "error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b relative">
          {business.image_url && (
            <div className="absolute top-0 right-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={business.image_url} 
                alt={`${business.company_name} logo`} 
                className="w-16 h-16 rounded-full object-contain p-1 bg-white border border-slate-200"
              />
            </div>
          )}
          <div className={business.image_url ? "pr-20" : ""}>
            <DialogTitle className="text-2xl font-bold">{business.company_name}</DialogTitle>
            {(business.owner_name || business.owner_role) && (
              <p className="text-sm text-slate-600 mt-1 font-medium">
                {business.owner_name}{business.owner_name && business.owner_role ? ' • ' : ''}{business.owner_role}
              </p>
            )}
            <DialogDescription className="text-slate-600 whitespace-pre-wrap mt-2">
              {business.services_products}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Location */}
          {(business.location || business.address) && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Location
              </h4>
              <div className="space-y-2 text-sm text-slate-600">
                {business.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span>{business.location}</span>
                  </div>
                )}
                {business.address && (
                  <div className="flex items-start gap-3">
                    <Building className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span className="whitespace-pre-wrap">{business.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {(business.call_number ||
            business.whatsapp_number ||
            business.contact_number ||
            business.email) && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Contact Information
              </h4>
              <div className="space-y-2 text-sm text-slate-600">
                {business.call_number && (
                  <div className="flex items-center gap-3">
                    <PhoneCall className="w-4 h-4 text-indigo-400 shrink-0" />
                    <a
                      href={`tel:${business.call_number}`}
                      className="hover:text-indigo-600 hover:underline"
                    >
                      {business.call_number}
                    </a>
                  </div>
                )}
                {business.whatsapp_number && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <a
                      href={`https://wa.me/${business.whatsapp_number.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-600 hover:underline"
                    >
                      {business.whatsapp_number}
                    </a>
                  </div>
                )}
                {business.contact_number && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{business.contact_number}</span>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${business.email}`}
                      className="hover:text-indigo-600 hover:underline break-all"
                    >
                      {business.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Online Presence */}
          {business.website && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Online Presence
              </h4>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 hover:underline break-all flex items-center gap-1"
                >
                  Visit Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Google Review */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Google Review
            </h4>
            {business.google_review_url ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
                  <p className="text-xs text-slate-500 break-all font-mono">
                    {business.google_review_url}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={business.google_review_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 h-9 px-4 rounded-md transition-colors text-sm"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    <span>Open Review</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCopyLink}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No Google Review URL provided.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
