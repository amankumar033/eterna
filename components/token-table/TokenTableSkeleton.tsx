"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TokenTableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * Skeleton loading component for token table
 * Provides shimmer effect and progressive loading states
 */
export function TokenTableSkeleton({
  rows = 10,
  columns = 8,
  className,
}: TokenTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className={className}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton
                className={cn(
                  "h-4 w-full",
                  colIndex === 0 && "h-10 w-32", // Token column
                  colIndex === 1 && "h-6 w-20", // Price column
                  colIndex === columns - 1 && "h-8 w-16" // Actions column
                )}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

