import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action) => {
      state.notifications = action.payload;
      state.loading = false;
    },
    fetchNotificationsFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.is_read = true;
      });
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
      if (notificationIndex !== -1) {
        const isUnread = !state.notifications[notificationIndex].is_read;
        state.notifications.splice(notificationIndex, 1);
        if (isUnread) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    }
  }
});

// Export actions
export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailed,
  setUnreadCount,
  markAsRead,
  markAllAsRead,
  addNotification,
  removeNotification
} = notificationsSlice.actions;

// Selectors
export const selectNotifications = state => state.notifications.notifications;
export const selectUnreadCount = state => state.notifications.unreadCount;
export const selectIsLoading = state => state.notifications.loading;
export const selectError = state => state.notifications.error;

export default notificationsSlice.reducer;