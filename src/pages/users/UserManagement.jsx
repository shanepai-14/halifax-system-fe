import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { useUsers } from '@/hooks/useUsers';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';
import AddUserModal from './modals/AddUserModal';
import EditUserModal from './modals/EditUserModal';
import MainCard from '@components/MainCard';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Get current user from auth state
  const currentUser = useSelector(selectCurrentUser);

  // Custom hooks
  const { 
    users, 
    getAllUsers, 
    deleteUser, 
    getUserStats,
    stats,
    loading,
    error
  } = useUsers();

  useEffect(() => {
    loadData();
    getUserStats();
  }, [currentPage]);

  const loadData = async () => {
    try {
      const filters = {
        search: searchTerm,
        role: roleFilter,
        page: currentPage
      };
      const result = await getAllUsers(filters);
      if (result && result.last_page) {
        setTotalPages(result.last_page);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    loadData();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditUserModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      setDeleteConfirmOpen(false);
      setSelectedUser(null);
      loadData();
      getUserStats(); // Refresh stats after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setDeleteConfirmOpen(true);
  };
  
  const getRoleChip = (role) => {
    switch (role) {
      case 'admin':
        return <Chip label="Admin" color="error" size="small" />;
      case 'sales':
        return <Chip label="Sales" color="info" size="small" />;
      case 'cashier':
        return <Chip label="Cashier" color="success" size="small" />;
      case 'staff':
        return <Chip label="Staff" color="warning" size="small" />;
      default:
        return <Chip label={role} size="small" />;
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setCurrentPage(1);
    loadData();
  };

  return (
      <Box>
        {/* Summary Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">User Management</Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage system users and their access roles
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlusOutlined />}
                  onClick={() => setAddUserModalOpen(true)}
                >
                  Add User
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {stats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">Total Users</Typography>
                <Typography variant="h4">{stats.total_users}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">Admin Users</Typography>
                <Typography variant="h4">{stats.admin_users}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">Sales Users</Typography>
                <Typography variant="h4">{stats.sales_users}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">Cashier Users</Typography>
                <Typography variant="h4">{stats.cashier_users}</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by name, username, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  )
                }}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Role"
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="cashier">Cashier</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  startIcon={<FilterOutlined />}
                >
                  Filter
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleResetFilters}
                  startIcon={<ReloadOutlined />}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Users Table */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Loading...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No users found</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton 
                          color="info" 
                          size="small" 
                          onClick={() => handleEdit(user)}
                        >
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          color="error" 
                          size="small" 
                          onClick={() => confirmDelete(user)}
                          // Disable delete button for current user
                          disabled={currentUser && currentUser.id === user.id}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the user "{selectedUser?.username}"? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modals */}
        <AddUserModal
          open={addUserModalOpen}
          onClose={() => setAddUserModalOpen(false)}
          onSuccess={() => {
            setAddUserModalOpen(false);
            loadData();
            getUserStats(); // Refresh stats after adding
          }}
        />

        <EditUserModal
          open={editUserModalOpen}
          onClose={() => {
            setEditUserModalOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            setEditUserModalOpen(false);
            setSelectedUser(null);
            loadData();
          }}
          user={selectedUser}
        />
      </Box>
  );
};

export default UserManagement;