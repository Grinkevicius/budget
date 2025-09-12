// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './transactionsSlice';

// Creates the Redux store with all reducers
export const store = configureStore({
  reducer: {
    // Each key in this object represents a "slice" of state
    transactions: transactionsReducer, // Handles all transaction-related state
  },
});

// Type definitions for TypeScript
export type RootState = ReturnType<typeof store.getState>; // Type for the entire store state
export type AppDispatch = typeof store.dispatch; // Type for the dispatch function