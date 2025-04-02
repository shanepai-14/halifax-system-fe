import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  funds: [],
  transactions: [],
  stats: null,
  loading: false,
  error: null,
  balance: 0,
  filters: {
    search: '',
    status: 'all',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0], // Today
    employeeId: ''
  }
};

const pettyCashSlice = createSlice({
  name: 'pettyCash',
  initialState,
  reducers: {
    // General actions
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Funds actions
    fetchFundsSuccess: (state, action) => {
      state.funds = action.payload;
      state.loading = false;
    },
    addFundSuccess: (state, action) => {
      state.funds.unshift(action.payload);
      state.loading = false;
    },
    updateFundSuccess: (state, action) => {
      const index = state.funds.findIndex(fund => fund.id === action.payload.id);
      if (index !== -1) {
        state.funds[index] = action.payload;
      }
      state.loading = false;
    },
    
    // Transactions actions
    fetchTransactionsSuccess: (state, action) => {
      state.transactions = action.payload;
      state.loading = false;
    },
    addTransactionSuccess: (state, action) => {
      state.transactions.unshift(action.payload);
      state.loading = false;
    },
    updateTransactionSuccess: (state, action) => {
      const index = state.transactions.findIndex(tx => tx.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
      state.loading = false;
    },
    
    // Stats and balance actions
    fetchStatsSuccess: (state, action) => {
      state.stats = action.payload;
      state.loading = false;
    },
    fetchBalanceSuccess: (state, action) => {
      state.balance = action.payload.available_balance;
      state.loading = false;
    },
    
    // Filter actions
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    setEmployeeFilter: (state, action) => {
      state.filters.employeeId = action.payload;
    },
    setDateRange: (state, action) => {
      state.filters.startDate = action.payload.startDate;
      state.filters.endDate = action.payload.endDate;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: 'all',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        employeeId: ''
      };
    }
  }
});

export const {
  fetchStart,
  fetchFailed,
  fetchFundsSuccess,
  addFundSuccess,
  updateFundSuccess,
  fetchTransactionsSuccess,
  addTransactionSuccess,
  updateTransactionSuccess,
  fetchStatsSuccess,
  fetchBalanceSuccess,
  setSearchFilter,
  setStatusFilter,
  setEmployeeFilter,
  setDateRange,
  resetFilters
} = pettyCashSlice.actions;

// Selectors
export const selectPettyCashFunds = state => state.pettyCash.funds;
export const selectPettyCashTransactions = state => state.pettyCash.transactions;
export const selectPettyCashStats = state => state.pettyCash.stats;
export const selectPettyCashBalance = state => state.pettyCash.balance;
export const selectPettyCashLoading = state => state.pettyCash.loading;
export const selectPettyCashError = state => state.pettyCash.error;
export const selectPettyCashFilters = state => state.pettyCash.filters;

export default pettyCashSlice.reducer;