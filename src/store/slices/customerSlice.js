import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  currentCustomer: null,
  loading: false,
  error: null,
  customerSales: [],
  customerSalesLoading: false,
  customerSalesError: null,
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    // Fetch customers
    fetchCustomersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCustomersSuccess: (state, action) => {
      state.customers = action.payload;
      state.loading = false;
    },
    fetchCustomersFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create customer
    createCustomerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createCustomerSuccess: (state, action) => {
      state.customers.push(action.payload);
      state.loading = false;
    },
    createCustomerFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update customer
    updateCustomerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCustomerSuccess: (state, action) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
      state.loading = false;
    },
    updateCustomerFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete customer
    deleteCustomerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteCustomerSuccess: (state, action) => {
      state.customers = state.customers.filter(customer => customer.id !== action.payload);
      state.loading = false;
    },
    deleteCustomerFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set current customer
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = action.payload;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },

    // Fetch customer sales history
    fetchCustomerSalesStart: (state) => {
      state.customerSalesLoading = true;
      state.customerSalesError = null;
    },
    fetchCustomerSalesSuccess: (state, action) => {
      state.customerSales = action.payload;
      state.customerSalesLoading = false;
    },
    fetchCustomerSalesFailed: (state, action) => {
      state.customerSalesLoading = false;
      state.customerSalesError = action.payload;
    },
  }
});

// Export actions
export const {
  fetchCustomersStart,
  fetchCustomersSuccess,
  fetchCustomersFailed,
  createCustomerStart,
  createCustomerSuccess,
  createCustomerFailed,
  updateCustomerStart,
  updateCustomerSuccess,
  updateCustomerFailed,
  deleteCustomerStart,
  deleteCustomerSuccess,
  deleteCustomerFailed,
  setCurrentCustomer,
  clearCurrentCustomer,
  fetchCustomerSalesStart,
  fetchCustomerSalesSuccess,
  fetchCustomerSalesFailed
} = customerSlice.actions;

// Selectors
export const selectCustomers = state => state.customers.customers;
export const selectCurrentCustomer = state => state.customers.currentCustomer;
export const selectCustomersLoading = state => state.customers.loading;
export const selectCustomersError = state => state.customers.error;
export const selectCustomerSales = state => state.customers.customerSales;
export const selectCustomerSalesLoading = state => state.customers.customerSalesLoading;
export const selectCustomerSalesError = state => state.customers.customerSalesError;

export default customerSlice.reducer;