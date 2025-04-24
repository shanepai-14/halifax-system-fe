import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import api from '@/lib/axios';
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailed,
  createUserStart,
  createUserSuccess,
  createUserFailed,
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailed,
  fetchStatsSuccess,
  selectUsers,
  selectUserStats,
  selectUsersLoading,
  selectUsersError,
  selectUserFilters
} from '@/store/slices/userSlice';

export const useUsers = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const users = useSelector(selectUsers);
  const stats = useSelector(selectUserStats);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const filters = useSelector(selectUserFilters);

  // Fetch all users
  const getAllUsers = async (customFilters = {}) => {
    try {
      dispatch(fetchUsersStart());
      
      const queryParams = {
        search: filters.search || customFilters.search,
        role: filters.role !== 'all' ? filters.role : undefined,
        sort_by: customFilters.sort_by || 'created_at',
        sort_order: customFilters.sort_order || 'desc'
      };

      const response = await api.get('/users', { params: queryParams });
      dispatch(fetchUsersSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching users:', err);
      dispatch(fetchUsersFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch users');
      return [];
    }
  };

  // Get user by ID
  const getUserById = async (id) => {
    try {
      dispatch(fetchUsersStart());
      const response = await api.get(`/users/${id}`);
      dispatch(fetchUsersSuccess([response.data.data]));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching user:', err);
      dispatch(fetchUsersFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch user');
      return null;
    }
  };

  // Create a new user
  const createUser = async (userData) => {
    try {
      dispatch(createUserStart());
      const response = await api.post('/users', userData);
      dispatch(createUserSuccess(response.data.data));
      toast.success('User created successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error creating user:', err);
      dispatch(createUserFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to create user');
      throw err;
    }
  };

  // Update an existing user
  const updateUser = async (id, userData) => {
    try {
      dispatch(updateUserStart());
      const response = await api.put(`/users/${id}`, userData);
      dispatch(updateUserSuccess(response.data.data));
      toast.success('User updated successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error updating user:', err);
      dispatch(updateUserFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to update user');
      throw err;
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      dispatch(deleteUserStart());
      await api.delete(`/users/${id}`);
      dispatch(deleteUserSuccess(id));
      toast.success('User deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      dispatch(deleteUserFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to delete user');
      throw err;
    }
  };

  // Get user statistics
  const getUserStats = async () => {
    try {
      dispatch(fetchUsersStart());
      const response = await api.get('/users/stats');
      dispatch(fetchStatsSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching user statistics:', err);
      dispatch(fetchUsersFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch user statistics');
      return null;
    }
  };

  return {
    // State
    users,
    stats,
    loading,
    error,
    filters,
    
    // Methods
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserStats
  };
};