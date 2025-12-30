"use client";

import React, { memo, useEffect, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TokenRow } from "./TokenRow";
import { TokenTableSkeleton } from "./TokenTableSkeleton";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { TableHeaderCell } from "./TableHeaderCell";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/useRedux";
import { useTokenData } from "@/hooks/useTokenData";
import { useMockWebSocket } from "@/hooks/useWebSocket";
import { updatePrices, setError } from "@/store/slices/tokenTableSlice";
import type { SortField } from "@/types/token";

/**
 * Token table columns configuration
 */
const COLUMNS = [
  { id: "token", label: "Token", sortable: true, width: "200px", sortField: "symbol" as SortField },
  { id: "price", label: "Price", sortable: true, width: "120px", sortField: "price" as SortField },
  { id: "change", label: "24h Change", sortable: true, width: "120px", sortField: "sharePnL" as SortField },
  { id: "liquidity", label: "Liquidity", sortable: true, width: "140px", sortField: "liquidity" as SortField },
  { id: "volume", label: "Volume 5m", sortable: true, width: "140px", sortField: "volume5m" as SortField },
  { id: "trades", label: "Trades", sortable: true, width: "100px", sortField: "trades" as SortField },
  { id: "status", label: "Status", sortable: false, width: "120px", sortField: null },
  { id: "actions", label: "Actions", sortable: false, width: "100px", sortField: null },
] as const;

interface TokenTableProps {
  className?: string;
}

/**
 * Main token trading table component
 * Displays tokens with real-time price updates, sorting, and filtering
 */
export const TokenTable = memo(function TokenTable({
  className,
}: TokenTableProps) {
  const dispatch = useAppDispatch();
  const { filteredTokens, isLoading, error } = useAppSelector(
    (state) => state.tokenTable
  );
  const { refetch } = useTokenData();

  // Memoize the price update callback to prevent infinite loops
  const handlePriceUpdate = useCallback(
    (updates: Record<string, { price: number; previousPrice: number }>) => {
      try {
        dispatch(updatePrices(updates));
      } catch (err) {
        console.error("Error updating prices:", err);
      }
    },
    [dispatch]
  );

  // Set up WebSocket for real-time price updates
  useMockWebSocket(handlePriceUpdate, true);

  // Clear error after 5 seconds if it exists - use ref to prevent loops
  const errorClearedRef = useRef(false);
  useEffect(() => {
    if (error && !errorClearedRef.current) {
      errorClearedRef.current = true;
      const timer = setTimeout(() => {
        dispatch(setError(null));
        errorClearedRef.current = false;
      }, 5000);
      return () => {
        clearTimeout(timer);
        errorClearedRef.current = false;
      };
    } else if (!error) {
      errorClearedRef.current = false;
    }
  }, [error, dispatch]);


  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-destructive/20 p-3">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Failed to load tokens</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {error}
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="default"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="rounded-lg border border-border/30 bg-card shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/30">
                {COLUMNS.map((column) => (
                  <TableHeaderCell
                    key={column.id}
                    column={column}
                  />
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TokenTableSkeleton rows={10} columns={COLUMNS.length} />
              ) : filteredTokens.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="text-center py-12"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-full bg-muted">
                        <svg
                          className="h-6 w-6 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">No tokens found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTokens.map((token, index) => (
                  <TokenRow key={token.id} token={token} columns={COLUMNS} index={index} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
});

