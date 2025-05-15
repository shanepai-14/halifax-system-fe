import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Paper, Button, Grid, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Breadcrumbs, Link, CircularProgress
} from '@mui/material';
import { HomeOutlined, TeamOutlined, ShoppingCartOutlined, LeftOutlined } from '@ant-design/icons';
import MainCard from '@components/MainCard';
import { useSales } from '@/hooks/useSales';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currencyFormat';

const CustomerPurchaseHistory = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { getCustomerPurchaseHistory } = useSales();
  
  const [loading, setLoading] = useState(true);
  const [purchaseHistory, setPurchaseHistory] = useState({
    customer: null,
    items: []
  });
  
  // Fetch purchase history when component mounts
  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        setLoading(true);
        const data = await getCustomerPurchaseHistory(customerId);
        setPurchaseHistory(data);
      } catch (error) {
        console.error('Error fetching purchase history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (customerId) {
      fetchPurchaseHistory();
    }
  }, [customerId]);

  // Group items by invoice number for better display
  const groupedItems = purchaseHistory.items.reduce((acc, item) => {
    if (!acc[item.invoice_number]) {
      acc[item.invoice_number] = {
        sale_id: item.sale_id,
        invoice_number: item.invoice_number,
        order_date: item.order_date, 
        delivery_date: item.delivery_date,
        status: item.status,
        items: []
      };
    }
    
    acc[item.invoice_number].items.push(item);
    return acc;
  }, {});
  
  // Format status for display
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
  
  // Navigate to detailed delivery report
  const handleViewDeliveryReport = (saleId) => {
    navigate(`/app/delivery-report/${saleId}`);
  };
  
  // Navigate back to customers list
  const handleBackToCustomers = () => {
    navigate('/app/customer');
  };
  
  // Calculate total purchases amount
  const totalPurchaseAmount = purchaseHistory.items.reduce((total, item) => total + parseFloat(item.total), 0);
  
  // Calculate total items purchased
  const totalItemsPurchased = purchaseHistory.items.reduce((total, item) => total + parseInt(item.quantity), 0);

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
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Customer Information */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Customer Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Name:</Typography>
                <Typography variant="body1" gutterBottom>
                  {purchaseHistory.customer?.customer_name || 'N/A'}
                </Typography>
                
                {purchaseHistory.customer?.business_name && (
                  <>
                    <Typography variant="subtitle1">Business:</Typography>
                    <Typography variant="body1" gutterBottom>
                      {purchaseHistory.customer.business_name}
                    </Typography>
                  </>
                )}
                
                <Typography variant="subtitle1">Contact Number:</Typography>
                <Typography variant="body1" gutterBottom>
                  {purchaseHistory.customer?.contact_number || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">Email:</Typography>
                <Typography variant="body1" gutterBottom>
                  {purchaseHistory.customer?.email || 'N/A'}
                </Typography>
                
                <Typography variant="subtitle1">Address:</Typography>
                <Typography variant="body1" gutterBottom>
                  {purchaseHistory.customer?.address || 'N/A'}
                </Typography>
                
                <Typography variant="subtitle1">City:</Typography>
                <Typography variant="body1" gutterBottom>
                  {purchaseHistory.customer?.city || 'N/A'}
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
                    {Object.keys(groupedItems).length}
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
          
          {/* Purchase History */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Purchase History
            </Typography>
            
            {Object.keys(groupedItems).length > 0 ? (
              Object.values(groupedItems).map((group) => (
                <Box key={group.invoice_number} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'primary.main', cursor: 'pointer' }} 
                        onClick={() => handleViewDeliveryReport(group.sale_id)}>
                        Invoice: {group.invoice_number}
                      </Typography>
                      <Typography variant="body2">
                        Order Date: {formatDate(group.order_date)} | Delivery Date: {formatDate(group.delivery_date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getStatusChip(group.status)}
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleViewDeliveryReport(group.sale_id)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Code</TableCell>
                          <TableCell align="right">Unit Price</TableCell>
                          <TableCell align="center">Quantity</TableCell>
                          <TableCell align="right">Discount</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.items.map((item) => {
                          return (
                            <TableRow key={item.item_id}>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell>{item.product_code}</TableCell>
                              <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                              <TableCell align="center">{item.quantity}</TableCell>
                              <TableCell align="right">{parseFloat(item.discount).toFixed(2)}%</TableCell>
                              <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                            </TableRow>
                          );
                        })}
                        <TableRow>
                          <TableCell colSpan={4} />
                          <TableCell align="right">
                            <Typography variant="subtitle2">Order Total:</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              {formatCurrency(group.items.reduce((sum, item) => sum + parseFloat(item.total), 0))}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Divider sx={{ my: 4 }} />
                </Box>
              ))
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No purchase history found for this customer.
                </Typography>
              </Box>
            )}
          </Paper>
        </>
      )}
    </MainCard>
  );
};

export default CustomerPurchaseHistory;