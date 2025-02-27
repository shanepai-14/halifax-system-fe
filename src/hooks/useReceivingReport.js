import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

/**
 * Hook to create a new receiving report
 * @returns {Object} Mutation object for creating a receiving report
 */
export function useCreateReceivingReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ( data) => {
      const response = await api.post(`/purchase-orders/receiving-reports`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the purchase order query to get updated data
      queryClient.invalidateQueries(['purchaseOrder', variables.po_id]);
      toast.success('Receiving report created successfully');
    },
    onError: (error) => {
      console.error('Error creating receiving report:', error);
      toast.error(error.response?.data?.message || 'Failed to create receiving report');
      
      // Return error object to be handled by the component
      return Promise.reject(error);
    }
  });
}

/**
 * Hook to update an existing receiving report
 * @returns {Object} Mutation object for updating a receiving report
 */
export function useUpdateReceivingReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rrID, data }) => {
      const response = await api.put(`/purchase-orders/${rrID}/receiving-reports`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the purchase order query to get updated data
      queryClient.invalidateQueries(['purchaseOrder']);
      toast.success('Receiving report updated successfully');
    },
    onError: (error) => {
      console.error('Error updating receiving report:', error);
      toast.error(error.response?.data?.message || 'Failed to update receiving report');
      
      // Return error object to be handled by the component
      return Promise.reject(error);
    }
  });
}

/**
 * Hook to delete a receiving report
 * @returns {Object} Mutation object for deleting a receiving report
 */
export function useDeleteReceivingReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/api/receiving-reports/${id}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the purchase order query to get updated data
      queryClient.invalidateQueries(['purchaseOrder']);
      toast.success('Receiving report deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting receiving report:', error);
      toast.error(error.response?.data?.message || 'Failed to delete receiving report');
    }
  });
}