import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inventory: [],
  loading: false,
  error: null
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // Fetch inventory
    fetchInventoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInventorySuccess: (state, action) => {
      state.inventory = action.payload;
      state.loading = false;
    },
    fetchInventoryFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchInventoryStart,
  fetchInventorySuccess,
  fetchInventoryFailed
} = inventorySlice.actions;

// Selectors
export const selectInventory = state => state.inventory.inventory;
export const selectInventoryLoading = state => state.inventory.loading;
export const selectInventoryError = state => state.inventory.error;

export default inventorySlice.reducer;