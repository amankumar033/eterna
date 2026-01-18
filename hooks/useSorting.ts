"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/useRedux";
import { setSortState } from "@/store/slices/tokenTableSlice";
import type { SortField, SortDirection } from "@/types/token";

/**
 * Hook for managing table sorting
 */
export function useSorting() {
  const dispatch = useAppDispatch();
  const { sortState } = useAppSelector((state) => state.tokenTable);

  const handleSort = useCallback(
    (field: SortField) => {
      let direction: SortDirection = "asc";

      // If clicking the same field, toggle direction
      if (sortState.field === field) {
        if (sortState.direction === "asc") {
          direction = "desc";
        } else if (sortState.direction === "desc") {
          direction = null;
          field = null;
        } else {
          direction = "asc";
        }
      }

      dispatch(setSortState({ field, direction }));
    },
    [dispatch, sortState]
  );

  const getSortDirection = useCallback(
    (field: SortField): SortDirection => {
      if (sortState.field === field) {
        return sortState.direction;
      }
      return null;
    },
    [sortState]
  );

  return {
    sortState,
    handleSort,
    getSortDirection,
  };
}



