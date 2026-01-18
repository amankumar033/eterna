"use client";

import React, { memo, useState } from "react";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ExternalLink } from "lucide-react";
import { formatCurrency, formatNumber, calculatePercentageChange } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TokenImage } from "./TokenImage";
import type { Token } from "@/types/token";

interface TokenCellProps {
  token: Token;
  columnId: string;
}

/**
 * Individual table cell component with various interaction patterns
 * Supports tooltips, popovers, modals, and sorting
 */
export const TokenCell = memo(function TokenCell({
  token,
  columnId,
}: TokenCellProps) {
  const [priceChangeColor, setPriceChangeColor] = useState<"green" | "red" | "neutral">("neutral");

  // Calculate price change
  const priceChange = calculatePercentageChange(token.price, token.previousPrice);
  const isPositive = priceChange > 0;
  const isNegative = priceChange < 0;

  // Update color based on price change (for smooth transitions)
  React.useEffect(() => {
    if (isPositive) {
      setPriceChangeColor("green");
    } else if (isNegative) {
      setPriceChangeColor("red");
    } else {
      setPriceChangeColor("neutral");
    }
  }, [isPositive, isNegative]);

  const renderCellContent = () => {
    switch (columnId) {
      case "token":
        return (
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-[120px] sm:min-w-[150px] group/token">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 transition-transform duration-200 group-hover/token:scale-105 will-change-transform">
              <TokenImage symbol={token.symbol} size={40} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm sm:text-base truncate text-foreground group-hover:text-primary/80 transition-colors duration-200">
                {token.symbol}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground truncate hidden sm:block">
                {token.name}
              </span>
            </div>
          </div>
        );

      case "price":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "font-mono font-medium text-sm sm:text-base transition-colors duration-200 px-2 py-1 rounded",
                    priceChangeColor === "green" && "text-green-600 dark:text-green-400",
                    priceChangeColor === "red" && "text-red-600 dark:text-red-400",
                    priceChangeColor === "neutral" && "text-foreground"
                  )}
                >
                  {formatCurrency(token.price, { symbol: "$", decimals: 2 })}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border">
                <p className="font-mono text-sm">
                  Previous: {formatCurrency(token.previousPrice, { symbol: "$", decimals: 6 })}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

      case "change":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "font-mono font-medium text-sm sm:text-base px-2 py-1 rounded transition-all duration-300 ease-out hover:bg-muted/40 cursor-pointer",
                  isPositive && "text-green-600 dark:text-green-400",
                  isNegative && "text-red-600 dark:text-red-400",
                  !isPositive && !isNegative && "text-muted-foreground"
                )}
                aria-label={`24h price change: ${isPositive ? "+" : ""}${priceChange.toFixed(2)}%`}
              >
                {isPositive ? "+" : ""}
                {priceChange.toFixed(2)}%
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 bg-popover border border-border shadow-xl">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm border-b border-border pb-2">Price Change Details</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current:</span>
                    <span className="font-mono font-semibold">{formatCurrency(token.price, { symbol: "$", decimals: 6 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Previous:</span>
                    <span className="font-mono">{formatCurrency(token.previousPrice, { symbol: "$", decimals: 6 })}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-muted-foreground">Change:</span>
                    <span className={cn(
                      "font-mono font-semibold",
                      isPositive && "text-green-500",
                      isNegative && "text-red-500"
                    )}>
                      {isPositive ? "+" : ""}
                      {priceChange.toFixed(4)}%
                    </span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );

      case "liquidity":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-mono text-sm">
                  {formatCurrency(token.liquidity, { symbol: "$", decimals: 0 })}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border">
                <p className="text-sm">Total Liquidity: {formatNumber(token.liquidity, { decimals: 2 })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

      case "volume":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "font-mono text-sm transition-transform duration-300 hover:underline cursor-pointer",
                  "hover:scale-105 active:scale-95 will-change-transform"
                )}
                aria-label={`5 minute volume: ${formatCurrency(token.volume5m, { symbol: "$", decimals: 0 })}`}
              >
                {formatCurrency(token.volume5m, { symbol: "$", decimals: 0 })}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 bg-popover border border-border shadow-xl">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm border-b border-border pb-2">Volume Details</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">5m Volume:</span>
                    <span className="font-mono font-semibold">{formatCurrency(token.volume5m)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Buy Volume:</span>
                    <span className="font-mono text-green-500 font-semibold">
                      {formatCurrency(token.buyVolume)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sell Volume:</span>
                    <span className="font-mono text-red-500 font-semibold">
                      {formatCurrency(token.sellVolume)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-muted-foreground">Net Volume:</span>
                    <span
                      className={cn(
                        "font-mono font-semibold",
                        token.netVolume > 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {formatCurrency(token.netVolume)}
                    </span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );

      case "trades":
        return (
          <span className="font-mono text-sm">
            {formatNumber(token.trades, { decimals: 0 })}
          </span>
        );

      case "status":
        const statusConfig = {
          new: { 
            label: "New Pairs", 
            className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
            icon: "✨"
          },
          "final-stretch": { 
            label: "Final Stretch", 
            className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
            icon: "⚡"
          },
          migrated: { 
            label: "Migrated", 
            className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
            icon: "🚀"
          },
        };
        const config = statusConfig[token.status];
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-all duration-200",
              config.className
            )}
          >
            <span>{config.icon}</span>
            {config.label}
          </span>
        );

      case "actions":
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      window.open(
                        `https://solscan.io/token/${token.contractAddress}`,
                        "_blank"
                      );
                    }}
                    className="h-8 w-8 p-0 hover:bg-muted/60 hover:text-primary transition-all duration-300 ease-out cursor-pointer"
                    aria-label={`View ${token.symbol} on Solscan`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-popover border border-border">
                  <p className="text-sm">View on Solscan</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TableCell>
      <div className="flex items-center gap-2">
        <div className="flex-1">{renderCellContent()}</div>
      </div>
    </TableCell>
  );
});

