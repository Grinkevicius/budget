import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import { getTransactions } from '@/app/actions/getTransactions';
import { updateTransaction } from '@/app/actions/updateTransaction';
import {addTransaction} from "@/app/actions/addTransaction";

export interface Transaction {
    referencecode: string;
    description: string;
    amount: number;
    transaction_date: string;
    category_code: string;
    is_recurring: boolean;
    note: string;
}

interface TransactionsList {
    items: Transaction[];
    loading: boolean;
    error: string | null;
}

interface TransactionsState {
    transactions: {
        [key: string]: TransactionsList;
    };
    reloadFlags: {
        [key: string]: boolean;
    };
}

const initialState: TransactionsState = {
    transactions: {},
    reloadFlags: {}
};


export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async ({ userId, year, month, category_code }: {
        userId: string;
        year: number;
        month: number;
        category_code: string;
    }) => {
        const response = await getTransactions(userId, year, month, category_code);
        return {
            data: response,
            category_code: category_code,
        };
    }
);

export const updateTransactionThunk = createAsyncThunk(
    'transactions/updateTransaction',
    async ({ data, categoryCode }: { 
        data: Transaction,
        categoryCode: string 
    }) => {
        const response = await updateTransaction(data);
        return {
            transaction: response,
            categoryCode
        };
    }
);

export const addTransactionThunk = createAsyncThunk(
    'transactions/addTransaction',
    async (data: {
        userId: string;
        budgetCode: string;
        category: string;
        description: string;
        amount: number;
        transaction_date: string;
        is_recurring: boolean;
    }) => {
        const response = await addTransaction(data);
        return {
            transaction: response,
            categoryCode: data.category
        };
    }
);

// In transactionsSlice.ts
const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        // ... existing reducers
        clearTransactions: (state) => {
            state.transactions = {};
        },
        setReloadFlag: (state, action: PayloadAction<{ categoryCode: string }>) => {
            state.reloadFlags[action.payload.categoryCode] = !state.reloadFlags[action.payload.categoryCode];
        },
        clearReloadFlag: (state, action: PayloadAction<{ categoryCode: string }>) => {
            state.reloadFlags[action.payload.categoryCode] = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state, action) => {
                const category = action.meta.arg.category_code || 'all';
                state.transactions[category] = state.transactions[category] || {
                    items: [],
                    loading: true,
                    error: null
                };
                state.transactions[category].loading = true;
                state.transactions[category].error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                const category = action.payload.category_code || 'all';
                state.transactions[category] = {
                    items: action.payload.data,
                    loading: false,
                    error: null
                };
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                const category = action.meta.arg.category_code || 'all';
                state.transactions[category] = state.transactions[category] || {
                    items: [],
                    loading: false,
                    error: action.error.message || 'An error occurred'
                };
            })
            .addCase(addTransactionThunk.fulfilled, (state, action) => {
                const { transaction, categoryCode } = action.payload;
                
                if (!state.transactions[categoryCode]) {
                    state.transactions[categoryCode] = {
                        items: [],
                        loading: false,
                        error: null
                    };
                }
                if (!state.transactions['all']) {
                    state.transactions['all'] = {
                        items: [],
                        loading: false,
                        error: null
                    };
                }
                
                state.transactions[categoryCode].items.unshift(transaction);
                
                if (categoryCode !== 'all') {
                    state.transactions['all']?.items.unshift(transaction);
                }
                
            });
    },
});

export const { setReloadFlag, clearReloadFlag, clearTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;