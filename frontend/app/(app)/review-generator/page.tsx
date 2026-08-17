"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  RefreshCcw,
  Building2,
  ChevronRight,
  Pencil,
  ArrowLeft,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { businessesApi } from "@/lib/api/businesses";
import { Business } from "@/types/business";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessSelector } from "@/components/review-generator/BusinessSelector";
import { ServiceSelector } from "@/components/review-generator/ServiceSelector";
import { ReviewTypeSelector } from "@/components/review-generator/ReviewTypeSelector";
import { ReviewDisplay } from "@/components/review-generator/ReviewDisplay";
import {
  ReviewType,
  parseBusinessServices,
  getReviewsForService,
  personalizeReview,
} from "@/lib/service-reviews";
import Link from "next/link";

function ReviewGeneratorSkeleton() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="space-y-4 mt-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full max-w-md" />
      </div>
    </div>
  );
}

function BusinessSummaryCard({
  business,
  services,
  onChangeBusiness,
}: {
  business: Business;
  services: string[];
  onChangeBusiness: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Selected Business
          </h3>
        </div>
        <button
          id="change-business-btn"
          onClick={onChangeBusiness}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 shrink-0"
        >
          Change Business
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
            Company
          </p>
          <p className="text-lg font-bold text-slate-900">{business.company_name}</p>
        </div>
        {services.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Available Services
            </p>
            <div className="flex flex-wrap gap-1.5">
              {services.map((s) => (
                <span
                  key={s}
                  className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewGeneratorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get("businessId") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(false);
  const [isPickingBusiness, setIsPickingBusiness] = useState(false);
  const [selectorBusinessId, setSelectorBusinessId] = useState("");

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedReviewType, setSelectedReviewType] = useState<ReviewType>("short");
  const [currentReviewText, setCurrentReviewText] = useState<string | null>(null);

  // Track indices already shown for this service+type combo so we don't repeat
  const shownIndicesRef = useRef<Set<number>>(new Set());

  const businessServices: string[] =
    selectedBusiness ? parseBusinessServices(selectedBusiness.services_products) : [];

  // Pick a random review that hasn't been shown yet for the current service+type
  const pickNewReview = useCallback(
    (service: string, type: ReviewType) => {
      const options = getReviewsForService(service, type);
      if (options.length === 0) {
        setCurrentReviewText(null);
        return;
      }

      // If all shown, reset and start fresh
      if (shownIndicesRef.current.size >= options.length) {
        shownIndicesRef.current.clear();
      }

      // Pick a random index that hasn't been shown
      let idx: number;
      do {
        idx = Math.floor(Math.random() * options.length);
      } while (shownIndicesRef.current.has(idx));

      shownIndicesRef.current.add(idx);

      const companyName = selectedBusiness?.company_name || "this business";
      setCurrentReviewText(personalizeReview(options[idx], companyName));
    },
    [selectedBusiness]
  );

  // Load a single business by ID
  const loadBusinessById = useCallback(async (id: string) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      const res = await businessesApi.getBusiness(id);
      const business = res.data;
      setSelectedBusiness(business);
      const services = parseBusinessServices(business.services_products);
      setSelectedService(services.length > 0 ? services[0] : null);
      setSelectedReviewType("short");
      setCurrentReviewText(null);
      shownIndicesRef.current.clear();
      setIsPickingBusiness(false);
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (e?.response?.status === 404 || e?.response?.status === 400) {
        setErrorMessage("Business not found. It may have been deleted or the link is invalid.");
      } else {
        setErrorMessage("Unable to load the business card. Please check your connection and try again.");
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAllBusinesses = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      const res = await businessesApi.getBusinesses(1, 100);
      setBusinesses(res.data);
    } catch {
      setErrorMessage("Unable to load digital business cards. Please check your connection and try again.");
      setIsError(true);
      toast.add({
        type: "error",
        title: "Error",
        description: "Unable to load digital business cards. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (businessIdParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadBusinessById(businessIdParam);
    } else {
      setSelectedBusiness(null);
      setIsPickingBusiness(true);
      loadAllBusinesses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessIdParam]);

  // When service or review type changes, pick a new review
  useEffect(() => {
    if (selectedService) {
      shownIndicesRef.current.clear();
      pickNewReview(selectedService, selectedReviewType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService, selectedReviewType]);

  const handleChangeBusiness = () => {
    setIsPickingBusiness(true);
    setSelectedService(null);
    setSelectedReviewType("short");
    setCurrentReviewText(null);
    shownIndicesRef.current.clear();
    setSelectorBusinessId(selectedBusiness?.id ?? "");
    setIsLoadingBusiness(false);
    if (businesses.length === 0) {
      loadAllBusinesses();
    }
  };

  const handleSelectorChange = async (id: string) => {
    setSelectorBusinessId(id);
    if (!id) {
      setSelectedBusiness(null);
      return;
    }
    setIsLoadingBusiness(true);
    try {
      const found = businesses.find((b) => b.id === id);
      if (found) {
        setSelectedBusiness(found);
        const services = parseBusinessServices(found.services_products);
        setSelectedService(services.length > 0 ? services[0] : null);
        setSelectedReviewType("short");
        setCurrentReviewText(null);
        shownIndicesRef.current.clear();
        router.push(`/review-generator?businessId=${encodeURIComponent(id)}`, { scroll: false });
        setIsPickingBusiness(false);
      }
    } finally {
      setIsLoadingBusiness(false);
    }
  };

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    setSelectedReviewType("short");
    setCurrentReviewText(null);
    shownIndicesRef.current.clear();
  };

  const handleReviewTypeSelect = (type: ReviewType) => {
    setSelectedReviewType(type);
    setCurrentReviewText(null);
    shownIndicesRef.current.clear();
    if (selectedService) {
      pickNewReview(selectedService, type);
    }
  };

  const handleRegenerate = () => {
    if (selectedService) {
      pickNewReview(selectedService, selectedReviewType);
    }
  };

  const handleRetry = () => {
    if (businessIdParam) {
      loadBusinessById(businessIdParam);
    } else {
      loadAllBusinesses();
    }
  };

  const handleSelectAnotherBusiness = () => {
    router.push("/review-generator");
  };

  if (isLoading) {
    return <ReviewGeneratorSkeleton />;
  }

  if (isError) {
    const isNotFound =
      errorMessage.toLowerCase().includes("not found") ||
      errorMessage.toLowerCase().includes("invalid");

    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="p-10 text-center border-2 border-dashed border-red-100 rounded-xl bg-red-50/50 flex flex-col items-center max-w-lg w-full">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {isNotFound ? "Business Not Found" : "Failed to Load"}
          </h3>
          <p className="text-slate-500 mb-6 text-sm">{errorMessage}</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            {!isNotFound && (
              <Button variant="outline" onClick={handleRetry} className="bg-white gap-2">
                <RefreshCcw className="w-4 h-4" />
                Retry
              </Button>
            )}
            <Button
              id="select-another-business-btn"
              onClick={handleSelectAnotherBusiness}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <Building2 className="w-4 h-4" />
              Select Another Business
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!businessIdParam && businesses.length === 0) {
    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 max-w-lg w-full">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Digital Business Cards Available
          </h3>
          <p className="text-slate-500 mb-6 max-w-xs sm:max-w-sm text-sm">
            Create a Digital Business Card first to use the Review Generator.
          </p>
          <Link
            href="/digital-cards"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-md transition-colors shadow-sm text-sm"
          >
            Create Digital Card
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          href="/digital-cards"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Digital Cards
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Review Generator</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Select a service and review type to generate your Google review.
        </p>
      </div>

      {isPickingBusiness && !selectedBusiness && (
        <div className="space-y-4 max-w-md">
          <BusinessSelector
            businesses={businesses}
            selectedBusinessId={selectorBusinessId}
            onChange={handleSelectorChange}
          />
          {isLoadingBusiness && <Skeleton className="h-10 w-full" />}
        </div>
      )}

      {selectedBusiness && (
        <div className="space-y-6">
          <BusinessSummaryCard
            business={selectedBusiness}
            services={businessServices}
            onChangeBusiness={handleChangeBusiness}
          />

          {businessServices.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center space-y-3">
              <p className="text-slate-700 font-medium text-sm">
                No recognized services available for{" "}
                <strong>{selectedBusiness.company_name}</strong>.
              </p>
              <p className="text-slate-500 text-sm">
                Please edit the Digital Business Card and add at least one service from the standard list.
              </p>
              <Link
                href="/digital-cards"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                <Pencil className="w-4 h-4" />
                Edit Digital Card
              </Link>
            </div>
          )}

          {businessServices.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
              <ServiceSelector
                services={businessServices}
                selectedService={selectedService}
                onSelect={handleServiceSelect}
              />
            </div>
          )}

          {selectedService && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-5">
              <ReviewTypeSelector
                selectedType={selectedReviewType}
                onSelect={handleReviewTypeSelect}
              />

              {currentReviewText && (
                <ReviewDisplay
                  service={selectedService}
                  reviewText={currentReviewText}
                  googleReviewUrl={selectedBusiness.google_review_url}
                  onRegenerate={handleRegenerate}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewGeneratorPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
      }
    >
      <ReviewGeneratorContent />
    </Suspense>
  );
}
