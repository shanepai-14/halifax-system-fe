import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
  Typography
} from '@mui/material';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const InventoryAdjustmentForm = ({ 
  product, 
  products, 
  adjustmentTypes,
  onSubmit, 
  onCancel,
  onSelectedProduct
}) => {
  console.log(product);
  const [formData, setFormData] = useState({
    id: product?.id || '',
    product_id: product?.id || '',
    quantity: '',
    type: 'addition',
    reason: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  
  // Update form if product changes
  useEffect(() => {
    if (product) {
      setFormData(prev => ({
        ...prev,
        id: product.id || '',
        product_id : product.id || ''
      }));
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    
    console.log('formData',formData);
    if (!formData.product_id) {
      newErrors.product_id = 'Product is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.reason) {
      newErrors.reason = 'Reason is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleProductChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      product_id: newValue ? newValue.id : '',
      id: newValue ? newValue.id : ''
    }));
   console.log('newValue', newValue);
    onSelectedProduct(newValue);
    
    if (errors.product_id) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.product_id;
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Find current product details
  const selectedProduct = product || products.find(p => p.id === formData.id);

  console.log('product',product);
  console.log('products',products);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            value={selectedProduct || null}
            onChange={handleProductChange}
            options={products || []}
            getOptionLabel={(option) => `${option.product_code} - ${option.product_name}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Product"
                error={!!errors.product_id}
                helperText={errors.product_id}
                disabled={product !== null && product.product_id}
              />
            )}
          />
        </Grid>

        {selectedProduct && (
          <Grid item xs={12}>
            <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Current Inventory:
              </Typography>
              <Typography>
                Product: {selectedProduct.product_name}
              </Typography>
              <Typography>
                Current Quantity: {selectedProduct.quantity || 0}
              </Typography>
              <Typography>
                Reorder Level: {selectedProduct.reorder_level || 'Not set'}
              </Typography>
            </Box>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>Adjustment Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Adjustment Type"
            >
              {adjustmentTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            error={!!errors.quantity}
            helperText={errors.quantity || 'Enter quantity to adjust'}
            InputProps={{
              inputProps: { min: 1 }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            error={!!errors.reason}
            helperText={errors.reason || 'Provide reason for this adjustment'}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            helperText="Optional: Add any additional notes or details"
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              startIcon={<CloseOutlined />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveOutlined />}
            >
              Save Adjustment
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryAdjustmentForm;