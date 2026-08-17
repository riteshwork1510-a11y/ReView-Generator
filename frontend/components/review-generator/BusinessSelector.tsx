import { Business } from "@/types/business";

interface BusinessSelectorProps {
  businesses: Business[];
  selectedBusinessId: string;
  onChange: (id: string) => void;
}

export function BusinessSelector({
  businesses,
  selectedBusinessId,
  onChange,
}: BusinessSelectorProps) {
  return (
    <div className="space-y-2 max-w-md w-full">
      <label 
        htmlFor="business-select" 
        className="block text-sm font-semibold text-slate-700 uppercase tracking-wider"
      >
        Select a Digital Business Card
      </label>
      <div className="relative">
        <select
          id="business-select"
          value={selectedBusinessId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm appearance-none cursor-pointer"
        >
          <option value="">Select Business ▼</option>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>
              {b.company_name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
