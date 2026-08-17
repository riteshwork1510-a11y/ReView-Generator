"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { businessesApi } from "@/lib/api/businesses";
import { getSettings } from "@/lib/api/settings";
import { Business, BusinessCreateInput } from "@/types/business";
import { ApplicationSettings } from "@/types/settings";
import { useDebounce } from "@/hooks/use-debounce";

// Components
import { DigitalCardsToolbar } from "@/components/digital-cards/DigitalCardsToolbar";
import { DigitalCardGrid } from "@/components/digital-cards/DigitalCardGrid";
import { ReviewHistoryPagination } from "@/components/review-history/ReviewHistoryPagination";
import { BusinessDetailsDialog } from "@/components/review-history/BusinessDetailsDialog";
import { BusinessFormDialog } from "@/components/review-generator/BusinessFormDialog";
import { DeleteBusinessDialog } from "@/components/review-generator/DeleteBusinessDialog";

function DigitalCardsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL State
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";

  // Component State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [settings, setSettings] = useState<ApplicationSettings | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(initialPage);
  const limit = 20;

  // Search State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Status State
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modals State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [businessToView, setBusinessToView] = useState<Business | null>(null);

  // Fetch Logic
  const fetchBusinesses = useCallback(async (currentPage: number, currentSearch: string, signal?: AbortSignal) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [response, settingsRes] = await Promise.all([
        businessesApi.getBusinesses(currentPage, limit, currentSearch, signal),
        getSettings().catch(() => null)
      ]);
      setBusinesses(response.data);
      if (settingsRes && settingsRes.success) {
        setSettings(settingsRes.data);
      }
      setTotalItems(response.pagination.total);
      setTotalPages(response.pagination.total_pages);

      // Handle edge case: User is on a page that no longer exists after a delete
      if (currentPage > 1 && response.data.length === 0 && response.pagination.total > 0) {
        setPage(currentPage - 1);
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err?.code === 'CANCELED' || err?.message?.includes('canceled')) {
        return; // Ignore cancellation errors
      }
      console.error("Failed to load digital business cards:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (page > 1) {
      params.set("page", page.toString());
    }

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    const currentQuery = searchParams.toString();
    const newQuery = params.toString();

    if (currentQuery !== newQuery) {
      const url = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(url, { scroll: false });
    }
  }, [page, debouncedSearch, pathname, router, searchParams]);

  // Effect for fetching data when page or debounced search changes
  useEffect(() => {
    const abortController = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBusinesses(page, debouncedSearch, abortController.signal);
    
    return () => {
      abortController.abort();
    };
  }, [page, debouncedSearch, fetchBusinesses]);

  // Reset page to 1 when search query changes (handled by debounced search effect but needs page state update)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [debouncedSearch]);

  // Handlers
  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleViewDetails = (business: Business) => {
    window.open(`/digital-cards/view?card=${business.slug || business.id}`, "_blank");
  };

  const handleOpenAdd = () => {
    setEditingBusiness(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (business: Business) => {
    setEditingBusiness(business);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (business: Business) => {
    setBusinessToDelete(business);
    setIsDeleteDialogOpen(true);
  };

  // Submit Create/Edit
  const handleSubmitForm = async (data: BusinessCreateInput) => {
    setIsSubmitting(true);
    try {
      if (editingBusiness) {
        await businessesApi.updateBusiness(editingBusiness.id, data);
        toast.add({ title: "Success", description: "Digital business card updated successfully.", type: "success" });
        setIsFormOpen(false);
        setEditingBusiness(null);

        // Update details view if open with same business
        if (isDetailsOpen && businessToView?.id === editingBusiness.id) {
          setBusinessToView({ ...businessToView, ...data, id: editingBusiness.id, updated_at: new Date().toISOString() });
        }
      } else {
        await businessesApi.createBusiness(data);
        toast.add({ title: "Success", description: "Digital business card created successfully.", type: "success" });
        setIsFormOpen(false);
      }
      fetchBusinesses(page, debouncedSearch);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.add({
        type: "error",
        title: "Error saving digital card",
        description: err?.response?.data?.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Delete
  const handleDeleteConfirm = async () => {
    if (!businessToDelete) return;
    setIsDeleting(true);
    try {
      await businessesApi.deleteBusiness(businessToDelete.id);
      toast.add({ title: "Success", description: "Digital business card deleted successfully.", type: "success" });
      setIsDeleteDialogOpen(false);
      setBusinessToDelete(null);
      
      // Close details if deleted
      if (isDetailsOpen && businessToView?.id === businessToDelete.id) {
        setIsDetailsOpen(false);
        setBusinessToView(null);
      }

      fetchBusinesses(page, debouncedSearch);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.add({
        type: "error",
        title: "Error deleting digital card",
        description: err?.response?.data?.message || "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Toolbar / Header */}
      <DigitalCardsToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={handleOpenAdd}
      />

      {/* Content Area */}
      {isError ? (
        <div className="p-12 text-center border-2 border-dashed border-red-100 rounded-xl bg-red-50/50 flex flex-col items-center">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Unable to load digital business cards.</h3>
          <p className="text-slate-500 mb-6">There was a network or server error.</p>
          <Button variant="outline" onClick={() => fetchBusinesses(page, debouncedSearch)} className="bg-white">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <DigitalCardGrid 
            businesses={businesses}
            settings={settings}
            isLoading={isLoading}
            onView={handleViewDetails}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            isSearchEmpty={!!debouncedSearch}
            onClearSearch={handleClearSearch}
            onAddClick={handleOpenAdd}
          />

          {/* Pagination */}
          {!isLoading && businesses.length > 0 && (
            <ReviewHistoryPagination 
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
              itemType="digital business cards"
            />
          )}
        </div>
      )}

      {/* Modals */}
      <BusinessDetailsDialog 
        business={businessToView}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <BusinessFormDialog 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingBusiness}
        onSubmit={handleSubmitForm}
        isSubmitting={isSubmitting}
      />

      <DeleteBusinessDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        companyName={businessToDelete?.company_name || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default function DigitalCardsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="h-10 w-48 bg-slate-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    }>
      <DigitalCardsContent />
    </Suspense>
  );
}
