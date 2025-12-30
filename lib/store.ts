"use client";

import { configureStore } from "@reduxjs/toolkit";
import tokenTableReducer from "@/store/slices/tokenTableSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      tokenTable: tokenTableReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["tokenTable/updatePrices"],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


