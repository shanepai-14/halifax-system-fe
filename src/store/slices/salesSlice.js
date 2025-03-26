import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sales: [],
  currentSale: null,
  loading: false,
  error: null,
  stats: null,
  filters: {
    searchTerm: '',
    statusFilter: 'all',
    deliveredFilter: 'all',
    startDate: new Date().toISOString().split('T')[0], // Today's date as YYYY-MM-DD
    endDate: new Date().toISOString().split('T')[0]    // Today's date as YYYY-MM-DD
  }
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    // Fetch sales actions
    fetchSalesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSalesSuccess: (state, action) => {
      state.sales = action.payload;
      state.loading = false;
    },
    fetchSalesFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create sale actions
    createSaleStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createSaleSuccess: (state, action) => {
      state.sales.push(action.payload);
      state.currentSale = action.payload;
      state.loading = false;
    },
    createSaleFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update sale actions
    updateSaleStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSaleSuccess: (state, action) => {
      const index = state.sales.findIndex(sale => sale.id === action.payload.id);
      if (index !== -1) {
        state.sales[index] = action.payload;
      }
      state.currentSale = action.payload;
      state.loading = false;
    },
    updateSaleFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set current sale
    setCurrentSale: (state, action) => {
      state.currentSale = action.payload;
    },
    clearCurrentSale: (state) => {
      state.currentSale = null;
    },
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
    },
    setDeliveredFilter: (state, action) => {
      state.filters.deliveredFilter = action.payload;
    },
    setDateRange: (state, action) => {
      state.filters.startDate = action.payload.startDate;
      state.filters.endDate = action.payload.endDate;
    },
    resetFilters: (state) => {
      state.filters = {
        searchTerm: '',
        statusFilter: 'all',
        deliveredFilter: 'all',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      };
    }
  }
});

// Export actions
export const {
  fetchSalesStart,
  fetchSalesSuccess,
  fetchSalesFailed,
  createSaleStart,
  createSaleSuccess,
  createSaleFailed,
  updateSaleStart,
  updateSaleSuccess,
  updateSaleFailed,
  setCurrentSale,
  clearCurrentSale,
  setSearchTerm,
  setStatusFilter,
  setDeliveredFilter,
  setDateRange,
  resetFilters
} = salesSlice.actions;

// Selectors
export const selectSales = state => state.sales.sales;
export const selectCurrentSale = state => state.sales.currentSale;
export const selectSalesLoading = state => state.sales.loading;
export const selectSalesError = state => state.sales.error;
export const selectSalesFilters = state => state.sales.filters;

export default salesSlice.reducer;