import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Token, TokenTableState, SortField, SortDirection } from "@/types/token";

const initialState: TokenTableState = {
  tokens: [],
  filteredTokens: [],
  sortState: {
    field: null,
    direction: null,
  },
  searchQuery: "",
  statusFilter: "all",
  isLoading: false,
  error: null,
};

const tokenTableSlice = createSlice({
  name: "tokenTable",
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token[]>) => {
      state.tokens = action.payload;
      state.filteredTokens = action.payload;
    },
    updatePrices: (state, action: PayloadAction<Record<string, { price: number; previousPrice: number }>>) => {
      const updates = action.payload;
      let hasChanges = false;
      
      // Update tokens array
      state.tokens = state.tokens.map((token) => {
        const update = updates[token.id];
        if (update && update.price !== token.price) {
          hasChanges = true;
          return {
            ...token,
            previousPrice: token.price,
            price: update.price,
            updatedAt: new Date().toISOString(),
          };
        }
        return token;
      });
      
      // Only update filteredTokens if there were actual changes
      if (hasChanges) {
        // Rebuild filteredTokens from updated tokens to maintain filters/sorting
        applyFilters(state);
      }
    },
    setSortState: (state, action: PayloadAction<{ field: SortField; direction: SortDirection }>) => {
      state.sortState = action.payload;
      // Apply sorting
      const { field, direction } = action.payload;
      if (field && direction) {
        state.filteredTokens = [...state.filteredTokens].sort((a, b) => {
          const aValue = a[field];
          const bValue = b[field];
          if (typeof aValue === "number" && typeof bValue === "number") {
            return direction === "asc" ? aValue - bValue : bValue - aValue;
          }
          if (typeof aValue === "string" && typeof bValue === "string") {
            return direction === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          return 0;
        });
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      applyFilters(state);
    },
    setStatusFilter: (state, action: PayloadAction<Token["status"] | "all">) => {
      state.statusFilter = action.payload;
      applyFilters(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

function applyFilters(state: TokenTableState) {
  let filtered = [...state.tokens];

  // Apply search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (token) =>
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        token.contractAddress.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (state.statusFilter !== "all") {
    filtered = filtered.filter((token) => token.status === state.statusFilter);
  }

  // Apply sorting
  const { field, direction } = state.sortState;
  if (field && direction) {
    filtered = filtered.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }

  state.filteredTokens = filtered;
}

export const {
  setTokens,
  updatePrices,
  setSortState,
  setSearchQuery,
  setStatusFilter,
  setLoading,
  setError,
} = tokenTableSlice.actions;

export default tokenTableSlice.reducer;


