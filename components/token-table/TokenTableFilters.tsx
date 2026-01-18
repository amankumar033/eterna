"use client";

import React, { memo, useCallback, startTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/useRedux";
import { setSearchQuery, setStatusFilter } from "@/store/slices/tokenTableSlice";
import { cn } from "@/lib/utils";
import type { TokenStatus } from "@/types/token";

// Lazy load icons to reduce initial bundle
const Search = React.lazy(() => import("lucide-react").then((mod) => ({ default: mod.Search })));
const X = React.lazy(() => import("lucide-react").then((mod) => ({ default: mod.X })));

/**
 * Filter component for token table
 * Provides search and status filtering
 */
export const TokenTableFilters = memo(function TokenTableFilters() {
  const dispatch = useAppDispatch();
  const { searchQuery, statusFilter } = useAppSelector(
    (state) => state.tokenTable
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Use startTransition for non-urgent filter updates
      startTransition(() => {
        dispatch(setSearchQuery(e.target.value));
      });
    },
    [dispatch]
  );

  const handleClearSearch = useCallback(() => {
    startTransition(() => {
      dispatch(setSearchQuery(""));
    });
  }, [dispatch]);

  const handleStatusFilter = useCallback(
    (status: TokenStatus | "all") => {
      startTransition(() => {
        dispatch(setStatusFilter(status));
      });
    },
    [dispatch]
  );

  const statusFilters: Array<{ value: TokenStatus | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "new", label: "New Pairs" },
    { value: "final-stretch", label: "Final Stretch" },
    { value: "migrated", label: "Migrated" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <React.Suspense fallback={<div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-muted/20 rounded animate-pulse" />}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        </React.Suspense>
        <Input
          type="text"
          placeholder="Search tokens, symbols, or addresses..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10 text-sm h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all cursor-text"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-muted/60 cursor-pointer transition-all duration-300 ease-out"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <React.Suspense fallback={<div className="h-3.5 w-3.5 bg-muted/20 rounded animate-pulse" />}>
              <X className="h-3.5 w-3.5" />
            </React.Suspense>
          </Button>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={statusFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleStatusFilter(filter.value)}
            className={cn(
              "transition-colors duration-300 ease-out text-xs sm:text-sm h-10 px-4 font-medium cursor-pointer will-change-transform",
              "hover:scale-105 hover:shadow-md hover:-translate-y-0.5 hover:bg-white hover:text-gray-800 active:scale-100 active:translate-y-0",
              statusFilter === filter.value 
                ? "bg-white dark:bg-white text-gray-800 dark:text-gray-800 shadow-md font-semibold" 
                : "bg-background border-border/40 hover:border-border/60"
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
});

