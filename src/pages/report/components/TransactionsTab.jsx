import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Container, TablePagination, Button, TextField, Box, Chip,
  InputAdornment, Grid, FormControl, InputLabel, Select, MenuItem,
  IconButton, Card, CardContent, TableSortLabel, CircularProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import * as XLSX from 'xlsx';

import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currencyFormat';
import TableSalesRowSkeleton from '@/components/loader/TableSalesRowSkeleton';
import { useProfitReport } from '@/hooks/useProfitReport';

const TransactionsTab = () => {
  const navigate = useNavigate();
  
  // Get custom hook
  const { 
    loading, 
    error, 
    profitData, 
    fetchAllProfitData, 
    filterSalesByDateRange 
  } = useProfitReport();
  
  // States for UI
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('order_date');
  const [order, setOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSales, setFilteredSales] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  // Initialize component
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setEndDate(today);
    
    initializeData();
  }, []);

  // Initialize data with custom hook
  const initializeData = async () => {
    const data = await fetchAllProfitData();
    if (data) {
      setFilteredSales(data.sales);
    }
  };

  // Apply filters when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      handleDateRangeFilter();
    }
  }, [startDate, endDate]);

  // Filter by date range
  const handleDateRangeFilter = async () => {
    if (!startDate || !endDate) return;
    
    const data = await filterSalesByDateRange(startDate, endDate);
    if (data) {
      setFilteredSales(applyFilters(data.sales));
    }
  };

  // Apply UI filters (search, status, payment method)
  const applyFilters = (sales) => {
    if (!sales) return [];
    
    let filtered = [...sales];
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(sale => 
        (sale.invoice_number && sale.invoice_number.toLowerCase().includes(search)) ||
        (sale.customer && sale.customer.customer_name && sale.customer.customer_name.toLowerCase().includes(search))
      );
    }
    
    // Apply payment method filter
    if (paymentMethodFilter !== 'all') {
      filtered = filtered.filter(sale => sale.payment_method === paymentMethodFilter);
    }
    
    return filtered;
  };

  // Handle manual search
  const handleSearch = () => {
    setFilteredSales(applyFilters(profitData.sales));
    setPage(0);
  };

  // Handle keypress for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setFilteredSales(applyFilters(profitData.sales.filter(
      sale => e.target.value === 'all' || sale.status === e.target.value
    )));
    setPage(0);
  };

  // Handle payment method filter change
  const handlePaymentMethodFilterChange = (e) => {
    setPaymentMethodFilter(e.target.value);
    setFilteredSales(applyFilters(profitData.sales.filter(
      sale => e.target.value === 'all' || sale.payment_method === e.target.value
    )));
    setPage(0);
  };

  // Table sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort function
  const sortedData = React.useMemo(() => {
    return [...filteredSales].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      // Handle nested properties
      if (orderBy === 'customer_name') {
        aValue = a.customer ? a.customer.customer_name : '';
        bValue = b.customer ? b.customer.customer_name : '';
      }
      
      // Convert strings to lowercase for case-insensitive sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      // Handle date sorting
      if (orderBy === 'order_date') {
        aValue = new Date(a.order_date).getTime();
        bValue = new Date(b.order_date).getTime();
      }
      
      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredSales, orderBy, order]);

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Export to Excel
  const handleExportExcel = () => {
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Format the data
    const formattedData = filteredSales.map(sale => ({
      'Invoice #': sale.invoice_number,
      'Customer': sale.customer ? sale.customer.customer_name : 'Walk-in Customer',
      'Date': formatDate(sale.order_date),
      'Status': sale.status,
      'Payment Method': sale.payment_method,
      'Total': sale.total || 0,
      'COGS': sale.cogs || 0,
      'Profit': sale.profit || 0,
      'Profit Margin (%)': sale.total ? ((sale.profit / sale.total) * 100).toFixed(2) : 0
    }));
    
    // Create worksheet and add to workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions Report');
    
    // Generate Excel file
    XLSX.writeFile(workbook, `Transactions_Report_${startDate}_to_${endDate}.xlsx`);
  };

  // Render table header
  const renderTableHeader = (id, label, numeric = false) => {
    return (
      <TableCell
        align={numeric ? 'right' : 'left'}
        sortDirection={orderBy === id ? order : false}
      >
        <TableSortLabel
          active={orderBy === id}
          direction={orderBy === id ? order : 'asc'}
          onClick={() => handleRequestSort(id)}
        >
          {label}
        </TableSortLabel>
      </TableCell>
    );
  };

  return (
    <Box>
           {/* Summary Footer */}
      {filteredSales.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Records
                </Typography>
                <Typography variant="h6">
                  {filteredSales.length}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Revenue
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(filteredSales.reduce((sum, sale) => sum + Number(sale.total || 0), 0))}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total COGS
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(filteredSales.reduce((sum, sale) => sum + Number(sale.cogs || 0), 0))}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Profit
                </Typography>
                <Typography 
                  variant="h6"
                  sx={{ 
                    color: filteredSales.reduce((sum, sale) => sum + Number(sale.profit || 0), 0) > 0 ? 'success.main' : 'error.main'
                  }}
                >
                  {formatCurrency(filteredSales.reduce((sum, sale) => sum + Number(sale.profit || 0), 0))}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
      {/* Filters & Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Search Field */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search by invoice or customer"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearch} size="small">
                        <FilterListIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            {/* Date Range Inputs */}
            <Grid item xs={6} md={2}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
            </Grid>
            
            <Grid item xs={6} md={2}>
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
                inputProps={{ min: startDate }}
              />
            </Grid>
            
            {/* Status Filter */}
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="all_except_cancelled">All Except Cancelled</MenuItem>
                  <MenuItem value="active">Active Sales</MenuItem>
                  <MenuItem value="paid">Paid Sales</MenuItem>
                  <MenuItem value="unpaid">Unpaid Sales</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="partially_paid">Partially Paid</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="returned">Returned</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Payment Method Filter */}
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethodFilter}
                  onChange={handlePaymentMethodFilterChange}
                  label="Payment Method"
                >
                  <MenuItem value="all">All Methods</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="cod">COD</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="term">Term</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Export Button */}
            <Grid item xs={12} md={1}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleExportExcel}
                startIcon={<DownloadIcon />}
                disabled={loading || filteredSales.length === 0}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {renderTableHeader('invoice_number', 'Invoice #')}
              {renderTableHeader('customer_name', 'Customer')}
              {renderTableHeader('order_date', 'Date')}
              {renderTableHeader('status', 'Status')}
              {renderTableHeader('payment_method', 'Payment Method')}
              {renderTableHeader('total', 'Revenue', true)}
              {renderTableHeader('cogs', 'COGS', true)}
              {renderTableHeader('profit', 'Profit', true)}
              <TableCell align="right">Margin %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Display skeleton loader when loading
              Array(rowsPerPage)
                .fill(0)
                .map((_, index) => <TableSalesRowSkeleton key={index} />)
            ) : sortedData.length > 0 ? (
              // Display sales data when available
              sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sale) => {
                  const profitMargin = sale.total && sale.total > 0 
                    ? ((sale.profit / sale.total) * 100).toFixed(2) 
                    : 0;
                  
                  return (
                    <TableRow 
                      key={sale.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => navigate(`/app/delivery-report/${sale.id}`)}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{ color: "primary.main" }}
                        >
                          {sale.invoice_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {sale.customer ? sale.customer.customer_name : 'Walk-in Customer'}
                          </Typography>
                          {sale.customer?.business_name && (
                            <Typography variant="caption" color="text.secondary">
                              {sale.customer.business_name}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(sale.order_date)}</TableCell>
                      <TableCell>
                        <Chip
                          label={sale.status.replace('_', ' ').toUpperCase()}
                          color={
                            sale.status === 'completed' ? 'success' :
                            sale.status === 'pending' ? 'warning' :
                            sale.status === 'cancelled' ? 'error' :
                            sale.status === 'partially_paid' ? 'info' :
                            'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={sale.payment_method.toUpperCase()}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(sale.total || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(sale.cogs || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          fontWeight="bold"
                          sx={{ 
                            color: (sale.profit || 0) > 0 ? 'success.main' : 
                                  (sale.profit || 0) < 0 ? 'error.main' : 'text.primary'
                          }}
                        >
                          {formatCurrency(sale.profit || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2"
                          sx={{ 
                            color: profitMargin > 0 ? 'success.main' : 
                                  profitMargin < 0 ? 'error.main' : 'text.primary'
                          }}
                        >
                          {profitMargin}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
            ) : (
              // Display message when no data is found
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {error ? `Error: ${error}` : 'No transactions found for the selected filters'}
                    </Typography>
                    {!error && (
                      <Typography variant="caption" color="text.secondary">
                        Try adjusting your date range or filters
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={filteredSales ? filteredSales.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: 1, borderColor: 'divider' }}
      />
      
 
    </Box>
  );
};

export default TransactionsTab;