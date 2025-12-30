/**
 * Token data types for the trading table
 */

export type TokenStatus = "new" | "final-stretch" | "migrated";

export interface Token {
  id: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  price: number;
  previousPrice: number;
  liquidity: number;
  supply: number;
  sharePnL: number;
  trades: number;
  volume5m: number;
  buyVolume: number;
  sellVolume: number;
  netVolume: number;
  status: TokenStatus;
  contractAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenTableColumn {
  id: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export type SortDirection = "asc" | "desc" | null;
export type SortField = keyof Token | null;

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export interface TokenTableState {
  tokens: Token[];
  filteredTokens: Token[];
  sortState: SortState;
  searchQuery: string;
  statusFilter: TokenStatus | "all";
  isLoading: boolean;
  error: string | null;
}


