"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/useRedux";
import { setTokens, setLoading, setError } from "@/store/slices/tokenTableSlice";
import { getTokenImage } from "@/lib/utils/tokenImages";
import type { Token } from "@/types/token";

/**
 * Mock token data generator
 */
function generateMockTokens(count = 50): Token[] {
  const statuses: Token["status"][] = ["new", "final-stretch", "migrated"];
  const symbols = ["BTC", "ETH", "SOL", "USDC", "DOGE", "ADA", "DOT", "LINK", "UNI", "AAVE"];

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[i % statuses.length] as Token["status"];
    const baseSymbol = symbols[i % symbols.length];
    const symbol = i < symbols.length ? baseSymbol : `${baseSymbol}${i}`;
    const price = Math.random() * 100;
    const previousPrice = price * (1 + (Math.random() - 0.5) * 0.1);

    return {
      id: `token-${i + 1}`,
      name: `${symbol} Token`,
      symbol,
      imageUrl: getTokenImage(symbol),
      price: Number(price.toFixed(6)),
      previousPrice: Number(previousPrice.toFixed(6)),
      liquidity: Math.random() * 10_000_000,
      supply: Math.random() * 1_000_000_000,
      sharePnL: (Math.random() - 0.5) * 100,
      trades: Math.floor(Math.random() * 10000),
      volume5m: Math.random() * 1_000_000,
      buyVolume: Math.random() * 500_000,
      sellVolume: Math.random() * 500_000,
      netVolume: (Math.random() - 0.5) * 1_000_000,
      status,
      contractAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

/**
 * Fetch token data with React Query
 */
async function fetchTokens(): Promise<Token[]> {
  // Simulate API delay - reduced for faster initial load
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));
  
  // In production, replace with actual API call
  // Reduced initial load to 30 tokens for better performance
  return generateMockTokens(30);
}

/**
 * Hook to fetch and manage token data
 */
export function useTokenData() {
  const dispatch = useAppDispatch();
  const { tokens, isLoading: reduxLoading, error: reduxError } = useAppSelector(
    (state) => state.tokenTable
  );

  const {
    data,
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["tokens"],
    queryFn: fetchTokens,
    staleTime: 30000, // 30 seconds
    refetchInterval: false, // Disable auto-refetch to reduce main-thread work
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Sync with Redux - use refs to prevent infinite loops
  const prevDataRef = React.useRef<Token[] | undefined>(undefined);
  const dataStringRef = React.useRef<string>("");
  
  React.useEffect(() => {
    // Only update if data actually changed (compare by JSON string to avoid reference issues)
    if (data) {
      const dataString = JSON.stringify(data);
      if (dataString !== dataStringRef.current) {
        dataStringRef.current = dataString;
        prevDataRef.current = data;
        dispatch(setTokens(data));
      }
    }
  }, [data, dispatch]);

  const prevLoadingRef = React.useRef<boolean | undefined>(undefined);
  React.useEffect(() => {
    if (queryLoading !== prevLoadingRef.current) {
      prevLoadingRef.current = queryLoading;
      dispatch(setLoading(queryLoading));
    }
  }, [queryLoading, dispatch]);

  const prevErrorRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    const errorMessage = queryError?.message || null;
    if (errorMessage !== prevErrorRef.current) {
      prevErrorRef.current = errorMessage;
      dispatch(setError(errorMessage));
    }
  }, [queryError, dispatch]);

  return {
    tokens: data || tokens,
    isLoading: queryLoading || reduxLoading,
    error: queryError || reduxError,
    refetch,
  };
}

