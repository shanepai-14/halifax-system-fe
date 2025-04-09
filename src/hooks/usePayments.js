import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import api from '@/lib/axios';

import {
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
  fetchStatsSuccess,
  selectPayments,
  selectCurrentPayment,
  selectPaymentsLoading,
  selectPaymentsError,
  selectPaymentsFilters,
  selectPaymentsStats
} from '@/store/slices/paymentsSlice';

export const usePayments = () => {
  const dispatch = useDispatch();
  
  // Local state for backward compatibility
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  // Select from Redux store
  const payments = useSelector(selectPayments);
  const currentPayment = useSelector(selectCurrentPayment);
  const reduxLoading = useSelector(selectPaymentsLoading);
  const reduxError = useSelector(selectPaymentsError);
  const filters = useSelector(selectPaymentsFilters);
  const stats = useSelector(selectPaymentsStats);
  
  // Combine loading states for backward compatibility
  const isLoading = localLoading || reduxLoading;
  // Combine error states for backward compatibility
  const error = localError || reduxError;

  /**
   * Get all payments with optional filtering
   * @param {Object} filterParams - Filter parameters
   */
  const getAllPayments = async (filterParams = {}) => {
    try {
      dispatch(fetchPaymentsStart());
      const response = await api.get('/payments', { params: filterParams });
      dispatch(fetchPaymentsSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching payments:', err);
      dispatch(fetchPaymentsFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch payments');
      return [];
    }
  };

  /**
   * Get payment by ID
   * @param {number} id - Payment ID
   */
  const getPaymentById = async (id) => {
    try {
      dispatch(fetchPaymentsStart());
      const response = await api.get(`/payments/${id}`);
      dispatch(setCurrentPayment(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching payment:', err);
      dispatch(fetchPaymentsFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch payment');
      return null;
    }
  };

  /**
   * Create a new payment for a sale
   * @param {number} saleId - The ID of the sale
   * @param {object} paymentData - The payment data
   */
  const createPayment = async (saleId, paymentData) => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      dispatch(createPaymentStart());
      
      // Using the original endpoint format to maintain compatibility
      const response = await api.post(`/payments/${saleId}`, paymentData);
      
      dispatch(createPaymentSuccess(response.data.data));
      
      toast.success('Payment recorded successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error creating payment:', err);
      
      setLocalError(err.message || 'Failed to create payment');
      dispatch(createPaymentFailed(err.message || 'Failed to create payment'));
      
      toast.error(err.response?.data?.message || 'Failed to record payment');
      throw err;
    } finally {
      setLocalLoading(false);
    }
  };

  /**
   * Get payment history for a sale
   * @param {number} saleId - The ID of the sale
   */
  const getPaymentHistory = async (saleId) => {
    try {
      setLocalLoading(true);
      setLocalError(null);
      
      // Using the original endpoint format to maintain compatibility
      const response = await api.get(`/payments/${saleId}/history`);
      return response.data.data;
    } catch (err) {
      console.error('Error fetching payment history:', err);
      setLocalError(err.message || 'Failed to fetch payment history');
      toast.error(err.response?.data?.message || 'Failed to fetch payment history');
      return [];
    } finally {
      setLocalLoading(false);
    }
  };

  /**
   * Void a payment
   * @param {number} paymentId - The ID of the payment to void
   * @param {string} reason - The reason for voiding
   */
  const voidPayment = async (paymentId, reason) => {
    try {
      setLocalLoading(true);
      setLocalError(null);

      const response = await api.put(`/payments/${paymentId}/void`, { reason });

  
      toast.success('Payment voided successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error voiding payment:', err);
      
      setLocalError(err.message || 'Failed to void payment');

      toast.error(err.response?.data?.message || 'Failed to void payment');
      throw err;
    } finally {
      setLocalLoading(false);
    }
  };

  /**
   * Get payment statistics
   * @param {Object} filterParams - Filter parameters for stats
   */
  const getPaymentStats = async (filterParams = {}) => {
    try {
      const response = await api.get('/payments/stats', { params: filterParams });
      dispatch(fetchStatsSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching payment statistics:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch payment statistics');
      return null;
    }
  };

  const completePayment = async (id) => {
    try {
      const response = await api.put(`/payments/${id}/complete`);
      
      if (response.data.status === 'success') {
        toast.success('Payment marked as completed');
        return response.data.data;
      } else if (response.data.status === 'info') {
        toast.info(response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error completing payment:', error);
      toast.error(error.response?.data?.message || 'Failed to complete payment');
      throw error; // Re-throw to handle in the calling function
    }
  };

  /**
   * Reset current payment selection
   */
  const resetCurrentPayment = () => {
    dispatch(clearCurrentPayment());
  };

  return {
    payments,
    currentPayment,
    isLoading,
    error,
    filters,
    stats,
    completePayment,
    getAllPayments,
    getPaymentById,
    createPayment,
    getPaymentHistory,
    voidPayment,
    getPaymentStats,
    resetCurrentPayment
  };
};