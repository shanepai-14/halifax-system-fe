import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { 
  fetchInventoryStart,
  fetchInventorySuccess,
  fetchInventoryFailed,
  selectInventory,
  selectInventoryLoading,
  selectInventoryError 
} from '@/store/slices/inventorySlice';
import {
  fetchSalesStart,
  fetchSalesSuccess,
  fetchSalesFailed,
  createSaleStart,
  createSaleSuccess,
  createSaleFailed,
  updateSaleStart,
  updateSaleSuccess,
  updateSaleFailed,
  setCurrentSale,
  clearCurrentSale,
  selectSales,
  selectCurrentSale,
  selectSalesLoading,
  selectSalesError
} from '@/store/slices/salesSlice';

export const useSales = () => {
  const dispatch = useDispatch();
  
  // Inventory selectors and method
  const inventory = useSelector(selectInventory);
  const isInventoryLoading = useSelector(selectInventoryLoading);
  const inventoryError = useSelector(selectInventoryError);

  const getAllInventory = async (filters = {}) => {
    try {
      dispatch(fetchInventoryStart());
      const response = await api.get('/inventory/sales', { params: filters });
      dispatch(fetchInventorySuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching inventory:', err);
      dispatch(fetchInventoryFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch inventory');
      return [];
    }
  };

  // Sales-related state and methods
  const sales = useSelector(selectSales);
  const currentSale = useSelector(selectCurrentSale);
  const isSalesLoading = useSelector(selectSalesLoading);
  const salesError = useSelector(selectSalesError);

  // Fetch all sales
  const getAllSales = async (filters = {}) => {
    try {
      dispatch(fetchSalesStart());
      const response = await api.get('/sales', { params: filters });
      dispatch(fetchSalesSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching sales:', err);
      dispatch(fetchSalesFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch sales');
      return [];
    }
  };

  // Fetch sale by ID
  const getSaleById = async (id) => {
    try {
      dispatch(fetchSalesStart());
      const response = await api.get(`/sales/${id}`);
      dispatch(setCurrentSale(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching sale:', err);
      dispatch(fetchSalesFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch sale');
      return null;
    }
  };

  // Fetch sale by invoice number
  const getSaleByInvoiceNumber = async (invoiceNumber) => {
    try {
      dispatch(fetchSalesStart());
      const response = await api.get(`/sales/invoice/${invoiceNumber}`);
      dispatch(setCurrentSale(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching sale:', err);
      dispatch(fetchSalesFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch sale');
      return null;
    }
  };

  // Create a new sale
  const createSale = async (data) => {
    try {
      dispatch(createSaleStart());
      const response = await api.post('/sales', data);
      dispatch(createSaleSuccess(response.data.data));
      toast.success('Sale created successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error creating sale:', err);
      dispatch(createSaleFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to create sale');
      return null;
    }
  };

  // Update a sale
  const updateSale = async (id, data) => {
    try {
      dispatch(updateSaleStart());
      const response = await api.put(`/sales/${id}`, data);
      dispatch(updateSaleSuccess(response.data.data));
      toast.success('Sale updated successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error updating sale:', err);
      dispatch(updateSaleFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to update sale');
      return null;
    }
  };

  // Update sale payment
  const updateSalePayment = async (id, data) => {
    try {
      dispatch(updateSaleStart());
      const response = await api.put(`/sales/${id}/payment`, data);
      dispatch(updateSaleSuccess(response.data.data));
      toast.success('Payment updated successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error updating sale payment:', err);
      dispatch(updateSaleFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to update payment');
      return null;
    }
  };

  // Cancel a sale
  const cancelSale = async (id, reason) => {
    try {
      dispatch(updateSaleStart());
      const response = await api.put(`/sales/${id}/cancel`, { reason });
      dispatch(updateSaleSuccess(response.data.data));
      toast.success('Sale cancelled successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error cancelling sale:', err);
      dispatch(updateSaleFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to cancel sale');
      return null;
    }
  };

  // Mark sale as delivered
  const markAsDelivered = async (id) => {
    try {
      dispatch(updateSaleStart());
      const response = await api.put(`/sales/${id}/deliver`);
      dispatch(updateSaleSuccess(response.data.data));
      toast.success('Sale marked as delivered successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error marking sale as delivered:', err);
      dispatch(updateSaleFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to mark sale as delivered');
      return null;
    }
  };

  // Fetch sales statistics
  const getSalesStats = async (filters = {}) => {
    try {
      dispatch(fetchSalesStart());
      const response = await api.get('/sales/stats', { params: filters });
      return response.data.data;
    } catch (err) {
      console.error('Error fetching sales statistics:', err);
      dispatch(fetchSalesFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch sales statistics');
      return null;
    }
  };

  // Clear current sale
  const resetCurrentSale = () => {
    dispatch(clearCurrentSale());
  };

  return {
    // Inventory-related returns
    inventory,
    isInventoryLoading,
    inventoryError,
    getAllInventory,

    // Sales-related returns
    sales,
    currentSale,
    isSalesLoading,
    salesError,
    getAllSales,
    getSaleById,
    getSaleByInvoiceNumber,
    createSale,
    updateSale,
    updateSalePayment,
    cancelSale,
    markAsDelivered,
    getSalesStats,
    resetCurrentSale
  };
};