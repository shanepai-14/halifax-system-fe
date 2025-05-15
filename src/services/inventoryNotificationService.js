/**
 * Service for managing inventory notifications
 * Integrates with Laravel backend for notification persistence
 */

import api from '@/lib/axios';

// API endpoints
const API_ENDPOINTS = {
  NOTIFICATIONS: '/inventory/notifications',
  MARK_READ: '/inventory/notifications/mark-read',
  MARK_ALL_READ: '/inventory/notifications/mark-all-read',
  GENERATE: '/inventory/notifications/generate'
};

/**
 * Get all notifications from the backend
 * @returns {Promise<Array>} Promise that resolves to array of notification objects
 */
export const getNotifications = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS);
    return response.data.data || [];
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    return [];
  }
};

/**
 * Mark a notification as read
 * @param {string|number} notificationId ID of the notification to mark as read
 * @returns {Promise<Object>} Promise that resolves to the updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`${API_ENDPOINTS.MARK_READ}/${notificationId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Promise that resolves to success response
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.patch(API_ENDPOINTS.MARK_ALL_READ);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Generate inventory notifications based on current inventory data
 * @param {Array} inventoryData Current inventory data (optional, backend will use current data if not provided)
 * @returns {Promise<Array>} Promise that resolves to the generated notifications
 */
export const generateInventoryNotifications = async (inventoryData = null) => {
  try {
    // If inventory data is provided, send it to the backend
    const response = inventoryData
      ? await api.post(API_ENDPOINTS.GENERATE, { inventoryData })
      : await api.post(API_ENDPOINTS.GENERATE);
      
    return response.data.data || [];
  } catch (error) {
    console.error('Error generating inventory notifications:', error);
    return [];
  }
};

/**
 * Count unread notifications
 * @param {Array} notifications Array of notification objects
 * @returns {number} Number of unread notifications
 */
export const countUnreadNotifications = (notifications) => {
  if (!notifications || !Array.isArray(notifications)) return 0;
  return notifications.filter(notification => !notification.read).length;
};

export default {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  generateInventoryNotifications,
  countUnreadNotifications
};