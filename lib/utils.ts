import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with commas and optional decimals
 */
export function formatNumber(
  value: number,
  options?: { decimals?: number; compact?: boolean }
): string {
  const { decimals = 2, compact = false } = options || {};

  if (compact && value >= 1000) {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(decimals)}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(decimals)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(decimals)}K`;
    }
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format currency value
 */
export function formatCurrency(
  value: number,
  options?: { symbol?: string; decimals?: number }
): string {
  const { symbol = "$", decimals = 2 } = options || {};
  return `${symbol}${formatNumber(value, { decimals, compact: true })}`;
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}


