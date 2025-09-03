import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, Grid, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Tooltip,
  Chip, Breadcrumbs, Link, CircularProgress, Tab, Tabs, TextField, InputAdornment
} from '@mui/material';
import { 
  HomeOutlined, 
  TeamOutlined, 
  ShoppingOutlined, 
  LeftOutlined,
  FileTextOutlined, 
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import MainCard from '@components/MainCard';
import api from '@/lib/axios';
import { formatDate } from '@/utils/formatUtils';
import { formatCurrency } from '@/utils/formatUtils';
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

const SupplierPurchaseHistory = () => {
  const { supplierId } = useParams();
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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Navigate back to suppliers list
  const handleBackToSuppliers = () => {
    navigate('/app/supplier');
  };

  // Fetch data from API with pagination
  const fetchData = useCallback(async (pageNum = 1, reset = false) => {
    if (!supplierId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/suppliers/${supplierId}/purchase-history?page=${pageNum}&per_page=50`);
      
      if (reset) {
        // Reset data for new searches or sorting
        setData(response.data.data);
        setDisplayItems(response.data.data.items || []);
      } else {
        // Append new items for infinite scrolling
        setData(prev => {
          if (!prev) return response.data.data;
          
          const newItems = [...prev.items, ...(response.data.data.items || [])];
          // Deduplicate items based on received_item_id
          const uniqueItems = Array.from(new Map(newItems.map(item => [item.received_item_id, item])).values());
          
          return {
            ...response.data.data,
            items: uniqueItems,
            items_by_po: response.data.data.items_by_po // Use the latest items_by_po
          };
        });
        
        setDisplayItems(prev => {
          const newItems = [...prev, ...(response.data.data.items || [])];
          // Deduplicate items
          return Array.from(new Map(newItems.map(item => [item.received_item_id, item])).values());
        });
      }
      
      setHasMore(response.data.data.pagination?.has_more || false);
      setInitialLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      setInitialLoading(false);
    } finally {
      setLoading(false);
    }
  }, [supplierId]);

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
  }, [supplierId, fetchData]);

  // Search functionality
  useEffect(() => {
    if (!data) return;
    
    const filtered = data.items.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.po_number.toLowerCase().includes(searchLower) ||
        item.product_name.toLowerCase().includes(searchLower) ||
        item.total_cost.toString().includes(searchLower) ||
        item.batch_number.toLowerCase().includes(searchLower) ||
         item.grand_total.toLowerCase().includes(searchLower) ||
        (item.product_category && item.product_category.toLowerCase().includes(searchLower))
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
      'PO Number': item.po_number,
      'Product': item.product_name,
      'Product Code': item.product_code,
      'Category': item.product_category || 'Uncategorized',
      'Date Received': item.rr_date,
      'Quantity': item.received_quantity,
      'Cost Price': item.cost_price,
      'Total': item.total_cost,
      'Payment Status': item.payment_status
    }));
    
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchase History');
    
    // Generate Excel file
    const supplier_name = data?.supplier?.supplier_name || 'Supplier';
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `${supplier_name}_Purchase_History_${date}.xlsx`);
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
            onClick={handleBackToSuppliers}
            startIcon={<LeftOutlined />}
          >
            Back to Suppliers
          </Button>
        </Box>
      </MainCard>
    );
  }

  const { supplier, stats, items_by_po } = data || {};
  const poNumbers = items_by_po ? Object.keys(items_by_po).sort((a, b) => {
    const dateA = items_by_po[a][0]?.po_date;
    const dateB = items_by_po[b][0]?.po_date;
    return new Date(dateB) - new Date(dateA);
  }) : [];

  return (
    <>
      {/* Breadcrumbs navigation */}
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
          onClick={() => navigate('/app/supplier')}
        >
          <TeamOutlined style={{ marginRight: 8 }} />
          Suppliers
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          Purchase History
        </Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<LeftOutlined />}
          onClick={handleBackToSuppliers}
        >
          Back to Suppliers
        </Button>
        

      </Box>
      
      {/* Supplier Information */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Supplier Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Name:</Typography>
            <Typography variant="body1" gutterBottom>
              {supplier?.supplier_name || 'N/A'}
            </Typography>
            
            <Typography variant="subtitle1">Contact Person:</Typography>
            <Typography variant="body1" gutterBottom>
              {supplier?.contact_person || 'N/A'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Email:</Typography>
            <Typography variant="body1" gutterBottom>
              {supplier?.email || 'N/A'}
            </Typography>
            
            <Typography variant="subtitle1">Phone:</Typography>
            <Typography variant="body1" gutterBottom>
              {supplier?.phone || 'N/A'}
            </Typography>
            
            <Typography variant="subtitle1">Address:</Typography>
            <Typography variant="body1" gutterBottom>
              {supplier?.address || 'N/A'}
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
          <Grid item xs={12} sm={3}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Orders
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {stats?.total_orders || 0}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Items
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {stats?.total_items || 0}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Quantity
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {stats?.total_quantity || 0}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Value
              </Typography>
              <Typography variant="h4" sx={{ my: 1 }}>
                {formatCurrency(stats?.total_value || 0)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by DR #, Product Name, Category or Total..."
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
            <Tab label="By Purchase Order" id="tab-1" />
          </Tabs>
        </Box>
        
        {/* All Items Tab */}
        <TabPanel value={tabValue} index={0}>
       <Box sx={{display : 'flex', justifyContent:'space-between' , alignContent: 'center', mb:1}}>
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
                      onClick={() => handleSort('po_number')}
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        <Tooltip title="Sort by PO Number" arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        PO Number
                        {sortConfig.key === 'po_number' && (
                          sortConfig.direction === 'asc' 
                            ? <ArrowUpOutlined style={{ marginLeft: 8 }} /> 
                            : <ArrowDownOutlined style={{ marginLeft: 8 }} />
                        )}
                      </Box>
                      </Tooltip>
                    </TableCell>
                                        <TableCell 
                      onClick={() => handleSort('batch_number')}
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        <Tooltip title="Sort by Batch #" arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Batch #
                        {sortConfig.key === 'batch_number' && (
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
                      onClick={() => handleSort('product_category')}
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        <Tooltip title="Sort by Category" arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Category
                        {sortConfig.key === 'product_category' && (
                          sortConfig.direction === 'asc' 
                            ? <ArrowUpOutlined style={{ marginLeft: 8 }} /> 
                            : <ArrowDownOutlined style={{ marginLeft: 8 }} />
                        )}
                      </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell 
                      onClick={() => handleSort('rr_date')}
                      sx={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        <Tooltip title="Sort by Date" arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Date
                        {sortConfig.key === 'rr_date' && (
                          sortConfig.direction === 'asc' 
                            ? <ArrowUpOutlined style={{ marginLeft: 8 }} /> 
                            : <ArrowDownOutlined style={{ marginLeft: 8 }} />
                        )}
                      </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Cost Price</TableCell>
                    <TableCell align="right">Item Total</TableCell>
                    <TableCell align="right">Grand Total</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayItems.map((item, index) => {
                    const isLastItem = index === displayItems.length - 1;
                    return (
                      <TableRow 
                        key={item.received_item_id} 
                        ref={isLastItem ? lastItemRef : null}
                      >
                        <TableCell>
                          <Link
                            href="#"
                            onClick={() => navigate(`/app/purchase/${item.po_number}/edit`)}
                            sx={{ textDecoration: 'none' }}
                          >
                            {item.po_number}
                          </Link>
                        </TableCell>
                         <TableCell>{item.batch_number}</TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.product_code}</TableCell>
                        <TableCell>{item.product_category || 'Uncategorized'}</TableCell>
                        <TableCell>{formatDate(item.rr_date)}</TableCell>
                        <TableCell align="right">{item.received_quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.cost_price)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.total_cost)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.grand_total)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.payment_status} 
                            color={item.payment_status === 'Paid' ? 'success' : 'error'}
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
                No purchase history found for this supplier.
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
        
        {/* By Purchase Order Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Purchases By Order
          </Typography>
          
          {poNumbers.length > 0 ? (
            <>
              {poNumbers.map((poNumber) => {
                const poItems = items_by_po[poNumber];
                const firstItem = poItems[0];
                const totalPOValue = poItems.reduce((sum, item) => sum + item.total_cost, 0);
                
                return (
                  <Box key={poNumber} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                          <Link
                            href="#"
                            onClick={() => navigate(`/app/purchase/${poNumber}/edit`)}
                            sx={{ textDecoration: 'none' }}
                          >
                            PO #: {poNumber}
                          </Link>
                        </Typography>
                        <Typography variant="body2">
                          Date: {formatDate(firstItem.po_date)} | 
                          Batch #: {firstItem.batch_number} | 
                          Invoice: {firstItem.invoice !== 'N/A' ? firstItem.invoice : 'Not Available'}
                        </Typography>
                      </Box>
                      <Box>
                        <Chip 
                          label={firstItem.payment_status} 
                          color={firstItem.payment_status === 'Paid' ? 'success' : 'error'}
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
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Cost Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {poItems.map((item, itemIndex) => (
                            <TableRow key={itemIndex}>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell>{item.product_code}</TableCell>
                              <TableCell>{item.product_category || 'Uncategorized'}</TableCell>
                              <TableCell align="right">{item.received_quantity}</TableCell>
                              <TableCell align="right">{formatCurrency(item.cost_price)}</TableCell>
                              <TableCell align="right">{formatCurrency(item.total_cost)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={4} />
                            <TableCell align="right">
                              <Typography variant="subtitle2">Order Total:</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="subtitle2">
                                {formatCurrency(totalPOValue)}
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
                No purchase orders found for this supplier.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>
    </>
  );
};

export default SupplierPurchaseHistory;