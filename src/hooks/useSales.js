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

export const useSales = () => {
  const dispatch = useDispatch();
  const inventory = useSelector(selectInventory);
  const isLoading = useSelector(selectInventoryLoading);
  const error = useSelector(selectInventoryError);

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

  return {
    inventory,
    isLoading,
    error,
    getAllInventory
  };
};