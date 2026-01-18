"use client";

import React, { Suspense, startTransition } from "react";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { TokenTableSkeleton } from "@/components/token-table/TokenTableSkeleton";

// Lazy-load all heavy components to reduce initial bundle
const TokenTable = dynamic(
  () => import("@/components/token-table/TokenTable").then((mod) => ({ default: mod.TokenTable })),
  {
    ssr: false,
    loading: () => <TokenTableSkeleton rows={10} columns={8} />,
  }
);

const TokenTableFilters = dynamic(
  () => import("@/components/token-table/TokenTableFilters").then((mod) => ({ default: mod.TokenTableFilters })),
  {
    ssr: false,
    loading: () => <div className="h-16 animate-pulse bg-muted/20 rounded-lg" />,
  }
);

const TrendingUp = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.TrendingUp })),
  {
    ssr: false,
    loading: () => <div className="h-5 w-5 bg-muted/20 rounded animate-pulse" />,
  }
);

/**
 * Pulse page - Token discovery table
 * Displays all token columns: New pairs, Final Stretch, Migrated
 * Responsive down to 320px width
 */
export default function PulsePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-3 sm:px-6 py-6 sm:py-10 max-w-[1600px]">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  Token Discovery
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Discover and track the latest tokens with real-time price updates
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <ErrorBoundary>
            <TokenTableFilters />
          </ErrorBoundary>

          {/* Token Table */}
          <ErrorBoundary>
            <Suspense fallback={<TokenTableSkeleton rows={10} columns={8} />}>
              <TokenTable className="w-full" />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

