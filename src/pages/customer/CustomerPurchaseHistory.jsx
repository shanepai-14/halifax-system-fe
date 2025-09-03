import React, { useState, useEffect, useRef, useCallback } from 'react';
import {  useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, Grid, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip,
  Chip, Breadcrumbs, Link, CircularProgress, Tab, Tabs, TextField, InputAdornment
} from '@mui/material';
import { 
  HomeOutlined, 
  TeamOutlined, 
  ShoppingCartOutlined, 
  LeftOutlined,
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import MainCard from '@components/MainCard';
import api from '@/lib/axios';
import { formatDate } from '@/utils/formatUtils';
import { formatCurrency } from '@/utils/formatUtils';
import CustomerPricingPanel from './CustomerPricingPanel';
import * as XLSX from 'xlsx';

// TabPanel component for the tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const CustomerPurchaseHistory = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [displayItems, setDisplayItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const observer = useRef();
  const loadingRef = useRef();
  const products = useSelector(state => state.products.products);
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Navigate back to customers list
  const handleBackToCustomers = () => {
    navigate('/app/customer');
  };

  // Fetch data from API with pagination
  const fetchData = useCallback(async (pageNum = 1, reset = false) => {
    if (!customerId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/sales/customers/${customerId}/purchase-history?page=${pageNum}&per_page=50`);
      
      if (reset) {
        // Reset data for new searches or sorting
        setData(response.data.data);
        setDisplayItems(response.data.data.items || []);
      } else {
        // Append new items for infinite scrolling
        setData(prev => {
          if (!prev) return response.data.data;
          
          const newItems = [...prev.items, ...(response.data.data.items || [])];
          // Deduplicate items based on item_id
          const uniqueItems = Array.from(new Map(newItems.map(item => [item.item_id, item])).values());
          
          return {
            ...response.data.data,
            items: uniqueItems
          };
        });
        
        setDisplayItems(prev => {
          const newItems = [...prev, ...(response.data.data.items || [])];
          // Deduplicate items
          return Array.from(new Map(newItems.map(item => [item.item_id, item])).values());
        });
      }
      
      // Check if there are more items to load
      setHasMore(response.data.data.pagination?.has_more || false);
      setInitialLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      setInitialLoading(false);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  // Initialize infinite scroll observer
  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(nextPage);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page, fetchData]);

  // Initial data load
  useEffect(() => {
    setPage(1);
    fetchData(1, true);
  }, [customerId, fetchData]);

  // Search functionality
  useEffect(() => {
    if (!data) return;
    
    const filtered = data.items.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.invoice_number.toLowerCase().includes(searchLower) ||
        item.product_name.toLowerCase().includes(searchLower) ||
        item.total.toString().includes(searchLower) ||
        item.total_sale_amount.toString().includes(searchLower) ||
        (item.product_code && item.product_code.toLowerCase().includes(searchLower))
      );
    });
    
    setDisplayItems(filtered);
  }, [searchTerm, data]);

  // Sorting functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to display items
  useEffect(() => {
    if (!sortConfig.key || !displayItems.length) return;
    
    const sortedItems = [...displayItems].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setDisplayItems(sortedItems);
  }, [sortConfig]);

  // Export to Excel function
  const exportToExcel = () => {
    if (!displayItems.length) return;
    
    // Prepare data for export
    const exportData = displayItems.map(item => ({
      'DR Number': item.invoice_number,
      'Product': item.product_name,
      'Product Code': item.product_code || 'N/A',
      'Quantity': item.quantity,
      'Price': item.price,
      'Discount': item.discount + '%',
      'Total': item.total,
      'Date': item.order_date,
      'Status': item.status
    }));
    
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchase History');
    
    // Generate Excel file
    const customer_name = data?.customer?.customer_name || 'Customer';
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${customer_name}_Purchase_History_${date}.xlsx`);
  };

  // Show loading state
  if (initialLoading) {
    return (
      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainCard>
        <Typography variant="h5" color="error" align="center">
          Error: {error}
        </Typography>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={handleBackToCustomers}
            startIcon={<LeftOutlined />}
          >
            Back to Customers
          </Button>
        </Box>
      </MainCard>
    );
  }

  const { customer, items } = data || {};
  const ordersByInvoice = {};
  
  // Group items by invoice for the "By Orders" tab
  if (items && items.length > 0) {
    items.forEach(item => {
      if (!ordersByInvoice[item.invoice_number]) {
        ordersByInvoice[item.invoice_number] = {
          invoice_number: item.invoice_number,
          order_date: item.order_date,
          delivery_date: item.delivery_date,
          status: item.status,
          items: []
        };
      }
      ordersByInvoice[item.invoice_number].items.push(item);
    });
  }

  // Sort invoices by date (newest first)
  const sortedInvoices = Object.values(ordersByInvoice).sort((a, b) => {
    return new Date(b.order_date) - new Date(a.order_date);
  });

  // Calculate total purchases
  const totalPurchaseAmount = items ? items.reduce((total, item) => total + parseFloat(item.total), 0) : 0;
  const totalItemsPurchased = items ? items.reduce((total, item) => total + parseInt(item.quantity), 0) : 0;
  const totalOrders = sortedInvoices.length;

  return (
    <>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/app/dashboard')}
        >
          <HomeOutlined style={{ marginRight: 8 }} />
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/app/customer')}
        >
          <TeamOutlined style={{ marginRight: 8 }} />
          Customers
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCartOutlined style={{ marginRight: 8 }} />
          Purchase History
        </Typography>
      </Breadcrumbs>
      
      <Button
        variant="outlined"
        startIcon={<LeftOutlined />}
        onClick={handleBackToCustomers}
        sx={{ mb: 3 }}
      >
        Back to Customers
      </Button>
      
      {/* Customer Information */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Customer Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Name:</Typography>
            <Typography variant="body1" gutterBottom>
              {customer?.customer_name || 'N/A'}
            </Typography>
            
            {customer?.business_name && (
              <>
                <Typography variant="subtitle1">Business:</Typography>
                <Typography variant="body1" gutterBottom>
                  {customer.business_name}
                </Typography>
              </>
            )}
            
            <Typography variant="subtitle1">Contact Number:</Typography>
            <Typography variant="body1" gutterBottom>
              {customer?.contact_number || 'N/A'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Email:</Typography>
            <Typography variant="body1" gutterBottom>
              {customer?.email || 'N/A'}
            </Typography>
            
            <Typography variant="subtitle1">Address:</Typography>
            <Typography variant="body1" gutterBottom>
              {customer?.address || 'N/A'}
            </Typography>
            
            <Typography variant="subtitle1">City:</Typography>
            <Typography variant="body1" gutterBottom>
              {customer?.city || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Purchase Summary */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Purchase Summary
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Orders
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {totalOrders}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Items Purchased
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {totalItemsPurchased}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Purchase Amount
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {formatCurrency(totalPurchaseAmount)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by DR #, Product Name or Total..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Purchase History */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="purchase history tabs">
            <Tab label="All Items" id="tab-0" />
            <Tab label="By Orders" id="tab-1" />
             <Tab label="Pricing" id="tab-2" />
          </Tabs>
        </Box>
        
        {/* All Items Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignContent: 'center', mb: 1}}>
            <Typography variant="h6" gutterBottom>
              All Purchased Items
            </Typography>

            <Button
              variant="contained"
              color="success"
              size='small'
              startIcon={<FileExcelOutlined />}
              onClick={exportToExcel}
              disabled={!displayItems.length}
            >
              Export to Excel
            </Button>
          </Box>
          
          {displayItems.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell 
                      onClick={() => handleSort('invoice_number')}
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <Tooltip title="Sort by DR Number" arrow>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          DR Number
                          {sortConfig.key === 'invoice_number' && (
                            sortConfig.direction === 'asc' 
                              ? <ArrowUpOutlined style={{ marginLeft: 8 }} /> 
                              : <ArrowDownOutlined style={{ marginLeft: 8 }} />
                          )}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort('product_name')}
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <Tooltip title="Sort by Product Name" arrow>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          Product
                          {sortConfig.key === 'product_name' && (
                            sortConfig.direction === 'asc'
                              ? <ArrowUpOutlined style={{ marginLeft: 8 }} />
                              : <ArrowDownOutlined style={{ marginLeft: 8 }} />
                          )}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell 
                      onClick={() => handleSort('order_date')}
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <Tooltip title="Sort by Date" arrow>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          Date
                          {sortConfig.key === 'order_date' && (
                            sortConfig.direction === 'asc' 
                              ? <ArrowUpOutlined style={{ marginLeft: 8 }} /> 
                              : <ArrowDownOutlined style={{ marginLeft: 8 }} />
                          )}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Item Total</TableCell>
                    <TableCell align="right">Total Sale</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayItems.map((item, index) => {
                    const isLastItem = index === displayItems.length - 1;
                    return (
                      <TableRow 
                        key={item.item_id} 
                        ref={isLastItem ? lastItemRef : null}
                      >
                        <TableCell>
                          <Link
                            href="#"
                            onClick={() => navigate(`/app/delivery-report/${item.sale_id}`)}
                            sx={{ textDecoration: 'none' }}
                          >
                            {item.invoice_number}
                          </Link>
                        </TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.product_code || 'N/A'}</TableCell>
                        <TableCell>{formatDate(item.order_date)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">{parseFloat(item.discount).toFixed(2)}%</TableCell>
                        <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                         <TableCell align="right">{formatCurrency(item.total_sale_amount)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.status} 
                            color={getStatusColor(item.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No purchase history found for this customer.
              </Typography>
            </Box>
          )}
          
          {/* Loading indicator at bottom */}
          {loading && (
            <Box ref={loadingRef} sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={30} />
            </Box>
          )}
        </TabPanel>
        
        {/* By Orders Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Purchases By Order
          </Typography>
          
          {sortedInvoices.length > 0 ? (
            <>
              {sortedInvoices.map((order) => {
                const totalOrderValue = order.items.reduce((sum, item) => sum + parseFloat(item.total), 0);
                
                return (
                  <Box key={order.invoice_number} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                          <Link
                            href="#"
                            onClick={() => navigate(`/app/sales/${order.items[0].sale_id}`)}
                            sx={{ textDecoration: 'none' }}
                          >
                            DR #: {order.invoice_number}
                          </Link>
                        </Typography>
                        <Typography variant="body2">
                          Order Date: {formatDate(order.order_date)} | 
                          Delivery Date: {formatDate(order.delivery_date)}
                        </Typography>
                      </Box>
                      <Box>
                        <Chip 
                          label={order.status} 
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                    
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>Product</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Discount</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.items.map((item, itemIndex) => (
                            <TableRow key={itemIndex}>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell>{item.product_code || 'N/A'}</TableCell>
                              <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                              <TableCell align="center">{item.quantity}</TableCell>
                              <TableCell align="right">{parseFloat(item.discount).toFixed(2)}%</TableCell>
                              <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={4} />
                            <TableCell align="right">
                              <Typography variant="subtitle2">Order Total:</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="subtitle2">
                                {formatCurrency(totalOrderValue)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    <Divider sx={{ my: 4 }} />
                  </Box>
                );
              })}
            </>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No purchase orders found for this customer.
              </Typography>
            </Box>
          )}
        </TabPanel>

          <TabPanel value={tabValue} index={2}>

            <CustomerPricingPanel 
              customer={customer} 
              products={products} 
            />
          </TabPanel>
      </Paper>
     </>
  );
};

// Helper function to get chip color based on status
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    case 'partially_paid':
    case 'partially_returned':
      return 'info';
    case 'unpaid':
      return 'default';
    default:
      return 'default';
  }
};

export default CustomerPurchaseHistory;