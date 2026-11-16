"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useApiQuery } from "@/hooks";

type SearchItem = { _id: string; label: string; sub?: string };

export function SearchSelect({
  label,
  value,
  onSelect,
  fetchUrl,
  queryKey,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onSelect: (item: SearchItem) => void;
  fetchUrl: string;
  queryKey: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const ref = useRef<HTMLDivElement>(null);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchParams: Record<string, string> = debouncedQuery
    ? { search: debouncedQuery, limit: "10" }
    : { limit: "10" };

  const { data, isLoading } = useApiQuery({
    key: [...queryKey, debouncedQuery],
    endpoint: fetchUrl,
    method: "GET",
    queryParams: searchParams,
    options: {
      enabled: open, // Only fetch when dropdown is open
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  });

  const results: SearchItem[] = data?.items ?? data?.rows ?? [];

  return (
    <div ref={ref} className="relative w-full">
      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
        }}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-border focus:ring-primary"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {open && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-3 py-2 text-xs text-slate-400">Searching…</div>
          ) : results.length > 0 ? (
            results.map((r) => (
              <button
                key={r._id}
                type="button"
                onClick={() => {
                  onSelect(r);
                  setQuery(r.label);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 hover:bg-muted text-sm flex items-center gap-2 border-b border-muted transition-colors last:border-0"
              >
                <div>
                  <div className="font-medium text-slate-800">{r.label}</div>
                  {r.sub && (
                    <div className="text-xs text-slate-400">{r.sub}</div>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-slate-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
