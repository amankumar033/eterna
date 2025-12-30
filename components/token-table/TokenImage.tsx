"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TokenImageProps {
  symbol: string;
  className?: string;
  size?: number;
}

/**
 * Token image component with fallback
 * Generates a colored circle with initial letter if image not found
 */
export function TokenImage({ symbol, className, size = 32 }: TokenImageProps) {
  const [imageError, setImageError] = React.useState(false);
  
  // Use CoinGecko API for real token images
  const getImageUrl = (sym: string) => {
    const symbolMap: Record<string, string> = {
      'BTC': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      'ETH': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      'SOL': 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      'USDC': 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
      'DOGE': 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
      'ADA': 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      'DOT': 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
      'LINK': 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
      'UNI': 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
      'AAVE': 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png',
    };
    return symbolMap[sym.toUpperCase()] || `https://assets.coingecko.com/coins/images/1/large/bitcoin.png`;
  };
  
  const imageUrl = getImageUrl(symbol);
  const initial = symbol.charAt(0).toUpperCase();
  
  // Generate a color based on symbol for consistent fallback
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const colorIndex = symbol.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  if (imageError) {
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm",
          bgColor,
          className
        )}
        style={{ width: size, height: size }}
      >
        {initial}
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-full overflow-hidden flex-shrink-0 ring-1 ring-border/20", className)}>
      <Image
        src={imageUrl}
        alt={symbol}
        width={size}
        height={size}
        className="object-cover transition-transform duration-200 hover:scale-105"
        onError={() => setImageError(true)}
        unoptimized
      />
    </div>
  );
}

