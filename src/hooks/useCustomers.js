import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
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
  fetchCustomerSalesStart,
  fetchCustomerSalesSuccess,
  fetchCustomerSalesFailed,
  selectCustomerSales,
  selectCustomerSalesLoading
} from '@/store/slices/customerSlice';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useCustomers = () => {
  const dispatch = useDispatch();
  const customers = useSelector(state => state.customers.customers);
  const isLoading = useSelector(state => state.customers.loading);
  const customerSales = useSelector(selectCustomerSales);
  const isLoadingSales = useSelector(selectCustomerSalesLoading);

  const getAllCustomers = async () => {
    try {
      dispatch(fetchCustomersStart());
      const response = await api.get('/customers');
      dispatch(fetchCustomersSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      dispatch(fetchCustomersFailed(error.message));
      toast.error(error.response?.data?.message || 'Failed to fetch customers');
      throw error;
    }
  };

  const createCustomer = async (customerData) => {
    try {
      dispatch(createCustomerStart());
      const response = await api.post('/customers', customerData);
      dispatch(createCustomerSuccess(response.data.data));
      toast.success('Customer created successfully');
      return response.data.data;
    } catch (error) {
      dispatch(createCustomerFailed(error.message));
      toast.error(error.response?.data?.message || 'Failed to create customer');
      throw error;
    }
  };

  const updateCustomer = async (id, customerData) => {
    try {
      dispatch(updateCustomerStart());
      const response = await api.put(`/customers/${id}`, customerData);
      dispatch(updateCustomerSuccess(response.data.data));
      toast.success('Customer updated successfully');
      return response.data.data;
    } catch (error) {
      dispatch(updateCustomerFailed(error.message));
      toast.error(error.response?.data?.message || 'Failed to update customer');
      throw error;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      dispatch(deleteCustomerStart());
      await api.delete(`/customers/${id}`);
      dispatch(deleteCustomerSuccess(id));
      toast.success('Customer deleted successfully');
    } catch (error) {
      dispatch(deleteCustomerFailed(error.message));
      toast.error(error.response?.data?.message || 'Failed to delete customer');
      throw error;
    }
  };

  // New function to get customer purchase history
  const getCustomerSales = async (customerId) => {
    try {
      dispatch(fetchCustomerSalesStart());
      
      // In a real implementation, you would call your API endpoint
      // For example:
      const response = await api.get('/sales', {
        params: { customer_id: customerId }
      });
      
      dispatch(fetchCustomerSalesSuccess(response.data.data));
      return response.data.data;
    } catch (error) {
      dispatch(fetchCustomerSalesFailed(error.message));
      toast.error('Failed to fetch customer purchase history');
      throw error;
    }
  };

  return {
    customers,
    isLoading,
    customerSales,
    isLoadingSales,
    getAllCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerSales
  };
};