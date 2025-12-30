"use client";

import React, { memo } from "react";
import { TableRow } from "@/components/ui/table";
import { TokenCell } from "./TokenCell";
import { cn } from "@/lib/utils";
import type { Token } from "@/types/token";

interface TokenRowProps {
  token: Token;
  columns: readonly {
    id: string;
    label: string;
    sortable: boolean;
    width?: string;
    sortField?: any;
  }[];
  index?: number;
}

/**
 * Individual token row component
 * Memoized for performance optimization
 */
export const TokenRow = memo(function TokenRow({
  token,
  columns,
  index = 0,
}: TokenRowProps) {
  return (
    <TableRow 
      className={cn(
        "group border-b border-border/20 transition-all duration-200 ease-out",
        "hover:bg-muted/30 hover:border-border/40",
        "animate-fade-in",
        index % 2 === 0 && "bg-muted/5"
      )}
      style={{ animationDelay: `${(index || 0) * 15}ms` }}
    >
      {columns.map((column) => (
        <TokenCell
          key={column.id}
          token={token}
          columnId={column.id}
        />
      ))}
    </TableRow>
  );
});

