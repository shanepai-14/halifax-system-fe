import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import api from '@/lib/axios';
import {
  fetchStart,
  fetchFailed,
  fetchFundsSuccess,
  addFundSuccess,
  updateFundSuccess,
  fetchTransactionsSuccess,
  addTransactionSuccess,
  updateTransactionSuccess,
  fetchStatsSuccess,
  fetchBalanceSuccess,
  selectPettyCashFunds,
  selectPettyCashTransactions,
  selectPettyCashStats,
  selectPettyCashBalance,
  selectPettyCashLoading,
  selectPettyCashError,
  selectPettyCashFilters
} from '@/store/slices/pettyCashSlice';

export const usePettyCash = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const funds = useSelector(selectPettyCashFunds);
  const transactions = useSelector(selectPettyCashTransactions);
  const stats = useSelector(selectPettyCashStats);
  const balance = useSelector(selectPettyCashBalance);
  const loading = useSelector(selectPettyCashLoading);
  const error = useSelector(selectPettyCashError);
  const filters = useSelector(selectPettyCashFilters);

  // Get petty cash balance
  const getBalance = async () => {
    try {
      dispatch(fetchStart());
      const response = await api.get('/petty-cash/balance');
      dispatch(fetchBalanceSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching petty cash balance:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch petty cash balance');
      return null;
    }
  };

  // Get all petty cash funds
  const getAllFunds = async (customFilters = {}) => {
    try {
      dispatch(fetchStart());
      const queryParams = {
        search: filters.search || customFilters.search,
        status: filters.status !== 'all' ? filters.status : undefined,
        date_from: filters.startDate || customFilters.startDate,
        date_to: filters.endDate || customFilters.endDate,
        sort_by: customFilters.sort_by || 'date',
        sort_order: customFilters.sort_order || 'desc'
      };

      const response = await api.get('/petty-cash/funds', { params: queryParams });
      dispatch(fetchFundsSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching petty cash funds:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch petty cash funds');
      return [];
    }
  };

  // Create a new petty cash fund
  const createFund = async (fundData) => {
    try {
      dispatch(fetchStart());
      const response = await api.post('/petty-cash/funds', fundData);
      
      // Add the full response data to the store with more details for receipt
      const fundWithDetails = {
        ...response.data.data,
        creator: { name: 'Current User' }, // You can replace this with actual user data if available
        created_at: new Date().toISOString()
      };
      
      dispatch(addFundSuccess(fundWithDetails));
      toast.success('Petty cash fund created successfully');
      return fundWithDetails;
    } catch (err) {
      console.error('Error creating petty cash fund:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to create petty cash fund');
      throw err;
    }
  };

  // Approve a petty cash fund
  const approveFund = async (id) => {
    try {
      dispatch(fetchStart());
      const response = await api.put(`/petty-cash/funds/${id}/approve`);
      
      // Add more details to the response for receipt
      const approvedFund = {
        ...response.data.data,
        approver: { name: 'Current Approver' }, // You can replace this with actual user data if available
        updated_at: new Date().toISOString()
      };
      
      dispatch(updateFundSuccess(approvedFund));
      toast.success('Petty cash fund approved successfully');
      return approvedFund;
    } catch (err) {
      console.error('Error approving petty cash fund:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to approve petty cash fund');
      throw err;
    }
  };

  // Get all petty cash transactions
  const getAllTransactions = async (customFilters = {}) => {
    try {
      dispatch(fetchStart());
      const queryParams = {
        search: filters.search || customFilters.search,
        status: filters.status !== 'all' ? filters.status : undefined,
        employee_id: filters.employeeId || customFilters.employeeId,
        date_from: filters.startDate || customFilters.startDate,
        date_to: filters.endDate || customFilters.endDate,
        sort_by: customFilters.sort_by || 'date',
        sort_order: customFilters.sort_order || 'desc'
      };

      const response = await api.get('/petty-cash/transactions', { params: queryParams });
      dispatch(fetchTransactionsSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching petty cash transactions:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch petty cash transactions');
      return [];
    }
  };

  // Create a new petty cash transaction
  const createTransaction = async (transactionData) => {
    try {
      dispatch(fetchStart());
      
      // Handle file upload if it's a FormData
      let response;
      if (transactionData instanceof FormData) {
        response = await api.post('/petty-cash/transactions', transactionData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.post('/petty-cash/transactions', transactionData);
      }
      
      // Add more details to the transaction for receipt
      const transactionWithDetails = {
        ...response.data.data,
        issuer: { name: 'Current User' }, // You can replace with actual user data
        created_at: new Date().toISOString()
      };
      
      dispatch(addTransactionSuccess(transactionWithDetails));
      toast.success('Petty cash transaction created successfully');
      return transactionWithDetails;
    } catch (err) {
      console.error('Error creating petty cash transaction:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to create petty cash transaction');
      throw err;
    }
  };

  // Settle a petty cash transaction
  const settleTransaction = async (id, settlementData) => {
    try {
      dispatch(fetchStart());
      
      // Handle file upload if it's a FormData
      let response;
      if (settlementData instanceof FormData) {
        response = await api.put(`/petty-cash/transactions/${id}/settle`, settlementData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.put(`/petty-cash/transactions/${id}/settle`, settlementData);
      }
      
      // Add more details for receipt
      const settledTransaction = {
        ...response.data.data,
        updated_at: new Date().toISOString()
      };
      
      dispatch(updateTransactionSuccess(settledTransaction));
      toast.success('Petty cash transaction settled successfully');
      return settledTransaction;
    } catch (err) {
      console.error('Error settling petty cash transaction:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to settle petty cash transaction');
      throw err;
    }
  };

  // Approve a petty cash transaction
  const approveTransaction = async (id) => {
    try {
      dispatch(fetchStart());
      const response = await api.put(`/petty-cash/transactions/${id}/approve`);
      
      // Add more details for receipt
      const approvedTransaction = {
        ...response.data.data,
        approver: { name: 'Current Approver' }, // Replace with actual user data
        updated_at: new Date().toISOString()
      };
      
      dispatch(updateTransactionSuccess(approvedTransaction));
      toast.success('Petty cash transaction approved successfully');
      return approvedTransaction;
    } catch (err) {
      console.error('Error approving petty cash transaction:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to approve petty cash transaction');
      throw err;
    }
  };

  // Cancel a petty cash transaction
  const cancelTransaction = async (id, reason) => {
    try {
      dispatch(fetchStart());
      const response = await api.put(`/petty-cash/transactions/${id}/cancel`, { reason });
      dispatch(updateTransactionSuccess(response.data.data));
      toast.success('Petty cash transaction cancelled successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error cancelling petty cash transaction:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to cancel petty cash transaction');
      throw err;
    }
  };

  // Get petty cash statistics
  const getStats = async () => {
    try {
      dispatch(fetchStart());
      const response = await api.get('/petty-cash/stats');
      dispatch(fetchStatsSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching petty cash stats:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch petty cash statistics');
      return null;
    }
  };

  // Get employee transactions
  const getEmployeeTransactions = async (employeeId, customFilters = {}) => {
    try {
      dispatch(fetchStart());
      const queryParams = {
        status: filters.status !== 'all' ? filters.status : undefined,
        date_from: filters.startDate || customFilters.startDate,
        date_to: filters.endDate || customFilters.endDate,
        sort_by: customFilters.sort_by || 'date',
        sort_order: customFilters.sort_order || 'desc'
      };

      const response = await api.get(`/petty-cash/employees/${employeeId}/transactions`, { 
        params: queryParams 
      });
      
      dispatch(fetchTransactionsSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching employee transactions:', err);
      dispatch(fetchFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch employee transactions');
      return [];
    }
  };

  return {
    // State
    funds,
    transactions,
    stats,
    balance,
    loading,
    error,
    filters,
    
    // Methods
    getBalance,
    getAllFunds,
    createFund,
    approveFund,
    getAllTransactions,
    createTransaction,
    settleTransaction,
    approveTransaction,
    cancelTransaction,
    getStats,
    getEmployeeTransactions
  };
};