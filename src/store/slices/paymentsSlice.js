import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
  stats: null,
  filters: {
    searchTerm: '',
    paymentMethodFilter: 'all',
    statusFilter: 'all',
    startDate: new Date().toISOString().split('T')[0], // Today's date as YYYY-MM-DD
    endDate: new Date().toISOString().split('T')[0]    // Today's date as YYYY-MM-DD
  }
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    // Fetch payments actions
    fetchPaymentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPaymentsSuccess: (state, action) => {
      state.payments = action.payload;
      state.loading = false;
    },
    fetchPaymentsFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create payment actions
    createPaymentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPaymentSuccess: (state, action) => {
      state.currentPayment = action.payload;
      state.loading = false;
    },
    createPaymentFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update payment actions
    updatePaymentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePaymentSuccess: (state, action) => {
      const index = state.payments.findIndex(payment => payment.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
      state.currentPayment = action.payload;
      state.loading = false;
    },
    updatePaymentFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set current payment
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },

    // Filter actions
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setPaymentMethodFilter: (state, action) => {
      state.filters.paymentMethodFilter = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
    },
    setDateRange: (state, action) => {
      state.filters.startDate = action.payload.startDate;
      state.filters.endDate = action.payload.endDate;
    },
    resetFilters: (state) => {
      state.filters = {
        searchTerm: '',
        paymentMethodFilter: 'all',
        statusFilter: 'all',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      };
    },

    // Stats actions
    fetchStatsSuccess: (state, action) => {
      state.stats = action.payload;
    }
  }
});

// Export actions
export const {
  fetchPaymentsStart,
  fetchPaymentsSuccess,
  fetchPaymentsFailed,
  createPaymentStart,
  createPaymentSuccess,
  createPaymentFailed,
  updatePaymentStart,
  updatePaymentSuccess,
  updatePaymentFailed,
  setCurrentPayment,
  clearCurrentPayment,
  setSearchTerm,
  setPaymentMethodFilter,
  setStatusFilter,
  setDateRange,
  resetFilters,
  fetchStatsSuccess
} = paymentsSlice.actions;

// Selectors
export const selectPayments = state => state.payments.payments;
export const selectCurrentPayment = state => state.payments.currentPayment;
export const selectPaymentsLoading = state => state.payments.loading;
export const selectPaymentsError = state => state.payments.error;
export const selectPaymentsFilters = state => state.payments.filters;
export const selectPaymentsStats = state => state.payments.stats;

export default paymentsSlice.reducer;