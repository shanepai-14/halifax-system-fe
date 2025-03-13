import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Skeleton
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Edit as EditIcon, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Add as AddIcon } from '@mui/icons-material';
import moment from 'moment';

// Import custom hooks
import { 
  useProductPriceHistory, 
  useCurrentProductPrice, 
  useCreateProductPrice, 
  useUpdateProductPrice, 
  useSetActiveProductPrice, 
  useDeleteProductPrice 
} from '@/hooks/useProductPricing';

const ProductPricing = ({ productId, productName }) => {
  // State for dialog controls
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    product_id: productId,
    regular_price: '',
    wholesale_price: '',
    walk_in_price: '',
    effective_from: moment().format('YYYY-MM-DD'),
    effective_to: null,
    is_active: true
  });

  // Create refresh function for all data
  const priceHistoryResult = useProductPriceHistory(productId);
  const currentPriceResult = useCurrentProductPrice(productId);
  
  const refreshData = useCallback(() => {
    priceHistoryResult.refetch();
    currentPriceResult.refetch();
  }, [priceHistoryResult, currentPriceResult]);

  // Mutations
  const createPriceMutation = useCreateProductPrice();
  const updatePriceMutation = useUpdateProductPrice();
  const setActivePriceMutation = useSetActiveProductPrice();
  const deletePriceMutation = useDeleteProductPrice();

  // Destructuring results for easier access
  const { 
    data: priceHistoryData, 
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    error: historyError 
  } = priceHistoryResult;
  
  const { 
    data: currentPrice, 
    isLoading: isLoadingCurrentPrice,
    isError: isErrorCurrentPrice,
    error: currentPriceError 
  } = currentPriceResult;

  // Derived state
  const prices = useMemo(() => {
    if (!priceHistoryData || !priceHistoryData.prices) return [];
    return priceHistoryData.prices.data || [];
  }, [priceHistoryData]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!prices.length) return [];
    
    // Sort by effective_from date
    const sortedPrices = [...prices].sort((a, b) => 
      new Date(a.effective_from) - new Date(b.effective_from)
    );

    return sortedPrices.map(price => ({
      date: moment(price.effective_from).format('MMM DD, YYYY'),
      regular: parseFloat(price.regular_price),
      wholesale: parseFloat(price.wholesale_price),
      walkIn: parseFloat(price.walk_in_price),
    }));
  }, [prices]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      product_id: productId,
      regular_price: '',
      wholesale_price: '',
      walk_in_price: '',
      effective_from: moment().format('YYYY-MM-DD'),
      effective_to: null,
      is_active: true
    });
    setSelectedPrice(null);
  };

  // Form handlers
  const handleCreatePrice = async () => {
    try {
      await createPriceMutation.mutateAsync(formData);
      setOpenCreateDialog(false);
      resetForm();
      refreshData(); // Refresh the data after successful creation
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleEditPrice = async () => {
    try {
      await updatePriceMutation.mutateAsync({ 
        id: selectedPrice.id, 
        data: formData 
      });
      setOpenEditDialog(false);
      resetForm();
      refreshData(); // Refresh the data after successful update
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleActivatePrice = async () => {
    try {
      await setActivePriceMutation.mutateAsync({ 
        id: selectedPrice.id,
        productId
      });
      setOpenActivateDialog(false);
      refreshData(); // Refresh the data after successful activation
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeletePrice = async () => {
    try {
      await deletePriceMutation.mutateAsync({ 
        id: selectedPrice.id,
        productId
      });
      setOpenDeleteDialog(false);
      refreshData(); // Refresh the data after successful deletion
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  // Open dialog handlers
  const openEdit = (price) => {
    setSelectedPrice(price);
    setFormData({
      product_id: productId,
      regular_price: price.regular_price,
      wholesale_price: price.wholesale_price,
      walk_in_price: price.walk_in_price,
      effective_from: moment(price.effective_from).format('YYYY-MM-DD'),
      effective_to: price.effective_to ? moment(price.effective_to).format('YYYY-MM-DD') : null,
      is_active: price.is_active
    });
    setOpenEditDialog(true);
  };

  const openActivate = (price) => {
    setSelectedPrice(price);
    setOpenActivateDialog(true);
  };

  const openDelete = (price) => {
    setSelectedPrice(price);
    setOpenDeleteDialog(true);
  };

  // Error states
  if (isErrorHistory || isErrorCurrentPrice) {
    return (
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#FFF3F3' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Pricing Data
        </Typography>
        <Typography>
          {historyError?.message || currentPriceError?.message || 'Failed to load pricing data'}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={refreshData}
        >
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Product name heading */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {productName} - Pricing Management
      </Typography>

      {/* Current Price Card */}
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="Current Active Price" 
          subheader={isLoadingCurrentPrice ? 'Loading...' : (
            currentPrice ? `Effective from ${moment(currentPrice.effective_from).format('MMM DD, YYYY')}` : 'No active price'
          )} 
        />
        <CardContent>
          {isLoadingCurrentPrice ? (
            <Grid container spacing={2}>
              {[...Array(4)].map((_, i) => (
                <Grid item xs={3} key={i}>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="40%" height={40} />
                </Grid>
              ))}
            </Grid>
          ) : currentPrice ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle1" color="text.secondary">Regular Price</Typography>
                <Typography variant="h6">₱{parseFloat(currentPrice.regular_price).toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle1" color="text.secondary">Wholesale Price</Typography>
                <Typography variant="h6">₱{parseFloat(currentPrice.wholesale_price).toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle1" color="text.secondary">Walk-in Price</Typography>
                <Typography variant="h6">₱{parseFloat(currentPrice.walk_in_price).toFixed(2)}</Typography>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>No active price set for this product</Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 1 }}
                onClick={() => setOpenCreateDialog(true)}
                startIcon={<AddIcon />}
              >
                Add Price Now
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Price History Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Price History</Typography>
        {isLoadingHistory ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skeleton variant="rectangular" width="100%" height={280} />
          </Box>
        ) : chartData.length > 0 ? (
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `₱${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="regular" name="Regular Price" stroke="#8884d8" />
                <Line type="monotone" dataKey="wholesale" name="Wholesale Price" stroke="#82ca9d" />
                <Line type="monotone" dataKey="walkIn" name="Walk-in Price" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f9f9f9' }}>
            <Typography color="text.secondary">No price history available</Typography>
            <Button 
              variant="outlined" 
              sx={{ mt: 1 }}
              onClick={() => setOpenCreateDialog(true)}
            >
              Create First Price
            </Button>
          </Box>
        )}
      </Paper>

      {/* Price History Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Price Records</Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />} 
            onClick={() => setOpenCreateDialog(true)}
            disabled={createPriceMutation.isLoading}
          >
            Add New Price
          </Button>
        </Box>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Effective From</TableCell>
                <TableCell>Effective To</TableCell>
                <TableCell>Regular Price</TableCell>
                <TableCell>Wholesale Price</TableCell>
                <TableCell>Walk-in Price</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingHistory ? (
                [...Array(3)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(7)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : prices.length > 0 ? (
                prices.map((price) => (
                  <TableRow key={price.id} hover>
                    <TableCell>
                      {price.is_active ? (
                        <Chip label="Active" color="success" size="small" />
                      ) : (
                        <Chip label="Inactive" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{moment(price.effective_from).format('MMM DD, YYYY')}</TableCell>
                    <TableCell>
                      {price.effective_to 
                        ? moment(price.effective_to).format('MMM DD, YYYY')
                        : 'No end date'
                      }
                    </TableCell>
                    <TableCell>₱{parseFloat(price.regular_price).toFixed(2)}</TableCell>
                    <TableCell>₱{parseFloat(price.wholesale_price).toFixed(2)}</TableCell>
                    <TableCell>₱{parseFloat(price.walk_in_price).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => openEdit(price)}
                        title="Edit"
                        disabled={updatePriceMutation.isLoading}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {!price.is_active && (
                        <IconButton 
                          size="small"
                          color="success"
                          onClick={() => openActivate(price)}
                          title="Set as Active"
                          disabled={setActivePriceMutation.isLoading}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => openDelete(price)}
                        title="Delete"
                        disabled={deletePriceMutation.isLoading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No price records found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Dialog */}
      <Dialog open={openCreateDialog} onClose={() => !createPriceMutation.isLoading && setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Price</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="regular_price"
                label="Regular Price"
                type="number"
                value={formData.regular_price}
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="wholesale_price"
                label="Wholesale Price"
                type="number"
                value={formData.wholesale_price}
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="walk_in_price"
                label="Walk-in Price"
                type="number"
                value={formData.walk_in_price}
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="effective_from"
                label="Effective From"
                type="date"
                value={formData.effective_from}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="effective_to"
                label="Effective To (Optional)"
                type="date"
                value={formData.effective_to || ''}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenCreateDialog(false)} 
            disabled={createPriceMutation.isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePrice} 
            variant="contained" 
            color="primary"
            disabled={createPriceMutation.isLoading}
          >
            {createPriceMutation.isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => !updatePriceMutation.isLoading && setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Price</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="regular_price"
                label="Regular Price"
                type="number"
                value={formData.regular_price}
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="wholesale_price"
                label="Wholesale Price"
                type="number"
                value={formData.wholesale_price}
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="walk_in_price"
                label="Walk-in Price"
                type="number"
                value={formData.walk_in_price}
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="effective_from"
                label="Effective From"
                type="date"
                value={formData.effective_from}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="effective_to"
                label="Effective To (Optional)"
                type="date"
                value={formData.effective_to || ''}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenEditDialog(false)} 
            disabled={updatePriceMutation.isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditPrice} 
            variant="contained" 
            color="primary"
            disabled={updatePriceMutation.isLoading}
          >
            {updatePriceMutation.isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activate Dialog */}
      <Dialog open={openActivateDialog} onClose={() => !setActivePriceMutation.isLoading && setOpenActivateDialog(false)}>
        <DialogTitle>Set Price as Active</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to set this price as active? This will deactivate any other active prices for this product.
          </DialogContentText>
          {selectedPrice && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f9ff', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Price Details:</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2">Regular Price:</Typography>
                  <Typography variant="body1" fontWeight="bold">₱{parseFloat(selectedPrice.regular_price).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Wholesale Price:</Typography>
                  <Typography variant="body1" fontWeight="bold">₱{parseFloat(selectedPrice.wholesale_price).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Walk-in Price:</Typography>
                  <Typography variant="body1" fontWeight="bold">₱{parseFloat(selectedPrice.walk_in_price).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">Effective From:</Typography>
                  <Typography variant="body1">{moment(selectedPrice.effective_from).format('MMM DD, YYYY')}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenActivateDialog(false)} 
            disabled={setActivePriceMutation.isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleActivatePrice} 
            variant="contained" 
            color="success"
            disabled={setActivePriceMutation.isLoading}
          >
            {setActivePriceMutation.isLoading ? 'Setting Active...' : 'Set Active'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => !deletePriceMutation.isLoading && setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Price</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this price record? This action cannot be undone.
          </DialogContentText>
          {selectedPrice && selectedPrice.is_active && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3f3', borderRadius: 1 }}>
              <Typography color="error" variant="subtitle2">
                Warning: This is the currently active price. Deleting it may affect product pricing.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)} 
            disabled={deletePriceMutation.isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeletePrice} 
            variant="contained" 
            color="error"
            disabled={deletePriceMutation.isLoading}
          >
            {deletePriceMutation.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductPricing;