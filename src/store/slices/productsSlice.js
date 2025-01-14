// src/store/slices/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  categories:[],
  attributes: [],
  suppliers: [],
  costTypes: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products= action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setAttributes: (state, action) => {
      state.attributes = action.payload;
    },
    setSuppliers: (state, action) => {
        state.suppliers = action.payload;
      },
    setCostTypes: (state, action) => {
        state.costTypes = action.payload;
      },

  }
});

export const { 
  setProducts, 
  setCategories, 
  setAttributes,
  setSuppliers,
  setCostTypes
} = productsSlice.actions;

export const selectProducts = (state) => state.products.products;
export const selectCategories = (state) => state.products.categories;
export const selectAttributes = (state) => state.products.attributes;
export const selectSuppliers = (state) => state.products.suppliers;
export const selectCostTypes = (state) => state.products.costTypes;

export default productsSlice.reducer;