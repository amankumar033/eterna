"use client";

import React, { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/useRedux";
import { setSearchQuery, setStatusFilter } from "@/store/slices/tokenTableSlice";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TokenStatus } from "@/types/token";

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
      dispatch(setSearchQuery(e.target.value));
    },
    [dispatch]
  );

  const handleClearSearch = useCallback(() => {
    dispatch(setSearchQuery(""));
  }, [dispatch]);

  const handleStatusFilter = useCallback(
    (status: TokenStatus | "all") => {
      dispatch(setStatusFilter(status));
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
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
          >
            <X className="h-3.5 w-3.5" />
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
              "transition-all duration-300 ease-out text-xs sm:text-sm h-10 px-4 font-medium cursor-pointer",
              "hover:bg-muted/60 active:bg-muted/80",
              statusFilter === filter.value 
                ? "bg-primary/90 text-primary-foreground shadow-sm" 
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

