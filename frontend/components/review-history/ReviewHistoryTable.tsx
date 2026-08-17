import { Business } from "@/types/business";
import { ApplicationSettings } from "@/types/settings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Pencil, Trash2, Star, Copy } from "lucide-react";

interface ReviewHistoryTableProps {
  businesses: Business[];
  settings?: ApplicationSettings | null;
  isLoading: boolean;
  onView: (b: Business) => void;
  onEdit: (b: Business) => void;
  onDelete: (b: Business) => void;
  onCopyLink: (url: string) => void;
}

export function ReviewHistoryTable({
  businesses,
  settings,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onCopyLink,
}: ReviewHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (businesses.length === 0) return null;

  const showGoogleReview = settings ? settings.show_google_review_button : true;

  return (
    <div className="w-full">
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {businesses.map((b) => (
          <div key={b.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 line-clamp-1 break-words">{b.company_name}</h3>
              <p className="text-sm text-slate-500 font-medium line-clamp-2 mt-0.5">{b.services_products}</p>
            </div>
            
            <div className="space-y-1 text-sm text-slate-600">
              <p className="truncate"><span className="font-medium text-slate-700">Loc:</span> {b.location || b.address || "—"}</p>
              <p className="truncate"><span className="font-medium text-slate-700">Contact:</span> {b.email || b.call_number || b.whatsapp_number || "—"}</p>
            </div>

            {b.google_review_url && showGoogleReview && (
              <div className="flex gap-2">
                <a
                  href={b.google_review_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 h-9 px-3 rounded-md transition-colors text-sm shadow-sm"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  Google Review
                </a>
                <Button variant="outline" size="sm" className="h-9 px-3" onClick={() => onCopyLink(b.google_review_url)} aria-label="Copy Google Review URL">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <div className="flex gap-2 pt-1 border-t border-slate-100">
              <Button variant="ghost" size="sm" className="flex-1 h-9 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100" onClick={() => onView(b)}>
                <Eye className="w-4 h-4 mr-1.5" /> View
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 h-9 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100" onClick={() => onEdit(b)}>
                <Pencil className="w-4 h-4 mr-1.5" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 h-9 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100" onClick={() => onDelete(b)}>
                <Trash2 className="w-4 h-4 mr-1.5" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Location / Contact</th>
              <th className="px-4 py-3 text-center">Google Review</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {businesses.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 max-w-[250px]">
                  <p className="font-semibold text-slate-900 truncate">{b.company_name}</p>
                  <p className="text-slate-500 truncate text-xs">{b.services_products}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-slate-700 truncate max-w-[200px]">{b.location || b.address || "—"}</p>
                  <p className="text-slate-500 truncate text-xs">
                    {b.email || b.call_number || b.whatsapp_number || b.website || "—"}
                  </p>
                </td>
                <td className="px-4 py-3 text-center">
                  {b.google_review_url && showGoogleReview ? (
                    <div className="flex items-center justify-center gap-1">
                      <a
                        href={b.google_review_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-amber-500 hover:text-amber-600 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md transition-colors"
                        title="Give 5-Star Google Review"
                        aria-label={`Google Review for ${b.company_name}`}
                      >
                        <Star className="w-4 h-4 fill-amber-500" />
                      </a>
                      <button
                        onClick={() => onCopyLink(b.google_review_url)}
                        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="Copy Link"
                        aria-label="Copy Google Review URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">None</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900" onClick={() => onView(b)} title="View Details" aria-label={`View details for ${b.company_name}`}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-500 hover:text-indigo-700" onClick={() => onEdit(b)} title="Edit Business" aria-label={`Edit ${b.company_name}`}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(b)} title="Delete Business" aria-label={`Delete ${b.company_name}`}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
