import { MapPin, Building, Phone, PhoneCall, MessageCircle, Mail, Globe, Star, Pencil, Trash2, ExternalLink, Copy, Eye } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Business } from "@/types/business";
import { ApplicationSettings } from "@/types/settings";

interface BusinessDigitalCardProps {
  business: Business;
  settings?: ApplicationSettings | null;
  onEdit: (business: Business) => void;
  onDelete: (business: Business) => void;
  onView?: (business: Business) => void;
}

export function BusinessDigitalCard({ business, settings, onEdit, onDelete, onView }: BusinessDigitalCardProps) {
  const handleCopyLink = async () => {
    if (!business.google_review_url) return;
    try {
      await navigator.clipboard.writeText(business.google_review_url);
      toast.add({ title: "Success", description: "Google Review link copied.", type: "success" });
    } catch {
      toast.add({ title: "Error", description: "Unable to copy review link.", type: "error" });
    }
  };

  const showGoogleReview = settings ? settings.show_google_review_button : true;
  const reviewCtaText = settings?.review_cta_text || "Give 5-Star Google Review";
  const showCall = settings ? settings.show_call_action : true;
  const showWhatsapp = settings ? settings.show_whatsapp_action : true;
  const showEmail = settings ? settings.show_email_action : true;
  const showWebsite = settings ? settings.show_website_action : true;

  const hasContactActions = 
    (business.call_number && showCall) || 
    (business.whatsapp_number && showWhatsapp) || 
    business.contact_number || 
    (business.email && showEmail) || 
    (business.website && showWebsite);

  const displayWebsite = business.website ? business.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : '';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-md border-slate-200">
      <CardHeader className="pb-4 bg-slate-50 border-b border-slate-100 relative">
        {business.image_url && (
          <div className="absolute top-4 right-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={business.image_url} 
              alt={`${business.company_name} logo`} 
              className="w-12 h-12 rounded-full object-contain p-1 bg-white border border-slate-200"
            />
          </div>
        )}
        <div className={business.image_url ? "pr-14" : ""}>
          <h3 className="font-bold text-xl text-slate-900 break-words">{business.company_name}</h3>
          {(business.owner_name || business.owner_role) && (
            <p className="text-sm text-slate-600 mt-0.5 font-medium">
              {business.owner_name}{business.owner_name && business.owner_role ? ' • ' : ''}{business.owner_role}
            </p>
          )}
          {business.services_products && (
            <p className="text-sm text-slate-500 font-medium whitespace-pre-wrap line-clamp-2 mt-1">
              {business.services_products}
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-5 space-y-4 flex-1 text-sm text-slate-600">
        {(business.location || business.address) && (
          <div className="space-y-2">
            {business.location && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="break-words font-medium text-slate-700">{business.location}</span>
              </div>
            )}
            {business.address && (
              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="break-words whitespace-pre-wrap">{business.address}</span>
              </div>
            )}
          </div>
        )}

        {hasContactActions && (
          <div className="space-y-2.5 pt-4 mt-2 border-t border-slate-100">
            {business.call_number && showCall && (
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-indigo-400 shrink-0" />
                <a href={`tel:${business.call_number}`} className="hover:text-indigo-600 hover:underline break-all">
                  {business.call_number}
                </a>
              </div>
            )}
            {business.whatsapp_number && showWhatsapp && (
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="break-all">{business.whatsapp_number}</span>
              </div>
            )}
            {business.contact_number && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="break-all">{business.contact_number}</span>
              </div>
            )}
            {business.email && showEmail && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={`mailto:${business.email}`} className="hover:text-indigo-600 hover:underline break-all">
                  {business.email}
                </a>
              </div>
            )}
            {business.website && showWebsite && (
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <a 
                  href={business.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 hover:underline break-all line-clamp-1 flex items-center gap-1"
                >
                  {displayWebsite} <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t border-slate-100 flex flex-col gap-3 bg-slate-50">
        {showGoogleReview && (
          business.google_review_url ? (
            <a 
              href={business.google_review_url} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`${reviewCtaText} for ${business.company_name}`}
              className="flex items-center justify-center w-full gap-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 h-10 px-4 py-2 rounded-md transition-colors text-sm shadow-sm"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="truncate">{reviewCtaText}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1 shrink-0" />
            </a>
          ) : (
            <Button 
              variant="outline" 
              disabled
              className="w-full gap-2 font-semibold text-slate-400 bg-slate-50 border-slate-200 h-10"
            >
              <Star className="w-4 h-4 text-slate-300" />
              Google Review link unavailable
            </Button>
          )
        )}

        <div className="flex w-full gap-2">
          {business.google_review_url && showGoogleReview && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              onClick={handleCopyLink}
            >
              <Copy className="w-4 h-4 mr-1.5" />
              Copy
            </Button>
          )}
          {onView && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              onClick={() => onView(business)}
            >
              <Eye className="w-4 h-4 mr-1.5" />
              View
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            onClick={() => onEdit(business)}
          >
            <Pencil className="w-4 h-4 mr-1.5" />
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(business)}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

