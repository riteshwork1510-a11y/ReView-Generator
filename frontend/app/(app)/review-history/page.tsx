"use client";

import { History } from "lucide-react";

export default function ReviewHistoryPage() {
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Review History</h1>
        <p className="text-slate-500 mt-1">View generated reviews and review history.</p>
      </div>

      {/* Main empty state container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <History className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-1">No Reviews Yet</h3>
        <p className="text-slate-500 max-w-sm">
          Generated reviews will appear here.
        </p>
      </div>
    </div>
  );
}
