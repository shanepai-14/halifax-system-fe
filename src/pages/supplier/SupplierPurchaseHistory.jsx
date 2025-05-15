import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, Grid, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Breadcrumbs, Link, CircularProgress, Tab, Tabs
} from '@mui/material';
import { 
  HomeOutlined, 
  TeamOutlined, 
  ShoppingOutlined, 
  LeftOutlined,
  FileTextOutlined 
} from '@ant-design/icons';
import MainCard from '@components/MainCard';
import { useSupplierPurchaseHistory } from '@/hooks/useSuppliers';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currencyFormat';

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
  const { data, isLoading, isError, error } = useSupplierPurchaseHistory(supplierId);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Navigate back to suppliers list
  const handleBackToSuppliers = () => {
    navigate('/app/supplier');
  };

  // Show loading state
  if (isLoading) {
    return (
      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  // Show error state
  if (isError) {
    return (
      <MainCard>
        <Typography variant="h5" color="error" align="center">
          Error: {error.message || 'Failed to load supplier purchase history'}
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

  const { supplier, stats, items, items_by_po } = data || {};

  // Prepare a sorted array of PO numbers for display
  const poNumbers = items_by_po ? Object.keys(items_by_po).sort((a, b) => {
    // Get the first item from each PO to compare dates (newest first)
    const dateA = items_by_po[a][0]?.po_date;
    const dateB = items_by_po[b][0]?.po_date;
    return new Date(dateB) - new Date(dateA);
  }) : [];

  return (
    <MainCard>
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
      
      <Button
        variant="outlined"
        startIcon={<LeftOutlined />}
        onClick={handleBackToSuppliers}
        sx={{ mb: 3 }}
      >
        Back to Suppliers
      </Button>
      
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
          <Typography variant="h6" gutterBottom>
            All Purchased Items
          </Typography>
          
          {items && items.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>PO Number</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Date Received</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Cost Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Link
                          href="#"
                          onClick={() => navigate(`/app/purchase/${item.po_number}/edit`)}
                          sx={{ textDecoration: 'none' }}
                        >
                          {item.po_number}
                        </Link>
                      </TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.product_code}</TableCell>
                      <TableCell>{formatDate(item.rr_date)}</TableCell>
                      <TableCell align="right">{item.received_quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.cost_price)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.total_cost)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.payment_status} 
                          color={item.payment_status === 'Paid' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
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
                              <TableCell align="right">{item.received_quantity}</TableCell>
                              <TableCell align="right">{formatCurrency(item.cost_price)}</TableCell>
                              <TableCell align="right">{formatCurrency(item.total_cost)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} />
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
    </MainCard>
  );
};

export default SupplierPurchaseHistory;