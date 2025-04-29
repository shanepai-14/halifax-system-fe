import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  stats: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    role: 'all'
  }
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Fetch users
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    fetchUsersFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create user
    createUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createUserSuccess: (state, action) => {
      state.users.unshift(action.payload);
      state.loading = false;
    },
    createUserFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update user
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      state.loading = false;
    },
    updateUserFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete user
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.loading = false;
    },
    deleteUserFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Stats
    fetchStatsSuccess: (state, action) => {
      state.stats = action.payload;
      state.loading = false;
    },

    // Filters
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setRoleFilter: (state, action) => {
      state.filters.role = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        role: 'all'
      };
    }
  }
});

export const {
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
  setSearchFilter,
  setRoleFilter,
  resetFilters
} = userSlice.actions;

// Selectors
export const selectUsers = state => state.users.users;
export const selectUserStats = state => state.users.stats;
export const selectUsersLoading = state => state.users.loading;
export const selectUsersError = state => state.users.error;
export const selectUserFilters = state => state.users.filters;

export default userSlice.reducer;