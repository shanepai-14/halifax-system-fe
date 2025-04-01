import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { 
  updateSaleStart,
  updateSaleSuccess,
  updateSaleFailed 
} from '@/store/slices/salesSlice';

export const usePayments = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new payment for a sale
   * @param {number} saleId - The ID of the sale
   * @param {object} paymentData - The payment data
   */
  const createPayment = async (saleId, paymentData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      dispatch(updateSaleStart());
      const response = await api.post(`/payments/${saleId}`, paymentData);
      dispatch(updateSaleSuccess(response.data.data));
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      setError(error.message || 'Failed to create payment');
      dispatch(updateSaleFailed(error.message || 'Failed to create payment'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get payment history for a sale
   * @param {number} saleId - The ID of the sale
   */
  const getPaymentHistory = async (saleId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get(`/payments/${saleId}/history`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError(error.message || 'Failed to fetch payment history');
      toast.error(error.response?.data?.message || 'Failed to fetch payment history');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Void a payment
   * @param {number} paymentId - The ID of the payment to void
   */
  const voidPayment = async (paymentId, reason) => {
    try {
      setIsLoading(true);
      setError(null);
      
      dispatch(updateSaleStart());
      const response = await api.put(`/payments/${paymentId}/void`, { reason });
      dispatch(updateSaleSuccess(response.data.data));
      
      return response.data.data;
    } catch (error) {
      console.error('Error voiding payment:', error);
      setError(error.message || 'Failed to void payment');
      dispatch(updateSaleFailed(error.message || 'Failed to void payment'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createPayment,
    getPaymentHistory,
    voidPayment
  };
};

export default usePayments;