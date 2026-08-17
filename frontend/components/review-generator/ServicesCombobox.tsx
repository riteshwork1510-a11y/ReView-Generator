"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Check, ChevronDown, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServicesComboboxProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const POPULAR_SERVICES_PRODUCTS = [
  "IT Services",
  "Software Development",
  "Web Development",
  "Digital Marketing",
  "Consulting",
  "Textile Trading",
  "Clothing & Apparel",
  "Real Estate",
  "Financial Services",
  "Accounting & Tax Services",
  "Legal Services",
  "Medical & Healthcare",
  "Clinic & Dental",
  "Cafe & Restaurant",
  "Food & Beverage",
  "Bakery & Confectionery",
  "Education & Coaching",
  "Gym & Fitness",
  "Beauty Salon & Spa",
  "Event Management",
  "Photography & Videography",
  "Interior Design",
  "Architecture & Construction",
  "Logistics & Transport",
  "E-commerce",
  "Retail Store",
  "Wholesale Trading",
  "Automobile Service",
  "Hotel & Hospitality",
  "Jewelry Store",
  "Manufacturing",
  "Graphic Design",
  "Public Relations",
  "Human Resources",
  "Cybersecurity",
  "Cloud Computing",
  "Agriculture & Farming",
  "Landscaping & Gardening",
  "Cleaning Services",
  "Pest Control",
  "Plumbing & Electrical",
  "Furniture & Home Decor",
  "Pet Care & Veterinary",
  "Travel & Tourism",
  "Insurance Agency",
  "Printing & Publishing",
  "Handicrafts & Artisans",
  "Pharmacy & Medical Supplies",
  "Entertainment & Media",
  "Waste Management",
  "Renewable Energy"
];


export function ServicesCombobox({ value = "", onChange, error }: ServicesComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync searchQuery when value changes (e.g. initial load or form reset)
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery(value);
    }
  }, [value, isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset query to the selected value if closed
        setSearchQuery(value);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    // If query is empty OR it matches the selected value exactly, show all options
    if (!query || query === value.toLowerCase()) {
      return POPULAR_SERVICES_PRODUCTS;
    }
    return POPULAR_SERVICES_PRODUCTS.filter((opt) =>
      opt.toLowerCase().includes(query)
    );
  }, [searchQuery, value]);

  // Check if search query matches exactly any existing option or the active value
  const isQueryExactMatch = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const inPopularList = POPULAR_SERVICES_PRODUCTS.some(
      (opt) => opt.toLowerCase() === query
    );
    return inPopularList || value.toLowerCase() === query;
  }, [searchQuery, value]);

  const handleSelectOption = (option: string) => {
    const trimmedOption = option.trim();
    onChange(trimmedOption);
    setSearchQuery(trimmedOption);
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      const limit = filteredOptions.length + (!isQueryExactMatch ? 1 : 0);
      setFocusedIndex((prev) => (prev + 1 >= limit ? 0 : prev + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
      const limit = filteredOptions.length + (!isQueryExactMatch ? 1 : 0);
      setFocusedIndex((prev) => (prev - 1 < 0 ? limit - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      if (focusedIndex >= 0) {
        if (focusedIndex < filteredOptions.length) {
          handleSelectOption(filteredOptions[focusedIndex]);
        } else if (!isQueryExactMatch) {
          handleSelectOption(searchQuery);
        }
      } else if (searchQuery.trim()) {
        handleSelectOption(searchQuery);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery(value);
      setFocusedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      inputRef.current?.focus();
      setSearchQuery(value);
      setTimeout(() => {
        inputRef.current?.select();
      }, 50);
    } else {
      setSearchQuery(value);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchQuery(value);
    setTimeout(() => {
      inputRef.current?.select();
    }, 50);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={cn(
          "flex items-center justify-between h-[42px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500",
          error && "border-red-500 focus-within:ring-red-500 focus-within:border-red-500"
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : value}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            setFocusedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder="Search or select a service/product..."
          className="flex-1 bg-transparent border-0 p-0 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none focus:border-0"
        />

        <div className="flex items-center gap-1.5 ml-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear selection</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleDropdown}
            className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", isOpen && "transform rotate-180")}
            />
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto p-1 animate-in fade-in slide-in-from-top-1 duration-200 ease-out focus:outline-none">
          {/* Preset / Filtered Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, idx) => {
              const isSelected = value.toLowerCase() === option.toLowerCase();
              const isKeyboardFocused = idx === focusedIndex;
              return (
                <div
                  key={option}
                  onMouseDown={(e) => e.preventDefault()} // Prevent input blur before click
                  onClick={() => handleSelectOption(option)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-all cursor-pointer",
                    isSelected ? "bg-indigo-50/60 font-semibold text-indigo-700 hover:bg-indigo-50" : "text-slate-700 hover:bg-slate-50",
                    isKeyboardFocused && "bg-slate-100 text-slate-900"
                  )}
                >
                  <span>{option}</span>
                  {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                </div>
              );
            })
          ) : null}

          {/* "+ Add custom item" action */}
          {!isQueryExactMatch && searchQuery.trim() !== "" && (
            <div
              onMouseDown={(e) => e.preventDefault()} // Prevent input blur before click
              onClick={() => handleSelectOption(searchQuery)}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50/50 rounded-md cursor-pointer border-t border-slate-50 mt-1 font-medium",
                focusedIndex === filteredOptions.length && "bg-indigo-50 text-indigo-800"
              )}
            >
              <Plus className="h-4 w-4" />
              <span>Use custom: &quot;{searchQuery}&quot;</span>
            </div>
          )}

          {/* Empty state when no matches and query is empty */}
          {filteredOptions.length === 0 && searchQuery.trim() === "" && (
            <div className="px-3 py-3 text-center text-xs text-slate-500">
              No options available. Type to use a custom service.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
