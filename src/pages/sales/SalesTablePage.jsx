import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Container, TablePagination, Button, TextField, Box, Chip,
  InputAdornment, Grid, FormControl, InputLabel, Select, MenuItem,
  IconButton, Card, CardContent,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';

import { 
  SearchOutlined, 
  PlusOutlined, 
  FilterOutlined, 
} from '@ant-design/icons';
import { 
    selectSalesFilters, 
    setSearchTerm, 
    setStatusFilter, 
    setDeliveredFilter, 
    setDateRange 
  } from '@/store/slices/salesSlice'
import { useSales } from '@/hooks/useSales';
import { formatDate } from '@/utils/formatUtils';
import { formatCurrency } from '@/utils/formatUtils';
import TableSalesRowSkeleton from '@/components/loader/TableSalesRowSkeleton';


const SalesTablePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const filters = useSelector(selectSalesFilters);
  const { 
    sales, 
    getAllSales,
    getSalesStats 
  } = useSales();

  // State for table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading , setLoading] = useState(true);
  
  // State for sales statistics
  const [stats, setStats] = useState({
    total_sales: 0,
    total_revenue: 0,
    total_profit: 0
  });
  
  // Load sales on component mount and when filters change
  useEffect(() => {
    fetchSales();
  }, [filters.statusFilter, filters.deliveredFilter, filters.startDate, filters.endDate]);

  // Function to fetch sales with filters
  const fetchSales = async () => {
    setLoading(true);
    const apiFilters = {
      status: filters.statusFilter !== 'all' ? filters.statusFilter : undefined,
      is_delivered: filters.deliveredFilter !== 'all' ? (filters.deliveredFilter === 'true') : undefined,
      date_from: filters.startDate || undefined,
      date_to: filters.endDate || undefined,
      search: filters.searchTerm || undefined
    };

    await getAllSales(apiFilters);
    
    // Also fetch statistics based on the same date range
    const statsFilters = {
      date_from: apiFilters.date_from,
      date_to: apiFilters.date_to
    };
    
    const statsData = await getSalesStats(statsFilters);
    if (statsData) {
      setStats(statsData);
    }
    setLoading(false);
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
    setPage(0);
    fetchSales();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusFilterChange = (e) => {
    dispatch(setStatusFilter(e.target.value));
  };

  const handleDeliveredFilterChange = (e) => {
    dispatch(setDeliveredFilter(e.target.value));
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

  const handleCreateSale = () => {
    navigate('/app/sales');
  };

  const handleViewSale = (saleId) => {
    navigate(`/app/delivery-report/${saleId}`);
  };
  
  const handleExportExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Format the data for Excel
    const formattedData = sales.map(sale => ({
      'DR #': sale.invoice_number,
      'Customer': sale.customer ? sale.customer.customer_name : 'Walk-in Customer',
      'Business': sale.customer?.business_name || '-',
      'Status': sale.status,
      'Payment Method': sale.payment_method,
      'Order Date': formatDate(sale.order_date),
      'Delivery Date': formatDate(sale.delivery_date),
      'City': sale.city || '-',
      'Total': sale.total,
      'Received': sale.amount_received,
      'Delivered': sale.is_delivered ? 'YES' : 'NO'
    }));
    
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `Sales_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getStatusChip = (status) => {
    let color;
    switch (status) {
      case 'completed':
        color = 'success';
        break;
      case 'pending':
        color = 'warning';
        break;
      case 'cancelled':
        color = 'error';
        break;
      case 'partially_paid':
        color = 'info';
        break;
      case 'unpaid':
        color = 'default';
        break;
      default:
        color = 'default';
    }
    return (
      <Chip 
        label={status.replace('_', ' ').toUpperCase()}
        color={color}
        size="small"
      />
    );
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, p: "0!important" }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Total Sales
              </Typography>
              <Typography variant="h4">{stats.total_sales || 0}</Typography>
              <Typography variant="caption" color="text.secondary">
                For the selected date range
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Total Revenue
              </Typography>
              <Typography variant="h4">{formatCurrency(stats.total_revenue || 0)}</Typography>
              <Typography variant="caption" color="text.secondary">
                For the selected date range
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Total Profit
              </Typography>
              <Typography variant="h4">{formatCurrency(stats.total_profit || 0)}</Typography>
              <Typography variant="caption" color="text.secondary">
                For the selected date range
              </Typography>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
      
      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Field */}
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              placeholder="Search by DR number"
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
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="partially_paid">Partially Paid</MenuItem>
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Delivery Status Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Delivery Status</InputLabel>
              <Select
                value={filters.deliveredFilter}
                onChange={handleDeliveredFilterChange}
                label="Delivery Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Delivered</MenuItem>
                <MenuItem value="false">Not Delivered</MenuItem>
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
          
          {/* Create Sale Button */}
          <Grid item xs={12} md={2} display={'flex'}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlusOutlined />}
              onClick={handleCreateSale}
              fullWidth
            >
              Sale
            </Button>
            <IconButton 
              color="primary"
              onClick={handleExportExcel}
              size="medium"
              sx={{ border: '1px solid', borderColor: 'primary.main', ml:1 }}
              title="Export to Excel"
            >
              <DownloadIcon />
            </IconButton>
          </Grid>

        {/* <Grid item xs={6} md={1}>

          </Grid> */}
        </Grid>
      </Box>
      
      
      {/* Sales Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>DR #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>City</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Received</TableCell>
              <TableCell>Delivered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Display skeleton loader when loading
              Array(rowsPerPage)
                .fill(0)
                .map((_, index) => <TableSalesRowSkeleton key={index}  />)
            ) : sales && sales.length > 0 ? (
              // Display sales data when available
              sales
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sale) => (
                  <TableRow key={sale.id}>
                   <TableCell>
                    <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                        onClick={() => handleViewSale(sale.id)}
                    >
                        {sale.invoice_number}
                    </Typography>
                    </TableCell>
                    <TableCell>
                      {sale.customer ? (
                        <>
                          {sale.customer.customer_name}
                          {sale.customer.business_name && (
                            <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                              {sale.customer.business_name}
                            </Typography>
                          )}
                        </>
                      ) : 'Walk-in Customer'}
                    </TableCell>
                    <TableCell>{getStatusChip(sale.status)}</TableCell>
                    <TableCell>
                      {sale.payment_method.toUpperCase()}
                    </TableCell>
                    <TableCell>{formatDate(sale.order_date)}</TableCell>
                    <TableCell>{formatDate(sale.delivery_date)}</TableCell>
                    <TableCell>{sale.city || '-'}</TableCell>
                    <TableCell align="right">{formatCurrency(sale.total)}</TableCell>
                    <TableCell align="right">{formatCurrency(sale.amount_received)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={sale.is_delivered ? 'YES' : 'NO'}
                        color={sale.is_delivered ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              // Display message when no data is found
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No sales found
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
        count={sales ? sales.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default SalesTablePage;