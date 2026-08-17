"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { businessesApi } from "@/lib/api/businesses";
import { Business } from "@/types/business";
import {
  Phone, MessageCircle, Globe, MapPin, Star,
  Mail, Building2, Tag, Navigation, User, Briefcase,
} from "lucide-react";

function ActionButton({
  href,
  icon: Icon,
  label,
  color,
  onClick,
}: {
  href?: string;
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
}) {
  const className = `flex flex-col items-center gap-2 group`;
  const innerContent = (
    <>
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110 ${color}`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {innerContent}
      </button>
    );
  }

  if (!href) return null;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {innerContent}
    </a>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  multiline = false,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  multiline?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p
          className={`text-slate-800 font-medium leading-relaxed ${
            multiline ? "whitespace-pre-line" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function BusinessProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const cardSlug = searchParams.get("card");
  const identifier = cardSlug || id;
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!identifier) return;
    const load = async () => {
      try {
        let res;
        // If it's a 24 character hex string, it's likely a MongoDB ObjectId
        if (identifier.length === 24 && /^[0-9a-fA-F]{24}$/.test(identifier)) {
          res = await businessesApi.getBusiness(identifier);
        } else {
          res = await businessesApi.getBusinessBySlug(identifier);
        }
        setBusiness(res.data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [identifier]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Card Not Found</h2>
          <p className="text-slate-500">
            This digital business card does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const whatsappHref = business.whatsapp_number
    ? `https://wa.me/${business.whatsapp_number.replace(/\D/g, "")}`
    : undefined;
  const callHref = business.call_number
    ? `tel:${business.call_number}`
    : business.contact_number
    ? `tel:${business.contact_number}`
    : undefined;
  const locationHref = business.address
    ? `https://maps.google.com/?q=${encodeURIComponent(business.address)}`
    : business.location
    ? `https://maps.google.com/?q=${encodeURIComponent(business.location)}`
    : undefined;

  // Validate google_review_url is a safe https URL before using it
  const isValidGoogleUrl =
    business.google_review_url &&
    /^https:\/\//.test(business.google_review_url);

  const handleReviewClick = () => {
    const bizId = business?.id || identifier;
    if (bizId) {
      router.push(`/review-generator?businessId=${encodeURIComponent(bizId)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-300 flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl bg-white">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#1a3a5c] to-[#2563a8] px-6 pt-8 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/30 shadow-lg shrink-0 bg-white/10">
              {business.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={business.image_url}
                  alt={business.owner_name || business.company_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white/70">
                    {(business.owner_name || business.company_name || "?")[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {business.owner_name && (
                <h1 className="text-2xl font-bold text-white leading-tight">
                  {business.owner_name}
                </h1>
              )}
              <p className="text-blue-200 font-medium text-sm mt-0.5">
                {business.company_name}
              </p>
              {business.owner_role && (
                <p className="text-blue-300 text-sm mt-0.5">{business.owner_role}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white px-6 py-5 border-b border-slate-100">
          <div className="flex items-start justify-around gap-2">
            <ActionButton href={callHref} icon={Phone} label="Call" color="bg-emerald-500" />
            <ActionButton
              href={whatsappHref}
              icon={MessageCircle}
              label="WhatsApp"
              color="bg-green-500"
            />
            <ActionButton
              href={business.website}
              icon={Globe}
              label="Website"
              color="bg-blue-500"
            />
            <ActionButton
              href={locationHref}
              icon={Navigation}
              label="Location"
              color="bg-orange-500"
            />
            {/* Review button — opens Review Generator for this business */}
            <ActionButton
              icon={Star}
              label="Review"
              color="bg-yellow-500"
              onClick={handleReviewClick}
            />
          </div>
        </div>

        {/* Detail Rows */}
        <div className="bg-white px-6 py-2">
          <DetailRow icon={Building2} label="Company Name" value={business.company_name} />
          {business.owner_name && (
            <DetailRow icon={User} label="Owner" value={business.owner_name} />
          )}
          {business.owner_role && (
            <DetailRow icon={Briefcase} label="Role" value={business.owner_role} />
          )}
          <DetailRow
            icon={Tag}
            label="Services / Products"
            value={business.services_products}
            multiline
          />
          {business.address && (
            <DetailRow icon={MapPin} label="Address" value={business.address} multiline />
          )}
          {!business.address && business.location && (
            <DetailRow icon={MapPin} label="Location" value={business.location} />
          )}
          {business.email && (
            <DetailRow icon={Mail} label="Email" value={business.email} />
          )}
        </div>

        {/* Google Review CTA — direct link to stored URL */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-center border-t border-slate-100">
          {isValidGoogleUrl ? (
            <a
              href={business.google_review_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">
                Leave a Google Review
              </span>
            </a>
          ) : (
            <p className="text-xs text-slate-400 text-center">
              Google Review link not configured for this business.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}