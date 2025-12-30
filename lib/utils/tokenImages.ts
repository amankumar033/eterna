/**
 * Token image mapping
 * Maps token symbols to local image paths
 */
export const TOKEN_IMAGES: Record<string, string> = {
  btc: "/tokens/btc.png",
  eth: "/tokens/eth.png",
  sol: "/tokens/sol.png",
  usdc: "/tokens/usdc.png",
  doge: "/tokens/doge.png",
  ada: "/tokens/ada.png",
  dot: "/tokens/dot.png",
  link: "/tokens/link.png",
  uni: "/tokens/uni.png",
  aave: "/tokens/aave.png",
};

/**
 * Get token image URL
 * Falls back to a default image if not found
 */
export function getTokenImage(symbol: string): string {
  const lowerSymbol = symbol.toLowerCase();
  return TOKEN_IMAGES[lowerSymbol] || `/tokens/default.png`;
}

