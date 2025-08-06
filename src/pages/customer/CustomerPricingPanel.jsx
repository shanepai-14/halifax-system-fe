import React, { useState, useEffect, useMemo } from 'react';
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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Tooltip,
  Autocomplete,
  Divider,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  ClearOutlined
} from '@ant-design/icons';
import api from '@/lib/axios';
import { toast } from 'sonner';

const CustomerPricingPanel = ({ customer, products = [] }) => {
  const [customPrices, setCustomPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // For multiple price tiers
  const [priceTiers, setPriceTiers] = useState([{
    id: Date.now(),
    min_quantity: 5,
    max_quantity: '',
    price: ''
  }]);
  
  const [selectedProductForDialog, setSelectedProductForDialog] = useState(null);

  useEffect(() => {
    if (customer?.is_valued_customer) {
      loadCustomPrices();
    }
  }, [customer]);

  const loadCustomPrices = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/customers/${customer.id}/custom-prices`);
      setCustomPrices(response.data.data || []);
    } catch (error) {
      console.error('Error loading custom prices:', error);
      toast.error('Failed to load custom prices');
    } finally {
      setLoading(false);
    }
  };

  // Get products that already have custom pricing
  const productsWithCustomPricing = useMemo(() => {
    return customPrices.map(group => group.product_id);
  }, [customPrices]);

  // Get available products for adding new custom prices (excluding existing ones)
  const availableProducts = useMemo(() => {
    return products.filter(product => !productsWithCustomPricing.includes(product.id));
  }, [products, productsWithCustomPricing]);

  // Filter custom prices based on selected product
  const filteredCustomPrices = useMemo(() => {
    if (!selectedProduct) {
      return customPrices;
    }
    return customPrices.filter(group => group.product_id === selectedProduct.id);
  }, [customPrices, selectedProduct]);

  const handleAddPrice = () => {
    // Check if selected product already has custom pricing
    if (selectedProduct && productsWithCustomPricing.includes(selectedProduct.id)) {
      toast.warning('This product already has custom pricing. Use the Edit option instead.');
      return;
    }

    // Reset form for adding new prices
    setPriceTiers([{
      id: Date.now(),
      min_quantity: 5,
      max_quantity: '',
      price: ''
    }]);
    setSelectedProductForDialog(selectedProduct);
    setEditingPrice(null);
    setDialogOpen(true);
  };

  const handleEditProductPrices = (productGroup) => {
    const product = products.find(p => p.id === productGroup.product_id);
    setSelectedProductForDialog(product);
    
    // Convert existing price ranges to editable tiers
    const existingTiers = productGroup.price_ranges.map(range => ({
      id: range.id,
      min_quantity: range.min_quantity,
      max_quantity: range.max_quantity || '',
      price: range.price,
      existing: true // Mark as existing for updates
    }));
    
    setPriceTiers(existingTiers);
    setEditingPrice(productGroup);
    setDialogOpen(true);
  };

  const addPriceTier = () => {
    const newTier = {
      id: Date.now(),
      min_quantity: '',
      max_quantity: '',
      price: '',
      existing: false
    };
    setPriceTiers(prev => [...prev, newTier]);
  };

  const removePriceTier = (tierId) => {
    if (priceTiers.length > 1) {
      setPriceTiers(prev => prev.filter(tier => tier.id !== tierId));
    }
  };

  const updatePriceTier = (tierId, field, value) => {
    setPriceTiers(prev => prev.map(tier => 
      tier.id === tierId 
        ? { ...tier, [field]: value }
        : tier
    ));
  };

  const validatePriceTiers = () => {
    if (!selectedProductForDialog) {
      toast.error('Please select a product');
      return false;
    }

    // Check if all tiers have required fields
    for (const tier of priceTiers) {
      if (!tier.min_quantity || !tier.price) {
        toast.error('All price tiers must have minimum quantity and price');
        return false;
      }
      
      if (tier.max_quantity && parseInt(tier.max_quantity) <= parseInt(tier.min_quantity)) {
        toast.error('Max quantity must be greater than min quantity');
        return false;
      }
    }

    // Check for overlapping ranges
    const sortedTiers = [...priceTiers].sort((a, b) => parseInt(a.min_quantity) - parseInt(b.min_quantity));
    for (let i = 0; i < sortedTiers.length - 1; i++) {
      const currentTier = sortedTiers[i];
      const nextTier = sortedTiers[i + 1];
      
      if (currentTier.max_quantity && 
          parseInt(currentTier.max_quantity) >= parseInt(nextTier.min_quantity)) {
        toast.error('Quantity ranges cannot overlap');
        return false;
      }
    }

    return true;
  };

  const handleSavePrice = async () => {
    if (!validatePriceTiers()) {
      return;
    }

    try {
      if (editingPrice) {
        // For editing, we need to handle updates and deletions
        const updates = priceTiers.filter(tier => tier.existing);
        const newTiers = priceTiers.filter(tier => !tier.existing);
        
        // Update existing tiers
        for (const tier of updates) {
          const priceData = {
            min_quantity: parseInt(tier.min_quantity),
            max_quantity: tier.max_quantity ? parseInt(tier.max_quantity) : null,
            price: parseFloat(tier.price)
          };
          await api.put(`/customers/custom-prices/${tier.id}`, priceData);
        }
        
        // Add new tiers
        if (newTiers.length > 0) {
          const pricesData = newTiers.map(tier => ({
            product_id: selectedProductForDialog.id,
            min_quantity: parseInt(tier.min_quantity),
            max_quantity: tier.max_quantity ? parseInt(tier.max_quantity) : null,
            price: parseFloat(tier.price)
          }));

          await api.post(`/customers/${customer.id}/custom-prices`, {
            prices: pricesData
          });
        }
        
        toast.success('Custom prices updated successfully');
      } else {
        // For adding, we can handle multiple tiers
        const pricesData = priceTiers.map(tier => ({
          product_id: selectedProductForDialog.id,
          min_quantity: parseInt(tier.min_quantity),
          max_quantity: tier.max_quantity ? parseInt(tier.max_quantity) : null,
          price: parseFloat(tier.price)
        }));

        await api.post(`/customers/${customer.id}/custom-prices`, {
          prices: pricesData
        });
        toast.success(`${pricesData.length} custom price(s) added successfully`);
      }

      await loadCustomPrices();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving price:', error);
      toast.error(error.response?.data?.message || 'Failed to save price');
    }
  };

  const handleDeleteProductPrices = async (productGroup) => {
    if (window.confirm(`Are you sure you want to delete all custom prices for ${productGroup.product?.product_name}?`)) {
      try {
        // Delete all price ranges for this product
        for (const range of productGroup.price_ranges) {
          await api.delete(`/customers/custom-prices/${range.id}`);
        }
        toast.success('All custom prices for product deleted successfully');
        await loadCustomPrices();
      } catch (error) {
        console.error('Error deleting prices:', error);
        toast.error('Failed to delete custom prices');
      }
    }
  };

  const handleClearFilter = () => {
    setSelectedProduct(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  // Format products for autocomplete display
  const getProductOptionLabel = (product) => {
    if (!product) return '';
    return product.product_name;
  };

  // Filter function for autocomplete search
  const filterProducts = (options, { inputValue }) => {
    const searchTerm = inputValue.toLowerCase();
    return options.filter(product => 
      product.product_code.toLowerCase().includes(searchTerm) ||
      product.product_name.toLowerCase().includes(searchTerm)
    );
  };

  if (!customer?.is_valued_customer) {
    return (
      <Alert severity="info">
        Customer must be marked as "Valued Customer" to manage custom pricing.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Custom Pricing Management</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<PlusOutlined />}
            variant="contained"
            onClick={handleAddPrice}
            disabled={loading}
          >
            Add Custom Price
          </Button>
        </Box>
      </Box>

      {/* Product Search/Filter with Clear Option */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Autocomplete
            options={products}
            value={selectedProduct}
            onChange={(event, newValue) => setSelectedProduct(newValue)}
            getOptionLabel={getProductOptionLabel}
            filterOptions={filterProducts}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search and Filter Products"
                placeholder="Type product code or name to filter..."
                size="small"
                sx={{ minWidth: 400 }}
              />
            )}
            renderOption={(props, product) => {
              const hasCustomPricing = productsWithCustomPricing.includes(product.id);
              return (
                <Box component="li" {...props}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {product.product_code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.product_name}
                        </Typography>
                      </Box>
                      {hasCustomPricing && (
                        <Chip 
                          label="Has Pricing" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ fontSize: '0.65rem', height: 20 }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            noOptionsText="No products found"
            clearOnBlur={false}
            selectOnFocus
            handleHomeEndKeys
          />
          {selectedProduct && (
            <Tooltip title="Clear Filter">
              <IconButton
                size="small"
                onClick={handleClearFilter}
                sx={{ ml: 1 }}
              >
                <ClearOutlined />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        {selectedProduct && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={`Filtered by: ${getProductOptionLabel(selectedProduct)}`}
              onDelete={handleClearFilter}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </Box>

      {/* Custom Prices Table - Grouped by Product */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Product</TableCell>
              <TableCell>Prices</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomPrices.map((productGroup) => (
              <TableRow key={productGroup.product_id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {productGroup.product?.product_name || 'Unknown Product'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {productGroup.product?.product_code}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    {productGroup.price_ranges.map((range, index) => (
                      <Box key={range.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           {range.label && (
                          <Chip
                            label={range.label}
                            size="small"
                            variant="outlined"
                            sx={{ height: 25, fontSize: '0.75rem' }}
                          />
                        )}
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {formatCurrency(range.price)}
                        </Typography>
                   
                      </Box>
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit All Prices">
                    <IconButton
                      size="small"
                      onClick={() => handleEditProductPrices(productGroup)}
                    >
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete All Prices">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteProductPrices(productGroup)}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomPrices.length === 0 && customPrices.length > 0 && selectedProduct && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No custom prices found for "{getProductOptionLabel(selectedProduct)}"
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {customPrices.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No custom prices configured for this customer
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Price Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingPrice ? `Edit Custom Prices for ${selectedProductForDialog?.product_name}` : 'Add Custom Pricing Tiers'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Product Selection */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  options={editingPrice ? products : availableProducts}
                  value={selectedProductForDialog}
                  onChange={(event, newValue) => setSelectedProductForDialog(newValue)}
                  getOptionLabel={getProductOptionLabel}
                  filterOptions={filterProducts}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product *"
                      placeholder="Search product code or name..."
                      required
                      error={!editingPrice && availableProducts.length === 0}
                      helperText={!editingPrice && availableProducts.length === 0 ? 
                        "All products already have custom pricing configured" : 
                        !editingPrice ? `${availableProducts.length} products available for custom pricing` : null
                      }
                    />
                  )}
                  renderOption={(props, product) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {product.product_name}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  disabled={!!editingPrice || (!editingPrice && availableProducts.length === 0)}
                  noOptionsText={!editingPrice && availableProducts.length === 0 ? 
                    "All products already have custom pricing" : "No products found"
                  }
                  clearOnBlur={false}
                  selectOnFocus
                  handleHomeEndKeys
                />
              </Grid>
            </Grid>

            {!editingPrice && availableProducts.length === 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                All available products already have custom pricing configured. 
                Use the Edit option to modify existing pricing.
              </Alert>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Price Tiers Section */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {editingPrice ? 'Price Ranges' : 'Price Tiers'}
                </Typography>
                <Button
                  startIcon={<PlusOutlined />}
                  variant="outlined"
                  size="small"
                  onClick={addPriceTier}
                  disabled={!selectedProductForDialog}
                >
                  Add Tier
                </Button>
              </Box>

              {priceTiers.map((tier, index) => (
                <Card key={tier.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        {editingPrice && tier.existing ? `Existing Range ${index + 1}` : `Tier ${index + 1}`}
                        {tier.existing && (
                          <Chip 
                            label="Existing" 
                            size="small" 
                            color="info" 
                            variant="outlined" 
                            sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
                          />
                        )}
                      </Typography>
                      {priceTiers.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removePriceTier(tier.id)}
                        >
                          <MinusCircleOutlined />
                        </IconButton>
                      )}
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Min Quantity"
                          type="number"
                          value={tier.min_quantity}
                          onChange={(e) => updatePriceTier(tier.id, 'min_quantity', e.target.value)}
                          fullWidth
                          required
                          size="small"
                          inputProps={{ min: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Max Quantity (Optional)"
                          type="number"
                          value={tier.max_quantity}
                          onChange={(e) => updatePriceTier(tier.id, 'max_quantity', e.target.value)}
                          fullWidth
                          size="small"
                          placeholder="Leave empty for open-ended"
                          inputProps={{ min: tier.min_quantity ? parseInt(tier.min_quantity) + 1 : 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Price"
                          type="number"
                          value={tier.price}
                          onChange={(e) => updatePriceTier(tier.id, 'price', e.target.value)}
                          fullWidth
                          required
                          size="small"
                          inputProps={{ min: 0, step: 0.01 }}
                          InputProps={{
                            startAdornment: '₱'
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>


          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSavePrice}
            variant="contained"
            disabled={!selectedProductForDialog || priceTiers.some(tier => !tier.min_quantity || !tier.price)}
          >
            {editingPrice ? 'Update Prices' : `Add ${priceTiers.length} Price Tier${priceTiers.length > 1 ? 's' : ''}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CustomerPricingPanel;