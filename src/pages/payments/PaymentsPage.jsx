import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Container, TablePagination, Button, TextField, Box, Chip,
  InputAdornment, Grid, FormControl, InputLabel, Select, MenuItem,
  IconButton, Card, CardContent, Dialog
} from '@mui/material';
import * as XLSX from 'xlsx';

import { 
  SearchOutlined, 
  FilterOutlined, 
  ContainerOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import { 
  selectPaymentsFilters, 
  setSearchTerm, 
  setPaymentMethodFilter, 
  setStatusFilter, 
  setDateRange 
} from '@/store/slices/paymentsSlice';

import { usePayments } from '@/hooks/usePayments';
import TablePaymentRowSkeleton from '@/components/loader/TablePaymentRowSkeleton';
import PaymentReceipt from '@/pages/sales/PaymentReceipt';
import { formatDate , formatDateTime } from '@/utils/formatUtils';
import { formatCurrency } from '@/utils/formatUtils';

// Map payment methods to display names
const paymentMethodDisplay = (method) => {
  const methodMap = {
    'cash': 'Cash',
    'credit_card': 'Credit Card',
    'debit_card': 'Debit Card',
    'cheque': 'Cheque',
    'bank_transfer': 'Bank Transfer',
    'online': 'Online Payment',
    'mobile_payment': 'Mobile Payment',
    'store_credit': 'Store Credit'
  };
  
  return methodMap[method] || method;
};

const PaymentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filters = useSelector(selectPaymentsFilters);
  
  const { 
    payments,
    isLoading,
    getAllPayments,
    getPaymentStats,
    voidPayment
  } = usePayments();

  // State for table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [paymentToVoid, setPaymentToVoid] = useState(null);
  
  // State for payment statistics
  const [stats, setStats] = useState({
    total_payments: 0,
    total_amount: 0,
    total_voided: 0,
    voided_amount: 0
  });
  
  // Load payments on component mount and when filters change
  useEffect(() => {
    fetchPayments();
  }, [filters.paymentMethodFilter, filters.statusFilter, filters.startDate, filters.endDate]);

  // Function to fetch payments with filters
  const fetchPayments = async () => {
    const apiFilters = {
      payment_method: filters.paymentMethodFilter !== 'all' ? filters.paymentMethodFilter : undefined,
      status: filters.statusFilter !== 'all' ? filters.statusFilter : undefined,
      date_from: filters.startDate || undefined,
      date_to: filters.endDate || undefined,
      search: filters.searchTerm || undefined
    };

    await getAllPayments(apiFilters);
    
    // Also fetch statistics based on the same date range
    const statsFilters = {
      date_from: apiFilters.date_from,
      date_to: apiFilters.date_to
    };
    
    const statsData = await getPaymentStats(statsFilters);
    if (statsData) {
      setStats(statsData);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSearch = () => {
    setPage(0); // Reset to first page when searching
    fetchPayments();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePaymentMethodFilterChange = (e) => {
    dispatch(setPaymentMethodFilter(e.target.value));
  };

  const handleStatusFilterChange = (e) => {
    dispatch(setStatusFilter(e.target.value));
  };

  const handleStartDateChange = (e) => {
    dispatch(setDateRange({
      startDate: e.target.value,
      endDate: filters.endDate
    }));
  };

  const handleEndDateChange = (e) => {
    dispatch(setDateRange({
      startDate: filters.startDate,
      endDate: e.target.value
    }));
  };

  const handleViewSale = (saleId) => {
    navigate(`/app/delivery-report/${saleId}`);
  };

  const handleViewReceipt = (payment) => {
    const formattedPayment = { 
      payment: payment,
      sale: payment.sale
    };
    setSelectedPayment(formattedPayment);
    setReceiptDialogOpen(true);
  };

  const handleCloseReceiptDialog = () => {
    setReceiptDialogOpen(false);
    setSelectedPayment(null);
  };

  const handleOpenVoidDialog = (payment) => {
    setPaymentToVoid(payment);
    setVoidDialogOpen(true);
  };

  const handleCloseVoidDialog = () => {
    setVoidDialogOpen(false);
    setVoidReason('');
    setPaymentToVoid(null);
  };

  const handleVoidPayment = async () => {
    if (!voidReason.trim()) {
      return; // Don't allow empty reason
    }

    try {
      await voidPayment(paymentToVoid.id, voidReason);
      handleCloseVoidDialog();
      fetchPayments();
    } catch (error) {
      console.error('Error voiding payment:', error);
    }
  };

  const getStatusChip = (status) => {
    if (status === 'completed') {
      return <Chip label="Completed" color="success" size="small" />;
    } else if (status === 'voided') {
      return <Chip label="Voided" color="error" size="small" />;
    }
    return <Chip label={status} size="small" />;
  };

  const handleExportToExcel = () => {
    if (!payments || !payments.data || payments.data.length === 0) {
      return; // Don't export if no data
    }
    
    // Transform data for export - include only the fields you want in the Excel file
    const dataToExport = payments.data.map(payment => ({
      'Date & Time': formatDateTime(payment.created_at),
      'Reference #': `${payment.reference_number} (${formatDate(payment.payment_date) ?? ''})`,
      'Invoice #': payment.sale?.invoice_number || '',
      'Customer': payment.sale?.customer ? 
        (typeof payment.sale.customer === 'object' ? 
          payment.sale.customer.customer_name : 
          payment.sale.customer) : 
        'Walk-in Customer',
      'Method': paymentMethodDisplay(payment.payment_method),
      'Amount': payment.amount,
      'Status': payment.status,
      'Received By': typeof payment.received_by === 'object' ? 
        payment.received_by.customer_name : 
        payment.received_by || 'System'
    }));
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
    
    // Generate filename with current date
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `Payments_Export_${dateStr}.xlsx`;
    
    // Export to file
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, p: "0!important" }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Total Payments
              </Typography>
              <Typography variant="h4">{stats.total_payments || 0}</Typography>
              <Typography variant="caption" color="text.secondary">
                For the selected date range
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Total Amount
              </Typography>
              <Typography variant="h4">{formatCurrency(stats.total_amount || 0)}</Typography>
              <Typography variant="caption" color="text.secondary">
                For the selected date range
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Voided Payments
              </Typography>
              <Typography variant="h4">{stats.total_voided || 0}</Typography>
              <Typography variant="caption" color="text.secondary">
                For the selected date range
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Voided Amount
              </Typography>
              <Typography variant="h4">{formatCurrency(stats.voided_amount || 0)}</Typography>
              <Typography variant="caption" color="text.secondary">
                For the selected date range
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Field */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search by reference or invoice"
              variant="outlined"
              size="small"
              value={filters.searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} size="small">
                      <FilterOutlined />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          {/* Payment Method Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={filters.paymentMethodFilter}
                onChange={handlePaymentMethodFilterChange}
                label="Payment Method"
              >
                <MenuItem value="all">All Methods</MenuItem>
                <MenuItem value="cod">COD</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
                <MenuItem value="online">Online Payment</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Status Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="voided">Voided</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Date Range Inputs */}
          <Grid item xs={6} md={2}>
            <TextField
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <TextField
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
              inputProps={{ min: filters.startDate }}
            />
          </Grid>
          <Grid item xs={6} md={1}>
            <Button 
              variant="contained" 
              size="small" 
              fullWidth
              onClick={handleExportToExcel}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Payments Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date & Time</TableCell>
              <TableCell>Reference #</TableCell>
              <TableCell>Invoice #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Method</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Received By</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Display skeleton loader when loading
              Array(rowsPerPage)
                .fill(0)
                .map((_, index) => <TablePaymentRowSkeleton key={index} />)
            ) : payments && payments.data?.length > 0 ? (
              // Display payments data when available
              payments.data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payment) => (
                  <TableRow key={payment.id} sx={{
                    backgroundColor: payment.status === 'voided' ? '#fff8f8' : 'inherit'
                  }}>
                    <TableCell>{formatDateTime(payment.created_at)}</TableCell>
                    <TableCell>
                  {payment.payment_method === 'cheque' 
                    ? `${payment.reference_number || '-'} (${formatDate(payment.payment_date)})` 
                    : (payment.reference_number || '-')}
                </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ 
                          cursor: "pointer", 
                          color: "primary.main", 
                          '&:hover': { textDecoration: 'underline' } 
                        }}
                        onClick={() => handleViewSale(payment.sale?.id)}
                      >
                        {payment.sale?.invoice_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                {payment.sale?.customer ? 
                  (typeof payment.sale.customer === 'object' ? 
                    payment.sale.customer.customer_name : 
                    payment.sale.customer) : 
                  'Walk-in Customer'}
              </TableCell>
                    <TableCell>{paymentMethodDisplay(payment.payment_method)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>{getStatusChip(payment.status)}</TableCell>
                    <TableCell>
                  {typeof payment.received_by === 'object' ? 
                    payment.received_by.customer_name : 
                    payment.received_by || 'System'}
                </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleViewReceipt(payment)}
                        title="View Receipt"
                      >
                        <ContainerOutlined  />
                      </IconButton>

                      {(payment.status === 'pending' || payment.status === 'completed') && (
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleOpenVoidDialog(payment)}
                          title="Void Payment"
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              // Display message when no data is found
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No payments found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={payments ? payments.data?.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Receipt Dialog */}
      <Dialog 
        open={receiptDialogOpen}
        onClose={handleCloseReceiptDialog}
        maxWidth="md"
        fullWidth
      >
        <PaymentReceipt 
          paymentRecord={selectedPayment} 
          onClose={handleCloseReceiptDialog}
        />
      </Dialog>

      {/* Void Payment Dialog */}
      <Dialog 
        open={voidDialogOpen}
        onClose={handleCloseVoidDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Void Payment
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to void this payment? This action cannot be undone.
          </Typography>
          
          {paymentToVoid && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.level1', borderRadius: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Reference:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{paymentToVoid.reference_number}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Invoice:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{paymentToVoid.sale?.invoice_number}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Amount:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{formatCurrency(paymentToVoid.amount)}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Date:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{formatDate(paymentToVoid.payment_date)}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          
          <TextField
            label="Reason for voiding payment"
            fullWidth
            multiline
            rows={3}
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            required
            error={!voidReason.trim()}
            helperText={!voidReason.trim() ? 'Reason is required' : ''}
            margin="normal"
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseVoidDialog} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleVoidPayment}
              disabled={!voidReason.trim() || isLoading}
            >
              {isLoading ? 'Processing...' : 'Void Payment'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default PaymentsPage;