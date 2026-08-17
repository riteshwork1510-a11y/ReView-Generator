import { Business } from "@/types/business";
import { MapPin, Briefcase, Building } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SelectedBusinessSummaryProps {
  business: Business;
}

export function SelectedBusinessSummary({ business }: SelectedBusinessSummaryProps) {
  return (
    <Card className="max-w-md w-full bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden mt-6">
      <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-3.5 px-5">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-indigo-500" />
          Selected Business
        </h4>
      </CardHeader>
      <CardContent className="p-5 space-y-4 text-sm">
        <div className="space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Company Name</div>
          <div className="text-lg font-bold text-slate-900 break-words">{business.company_name}</div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Services / Products</div>
          <div className="flex items-start gap-2 text-slate-700">
            <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <span className="break-words font-medium whitespace-pre-wrap">{business.services_products}</span>
          </div>
        </div>

        {business.location && (
          <div className="space-y-1.5">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Location</div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="break-words font-medium">{business.location}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
