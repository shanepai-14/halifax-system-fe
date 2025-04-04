import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productsSlice';
import customerReducer from './slices/customerSlice';
import inventoryReducer from './slices/inventorySlice';
import saleReducer from './slices/salesSlice';
import paymentsReducer from './slices/paymentsSlice';
import pettyCashReducer from './slices/pettyCashSlice';
import employeeReducer from './slices/employeeSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    products:productReducer,
    customers: customerReducer,
    inventory: inventoryReducer,
    sales: saleReducer,
    payments: paymentsReducer,
    pettyCash: pettyCashReducer,
    employees: employeeReducer
  },
});