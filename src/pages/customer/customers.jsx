import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Box,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip
} from '@mui/material';
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
  ClearOutlined,
  ShoppingCartOutlined,
  StarFilled,
  StarOutlined 
} from '@ant-design/icons';
import { useCustomers } from '@/hooks/useCustomers';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { selectCustomers, selectCustomersLoading } from '@/store/slices/customerSlice';
import CustomerModal from './CustomerModal';


// TableRow Skeleton for loading state
const TableRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell align="right">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
      </Box>
    </TableCell>
  </TableRow>
);

const CustomerPage = () => {
  const navigate = useNavigate();
  const customers = useSelector(selectCustomers);
  const isLoading = useSelector(selectCustomersLoading);
  const { getAllCustomers, deleteCustomer } = useCustomers();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  
  // State for customer modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.role === 'admin';

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCustomer(customerToDelete.id);
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleClearFilter = () => {
    setSearchTerm('');
  };
  
  // Modal handlers
  const handleOpenAddModal = () => {
    setSelectedCustomer(null);
    setCustomerModalOpen(true);
  };
  
  const handleOpenEditModal = (customer) => {
    setSelectedCustomer(customer);
    setCustomerModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setCustomerModalOpen(false);
  };
  
  const handleModalSuccess = () => {
    // Refresh the customer list
    getAllCustomers();
  };

  // New handler for viewing purchase history
  const handleViewPurchaseHistory = (customerId) => {
    navigate(`/app/customer/${customerId}/purchase-history`);
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    return (
      customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.business_name && customer.business_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.contact_number && customer.contact_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.city && customer.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, px: '0!important' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
          <TextField
            placeholder="Search customers"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
        </Box>
        <Box>
          <Button 
            variant="text" 
            color="error" 
            sx={{mr: 1}} 
            onClick={handleClearFilter}
          >
            <ClearOutlined />
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PlusOutlined />}
            onClick={handleOpenAddModal}
          >
            Add Customer
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Business Name</TableCell>
              <TableCell>Business Address</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Show skeleton loader while loading
              [...Array(rowsPerPage)].map((_, index) => (
                <TableRowSkeleton key={index} />
              ))
            ) : (
              filteredCustomers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  
                  <TableRow key={customer.id}>
                    <TableCell width={"1%"} sx={{padding:1 }}>
                    {customer.is_valued_customer ? (
                    <StarFilled style={{ color: '#ffa726' }} />
                  ) : (
                    <StarOutlined style={{ color: '#bdbdbd' }} />
                  )}
                  </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ 
                          cursor: 'pointer', 
                          '&:hover': { 
                            color: 'primary.main',
                            textDecoration: 'underline' 
                          }
                        }}
                        onClick={() => handleViewPurchaseHistory(customer.id)}
                      >
                        {customer.customer_name}
                      </Typography>
                    </TableCell>
                    <TableCell>{customer.business_name || 'N/A'}</TableCell>
                    <TableCell>{customer.business_address || 'N/A'}</TableCell>
                    <TableCell>{customer.contact_number || 'N/A'}</TableCell>
                    <TableCell>{customer.email || 'N/A'}</TableCell>
                    <TableCell>{customer.address || 'N/A'}</TableCell>
                    <TableCell>{customer.city || 'N/A'}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        onClick={() => handleViewPurchaseHistory(customer.id)}
                        color="primary"
                        title="View Purchase History"
                      >
                        <ShoppingCartOutlined style={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton onClick={() => handleOpenEditModal(customer)}>
                        <EditOutlined style={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton disabled={!isAdmin} onClick={() => handleDeleteClick(customer)}>
                        <DeleteOutlined
                          style={{
                            fontSize: 20,
                            color: isAdmin ? 'red' : '#ccc', // Gray out if disabled
                            opacity: isAdmin ? 1 : 0.5,      // Optional: add opacity to make it look disabled
                            cursor: isAdmin ? 'pointer' : 'default',
                          }}
                        />
                      </IconButton>

                    </TableCell>
                  </TableRow>
                ))
            )}
            {!isLoading && filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No customers found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the customer "{customerToDelete?.customer_name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Customer Add/Edit Modal */}
      <CustomerModal
        open={customerModalOpen}
        handleClose={handleCloseModal}
        customer={selectedCustomer}
        handleSuccess={handleModalSuccess}
      />
    </Container>
  );
};

export default CustomerPage;