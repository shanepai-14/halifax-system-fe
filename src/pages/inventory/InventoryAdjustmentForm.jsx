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
  Typography,
  Collapse
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
  const [formData, setFormData] = useState({
    id: product?.id || '',
    product_id: product?.id || '',
    quantity: '',
    type: 'addition',
    reason: '',
    notes: '',
    // New pricing fields
    distribution_price: '',
    walk_in_price: '',
    wholesale_price: '',
    regular_price: ''
  });
  const [errors, setErrors] = useState({});
  
  // Update form if product changes
  useEffect(() => {
    if (product) {
      setFormData(prev => ({
        ...prev,
        id: product.id || '',
        product_id: product.id || '',
        distribution_price:product.avg_cost_price
      }));
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.product_id) {
      newErrors.product_id = 'Product is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.reason) {
      newErrors.reason = 'Reason is required';
    }
    
    // Validate pricing fields only when adjustment type is 'addition'
    if (formData.type === 'addition') {
      if (!formData.distribution_price || formData.distribution_price <= 0) {
        newErrors.distribution_price = 'Distribution price is required';
      }
      
      if (!formData.walk_in_price || formData.walk_in_price <= 0) {
        newErrors.walk_in_price = 'Walk-in price is required';
      }
      
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleChange = (e) => {
  const { name, value } = e.target;
  
  setFormData(prev => {
    let updatedData = {
      ...prev,
      [name]: value
    };
    
    // If walk_in_price is being updated, sync wholesale_price and regular_price
    if (name === 'walk_in_price') {
      updatedData.wholesale_price = value;
      updatedData.regular_price = value;
    }
    console.log('Updated formData:', updatedData);
    return updatedData;
  });
  
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

  // Check if we need to show pricing fields
  const showPricingFields = formData.type === 'addition';

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            value={selectedProduct || null}
            onChange={handleProductChange}
            options={products || []}
            getOptionLabel={(option) => {
              // Check if option exists before accessing its properties
              return option ? `${option.product_code || ''} ${option.product_name || ''}` : '';
            }}
            isOptionEqualToValue={(option, value) => option && value ? option.id === value.id : false}
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
                Current Quantity: {selectedProduct.current_quantity || 0}
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

        <Grid item xs={12} sx={{paddingTop :showPricingFields == true ? '24px!important': '0!important' }}>
        <Collapse in={showPricingFields} sx={{ width: '100%' }}>
          <Grid container spacing={3} >
            <Grid item xs={12}>
              <Typography variant="subtitle2" >
                Pricing Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Distribution Price"
                name="distribution_price"
                type="number"
                value={formData.distribution_price}
                onChange={handleChange}
                error={!!errors.distribution_price}
                helperText={errors.distribution_price}
                required={showPricingFields}
                InputProps={{
                  inputProps: { min: 0, step: "0.01" }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Walk-in Price"
                name="walk_in_price"
                type="number"
                value={formData.walk_in_price}
                onChange={handleChange}
                error={!!errors.walk_in_price}
                helperText={errors.walk_in_price}
                required={showPricingFields}
                InputProps={{
                  inputProps: { min: 0, step: "0.01" }
                }}
              />
            </Grid>
            
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Wholesale Price"
                name="wholesale_price"
                type="number"
                value={formData.wholesale_price}
                onChange={handleChange}
                error={!!errors.wholesale_price}
                helperText={errors.wholesale_price}
                required={showPricingFields}
                InputProps={{
                  inputProps: { min: 0, step: "0.01" }
                }}
              />
            </Grid> */}
            
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Regular Price"
                name="regular_price"
                type="number"
                value={formData.regular_price}
                onChange={handleChange}
                error={!!errors.regular_price}
                helperText={errors.regular_price}
                required={showPricingFields}
                InputProps={{
                  inputProps: { min: 0, step: "0.01" }
                }}
              />
            </Grid> */}
          </Grid>
        </Collapse>
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