import { useMutation, useQueryClient , useQuery} from '@tanstack/react-query';
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




export function useReceivingReports(filters = {}) {
  return useQuery({
    queryKey: ['receiving-reports', filters],
    queryFn: async () => {
      const response = await api.get('/receiving-reports', { params: filters });
      return response.data.data;
    }
  });
}

export function useReceivingReport(id) {
  return useQuery({
    queryKey: ['receiving-report', id],
    queryFn: async () => {
      const response = await api.get(`/receiving-reports/${id}`);
      return response.data.data;
    },
    enabled: !!id
  });
}

export function useUpdateReceivingReportPaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isPaid }) => {
      const response = await api.put(`/receiving-reports/${id}/payment-status`, { is_paid: isPaid });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch the receiving reports
      queryClient.invalidateQueries(['receiving-reports']);
      if (data.data?.po_id) {
        queryClient.invalidateQueries(['purchase-orders', data.data.po_id]);
      }
      toast.success(`Payment status ${data.data.is_paid ? 'marked as paid' : 'marked as unpaid'}`);
    },
    onError: (error) => {
      console.error('Error updating payment status:', error);
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    }
  });
}

// export function useUpdateReceivingReport() {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: async ({ id, data }) => {
//       const response = await api.put(`/receiving-reports/${id}`, data);
//       return response.data;
//     },
//     onSuccess: (data, variables) => {
//       queryClient.invalidateQueries(['receiving-reports']);
//       queryClient.invalidateQueries(['receiving-report', variables.id]);
      
//       // Also invalidate purchase orders that might display this RR
//       queryClient.invalidateQueries(['purchase-orders']);
      
//       toast.success('Receiving report updated successfully');
//     },
//     onError: (error) => {
//       console.error('Error updating receiving report:', error);
//       toast.error(error.response?.data?.message || 'Failed to update receiving report');
//       return Promise.reject(error);
//     }
//   });
// }

export function useReceivingReportStats() {
  return useQuery({
    queryKey: ['receiving-reports-stats'],
    queryFn: async () => {
      const response = await api.get('/receiving-reports/stats');
      return response.data.data;
    }
  });
}