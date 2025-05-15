import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';

import { useGetNotifications, useMarkAsRead } from '@/hooks/useNotifications';
import { addNotification, selectNotifications } from '@/store/slices/notificationsSlice';

// Main notification toast manager component
const NotificationToast = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storedNotifications = useSelector(selectNotifications);
  
  // Fetch notifications
  const { data: notifications = [], isSuccess } = useGetNotifications({
    is_read: false
  });
  
  const { mutate: markAsRead } = useMarkAsRead();
  
  // Handle showing toast for new notifications
  useEffect(() => {
    if (isSuccess && notifications.length > 0) {
      // Compare with existing notifications to find new ones
      const newNotifications = notifications.filter(newNotif => 
        !storedNotifications.some(existingNotif => existingNotif.id === newNotif.id)
      );
      
      // Add new notifications to store and show toasts
      newNotifications.forEach(notification => {
        // Add to store
        dispatch(addNotification(notification));
        
        // Determine toast type based on notification type
        const getToastType = (type) => {
          switch (type) {
            case 'inventory_low':
              return 'warning';
            case 'inventory_out':
              return 'error';
            case 'purchase_order':
            case 'sale':
              return 'success';
            default:
              return 'info';
          }
        };

        // Show toast with appropriate type
        const toastType = getToastType(notification.type);
        const toastFunction = toast[toastType] || toast;
        
        // Create the toast
        toastFunction(
          notification.title,
          {
            description: notification.message,
            duration: 8000,
            action: notification.reference_type === 'product' && notification.reference_id ? {
              label: 'View Product',
              onClick: () => {
                // Mark as read
                markAsRead(notification.id);
                
                // Navigate to product page
                navigate(`/app/inventory/${notification.reference_id}`);
              }
            } : undefined
          }
        );
      });
    }
  }, [notifications, storedNotifications, dispatch, navigate, markAsRead]);
  
  return null; // This component doesn't render anything
};

export default NotificationToast;