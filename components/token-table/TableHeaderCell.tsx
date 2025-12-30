"use client";

import React, { memo } from "react";
import { TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useSorting } from "@/hooks/useSorting";
import { cn } from "@/lib/utils";
import type { SortField } from "@/types/token";

interface TableHeaderCellProps {
  column: {
    id: string;
    label: string;
    sortable: boolean;
    width?: string;
    sortField: SortField;
  };
}

/**
 * Table header cell with sorting functionality
 */
export const TableHeaderCell = memo(function TableHeaderCell({
  column,
}: TableHeaderCellProps) {
  const { handleSort, getSortDirection } = useSorting();
  const sortDirection = getSortDirection(column.sortField);

  if (!column.sortable) {
    return (
      <TableHead
        className="font-semibold text-muted-foreground text-xs sm:text-sm"
        style={{ width: column.width }}
      >
        <span className="hidden sm:inline">{column.label}</span>
        <span className="sm:hidden">{column.label.split(" ")[0]}</span>
      </TableHead>
    );
  }

  return (
    <TableHead
      className="font-semibold text-muted-foreground text-xs sm:text-sm"
      style={{ width: column.width }}
    >
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-9 -ml-2 hover:bg-muted/50 hover:text-primary text-xs sm:text-sm transition-all duration-300 ease-out cursor-pointer",
          sortDirection && "text-primary bg-muted/30"
        )}
        onClick={() => handleSort(column.sortField)}
      >
        <span className="hidden sm:inline">{column.label}</span>
        <span className="sm:hidden">{column.label.split(" ")[0]}</span>
        {sortDirection === "asc" ? (
          <ArrowUp className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
        ) : sortDirection === "desc" ? (
          <ArrowDown className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
        ) : (
          <ArrowUpDown className="ml-1 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-50" />
        )}
      </Button>
    </TableHead>
  );
});

