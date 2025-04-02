import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import api from '@/lib/axios';
import {
  fetchEmployeesStart,
  fetchEmployeesSuccess,
  fetchEmployeesFailed,
  createEmployeeStart,
  createEmployeeSuccess,
  createEmployeeFailed,
  updateEmployeeStart,
  updateEmployeeSuccess,
  updateEmployeeFailed,
  deleteEmployeeStart,
  deleteEmployeeSuccess,
  deleteEmployeeFailed,
  fetchStatsSuccess,
  selectEmployees,
  selectEmployeeStats,
  selectEmployeesLoading,
  selectEmployeesError,
  selectEmployeeFilters
} from '@/store/slices/employeeSlice';

export const useEmployees = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const employees = useSelector(selectEmployees);
  const stats = useSelector(selectEmployeeStats);
  const loading = useSelector(selectEmployeesLoading);
  const error = useSelector(selectEmployeesError);
  const filters = useSelector(selectEmployeeFilters);

  // Fetch all employees
  const getAllEmployees = async (customFilters = {}) => {
    try {
      dispatch(fetchEmployeesStart());
      
      const queryParams = {
        search: filters.search || customFilters.search,
        status: filters.status !== 'all' ? filters.status : undefined,
        department: filters.department !== 'all' ? filters.department : undefined,
        sort_by: customFilters.sort_by || 'created_at',
        sort_order: customFilters.sort_order || 'desc'
      };

      const response = await api.get('/employees', { params: queryParams });
      dispatch(fetchEmployeesSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching employees:', err);
      dispatch(fetchEmployeesFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch employees');
      return [];
    }
  };

  // Get employee by ID
  const getEmployeeById = async (id) => {
    try {
      dispatch(fetchEmployeesStart());
      const response = await api.get(`/employees/${id}`);
      dispatch(fetchEmployeesSuccess([response.data.data]));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching employee:', err);
      dispatch(fetchEmployeesFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch employee');
      return null;
    }
  };

  // Create a new employee
  const createEmployee = async (employeeData) => {
    try {
      dispatch(createEmployeeStart());
      const response = await api.post('/employees', employeeData);
      dispatch(createEmployeeSuccess(response.data.data));
      toast.success('Employee created successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error creating employee:', err);
      dispatch(createEmployeeFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to create employee');
      throw err;
    }
  };

  // Update an existing employee
  const updateEmployee = async (id, employeeData) => {
    try {
      dispatch(updateEmployeeStart());
      const response = await api.put(`/employees/${id}`, employeeData);
      dispatch(updateEmployeeSuccess(response.data.data));
      toast.success('Employee updated successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error updating employee:', err);
      dispatch(updateEmployeeFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to update employee');
      throw err;
    }
  };

  // Delete an employee
  const deleteEmployee = async (id) => {
    try {
      dispatch(deleteEmployeeStart());
      await api.delete(`/employees/${id}`);
      dispatch(deleteEmployeeSuccess(id));
      toast.success('Employee deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting employee:', err);
      dispatch(deleteEmployeeFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to delete employee');
      throw err;
    }
  };

  // Get employee statistics
  const getEmployeeStats = async () => {
    try {
      dispatch(fetchEmployeesStart());
      const response = await api.get('/employees/stats');
      dispatch(fetchStatsSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching employee statistics:', err);
      dispatch(fetchEmployeesFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch employee statistics');
      return null;
    }
  };

  // Get trashed employees
  const getTrashedEmployees = async () => {
    try {
      dispatch(fetchEmployeesStart());
      const response = await api.get('/employees/trashed');
      dispatch(fetchEmployeesSuccess(response.data.data));
      return response.data.data;
    } catch (err) {
      console.error('Error fetching trashed employees:', err);
      dispatch(fetchEmployeesFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to fetch trashed employees');
      return [];
    }
  };

  // Restore a trashed employee
  const restoreEmployee = async (id) => {
    try {
      dispatch(updateEmployeeStart());
      const response = await api.post(`/employees/${id}/restore`);
      dispatch(updateEmployeeSuccess(response.data.data));
      toast.success('Employee restored successfully');
      return response.data.data;
    } catch (err) {
      console.error('Error restoring employee:', err);
      dispatch(updateEmployeeFailed(err.message));
      toast.error(err.response?.data?.message || 'Failed to restore employee');
      throw err;
    }
  };

  return {
    // State
    employees,
    stats,
    loading,
    error,
    filters,
    
    // Methods
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats,
    getTrashedEmployees,
    restoreEmployee
  };
};