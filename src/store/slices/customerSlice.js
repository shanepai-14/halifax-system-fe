import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  loading: false,
  error: null,
  singleCustomerLoading: false,
  singleCustomerError: null
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
    }
  }
});

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
  deleteCustomerFailed
} = customerSlice.actions;

// Selectors
export const selectCustomers = state => state.customers.customers;
export const selectCustomersLoading = state => state.customers.loading;
export const selectCustomersError = state => state.customers.error;

export default customerSlice.reducer;