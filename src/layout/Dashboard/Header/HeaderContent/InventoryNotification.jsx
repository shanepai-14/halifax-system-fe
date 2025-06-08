import  React, { useRef, useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

// project import
import MainCard from '@components/MainCard';
import Transitions from '@components/@extended/Transitions';

// hooks
import { useGetNotifications, useGetUnreadCount, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import ShoppingOutlined from '@ant-design/icons/ShoppingOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// Get icon based on notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'inventory_low':
      return <WarningOutlined />;
    case 'inventory_out':
      return <ExclamationCircleOutlined />;
    case 'purchase_order':
      return <ShoppingOutlined />;
    case 'sale':
      return <DollarOutlined />;
    default:
      return <InfoCircleOutlined />;
  }
};

// Get avatar color based on notification type
const getAvatarColor = (type) => {
  switch (type) {
    case 'inventory_low':
      return { color: 'warning.main', bgcolor: 'warning.lighter' };
    case 'inventory_out':
      return { color: 'error.main', bgcolor: 'error.lighter' };
    case 'purchase_order':
      return { color: 'primary.main', bgcolor: 'primary.lighter' };
    case 'sale':
      return { color: 'success.main', bgcolor: 'success.lighter' };
    default:
      return { color: 'info.main', bgcolor: 'info.lighter' };
  }
};

// Format date helper function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // If today, show time only
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // If this year, show month and day
  if (date.getFullYear() === today.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  
  // Otherwise show full date
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('unread'); // 'all', 'read', 'unread'

  // Load notifications data
  const { data: notifications = [], isLoading, refetch } = useGetNotifications({
    is_read: filter === 'all' ? undefined : filter === 'unread' ? false : true
  });
  
  // Load unread count with auto-refresh
  const { data: unreadCount = 0 } = useGetUnreadCount();
  
  // Mutations
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  // Refresh notifications when opening the menu
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id, {
      onSuccess: () => {
        // Show success toast
        toast.success('Notification marked as read');
      }
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        // Show success toast
        toast.success('All notifications marked as read');
      }
    });
  };

  const iconBackColorOpen = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : 'transparent' }}
        aria-label="open notification"
        ref={anchorRef}
        aria-controls={open ? 'notification-popup' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={unreadCount} color="error">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notifications"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                      {unreadCount > 0 && (
                        <Tooltip title="Mark all as read">
                          <IconButton color="success" size="small" onClick={handleMarkAllAsRead}>
                            <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        color={filter === 'all' ? 'primary' : 'inherit'}
                        onClick={() => setFilter('all')}
                      >
                        All
                      </Button>
                      <Button 
                        size="small" 
                        color={filter === 'unread' ? 'primary' : 'inherit'} 
                        onClick={() => setFilter('unread')}
                      >
                        Unread
                      </Button>
                      <Button 
                        size="small" 
                        color={filter === 'read' ? 'primary' : 'inherit'} 
                        onClick={() => setFilter('read')}
                      >
                        Read
                      </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {unreadCount} unread
                    </Typography>
                  </Box>
                  <Divider />

                  {isLoading ? (
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : notifications.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No notifications to display
                      </Typography>
                    </Box>
                  ) : (
                    <List
                      component="nav"
                      sx={{
                        p: 0,
                        maxHeight: '70vh', // Set maximum height
                        overflowY: 'auto', // Enable vertical scrolling
                        '& .MuiListItemButton-root': {
                          py: 0.5,
                          '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                          '& .MuiAvatar-root': avatarSX,
                          '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                        }
                      }}
                    >
                      {notifications.map((notification) => (
                        <React.Fragment key={notification.id}>
                          <ListItemButton 
                            selected={!notification.is_read}
                            onClick={() => handleMarkAsRead(notification.id)}
                            component={notification.reference_type === 'product' ? RouterLink : undefined}
                            to={notification.reference_type === 'product' ? `/app/inventory/${notification.reference_id}` : undefined}
                          >
                            <ListItemAvatar>
                              <Avatar sx={getAvatarColor(notification.type)}>
                                {getNotificationIcon(notification.type)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle1">
                                  {notification.title}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {notification.message}
                                </Typography>
                              }
                            />
                            <ListItemSecondaryAction>
                              <Typography variant="caption" noWrap>
                                {formatDate(notification.created_at)}
                              </Typography>
                            </ListItemSecondaryAction>
                          </ListItemButton>
                          <Divider />
                        </React.Fragment>
                      ))}

                      {notifications.length > 0 && (
                        <ListItemButton 
                          sx={{ textAlign: 'center', py: `${12}px !important` }}
                          component={RouterLink}
                          to="/app/notifications"
                          onClick={() => setOpen(false)}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="h6" color="primary">
                                View All
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      )}
                    </List>
                  )}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}