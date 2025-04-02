import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  stats: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    department: 'all'
  }
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // Fetch employees
    fetchEmployeesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeesSuccess: (state, action) => {
      state.employees = action.payload;
      state.loading = false;
    },
    fetchEmployeesFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create employee
    createEmployeeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createEmployeeSuccess: (state, action) => {
      state.employees.unshift(action.payload);
      state.loading = false;
    },
    createEmployeeFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update employee
    updateEmployeeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEmployeeSuccess: (state, action) => {
      const index = state.employees.findIndex(employee => employee.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
      state.loading = false;
    },
    updateEmployeeFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete employee
    deleteEmployeeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteEmployeeSuccess: (state, action) => {
      state.employees = state.employees.filter(employee => employee.id !== action.payload);
      state.loading = false;
    },
    deleteEmployeeFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch employee stats
    fetchStatsSuccess: (state, action) => {
      state.stats = action.payload;
      state.loading = false;
    },

    // Filters
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    setDepartmentFilter: (state, action) => {
      state.filters.department = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: 'all',
        department: 'all'
      };
    }
  }
});

export const {
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
  setSearchFilter,
  setStatusFilter,
  setDepartmentFilter,
  resetFilters
} = employeeSlice.actions;

// Selectors
export const selectEmployees = state => state.employees.employees;
export const selectEmployeeStats = state => state.employees.stats;
export const selectEmployeesLoading = state => state.employees.loading;
export const selectEmployeesError = state => state.employees.error;
export const selectEmployeeFilters = state => state.employees.filters;

export default employeeSlice.reducer;