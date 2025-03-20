import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import api from '@/lib/axios';
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
  deleteCustomerFailed
} from '@/store/slices/customerSlice';

// Custom hook for managing customer operations
export function useCustomers() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all customers
  const getAllCustomers = async (filters = {}) => {
    try {
      dispatch(fetchCustomersStart());
      const response = await api.get('/customers', { params: filters });
      dispatch(fetchCustomersSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching customers:', err);
      dispatch(fetchCustomersFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch customers');
      return [];
    }
  };

  // Get customer by ID
  const getCustomerById = async (id) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/customers/${id}`);
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      console.error('Error fetching customer:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch customer');
      return null;
    }
  };

  // Create a new customer
  const createCustomer = async (customerData) => {
    try {
      dispatch(createCustomerStart());
      const response = await api.post('/customers', customerData);
      dispatch(createCustomerSuccess(response.data.data));
      toast.success('Customer created successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error creating customer:', err);
      dispatch(createCustomerFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to create customer');
      throw err;
    }
  };

  // Update an existing customer
  const updateCustomer = async (id, customerData) => {
    try {
      dispatch(updateCustomerStart());
      const response = await api.put(`/customers/${id}`, customerData);
      dispatch(updateCustomerSuccess(response.data.data));
      toast.success('Customer updated successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error updating customer:', err);
      dispatch(updateCustomerFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to update customer');
      throw err;
    }
  };

  // Delete a customer
  const deleteCustomer = async (id) => {
    try {
      dispatch(deleteCustomerStart());
      await api.delete(`/customers/${id}`);
      dispatch(deleteCustomerSuccess(id));
      toast.success('Customer deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting customer:', err);
      dispatch(deleteCustomerFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to delete customer');
      throw err;
    }
  };

  // Get statistics
  const getCustomerStats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/customers/stats');
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      console.error('Error fetching customer statistics:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch customer statistics');
      return null;
    }
  };

  return {
    isLoading,
    error,
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerStats
  };
}