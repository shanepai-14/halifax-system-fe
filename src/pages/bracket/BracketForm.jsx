import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { useBracketPricing } from '@/hooks/useBracketPricing';
import { formatCurrency } from '@/utils/currencyFormat';

const BracketForm = ({ open, product, bracket, onClose }) => {
  const { createBracket, updateBracket, loading } = useBracketPricing();

  const [formData, setFormData] = useState({
    is_selected: false,
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: '',
    bracket_items: [
      {
        min_quantity: 1,
        max_quantity: '',
        price: '',
        price_type: 'regular',
        is_active: true
      }
    ]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bracket) {
      // Edit mode - populate form with bracket data
      setFormData({
        is_selected: bracket.is_selected || false,
        effective_from: bracket.effective_from ? bracket.effective_from.split('T')[0] : '',
        effective_to: bracket.effective_to ? bracket.effective_to.split('T')[0] : '',
        bracket_items: bracket.bracket_items?.map(item => ({
          id: item.id,
          min_quantity: item.min_quantity,
          max_quantity: item.max_quantity || '',
          price: item.price,
          price_type: item.price_type,
          is_active: item.is_active
        })) || []
      });
    } else {
      // Create mode - reset form
      setFormData({
        is_selected: false,
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: '',
        bracket_items: [
          {
            min_quantity: 1,
            max_quantity: '',
            price: '',
            price_type: 'regular',
            is_active: true
          }
        ]
      });
    }
    setErrors({});
  }, [bracket, open]);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleBracketItemChange = (index, field, value) => {
    const newItems = [...formData.bracket_items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      bracket_items: newItems
    }));

    // Clear errors for this item
    const errorKey = `bracket_items.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: null
      }));
    }
  };

  const addBracketItem = () => {
    const lastItem = formData.bracket_items[formData.bracket_items.length - 1];
    const newMinQuantity = lastItem.max_quantity ? parseInt(lastItem.max_quantity) + 1 : lastItem.min_quantity + 10;
    
    setFormData(prev => ({
      ...prev,
      bracket_items: [
        ...prev.bracket_items,
        {
          min_quantity: newMinQuantity,
          max_quantity: '',
          price: '',
          price_type: 'regular',
          is_active: true
        }
      ]
    }));
  };

  const removeBracketItem = (index) => {
    if (formData.bracket_items.length > 1) {
      setFormData(prev => ({
        ...prev,
        bracket_items: prev.bracket_items.filter((_, i) => i !== index)
      }));
    }
  };

  const duplicateBracketItem = (index) => {
    const itemToDuplicate = formData.bracket_items[index];
    setFormData(prev => ({
      ...prev,
      bracket_items: [
        ...prev.bracket_items.slice(0, index + 1),
        {
          ...itemToDuplicate,
          id: undefined, // Remove ID for new item
          min_quantity: itemToDuplicate.max_quantity ? parseInt(itemToDuplicate.max_quantity) + 1 : itemToDuplicate.min_quantity + 10
        },
        ...prev.bracket_items.slice(index + 1)
      ]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate basic fields
    if (!formData.effective_from) {
      newErrors.effective_from = 'Effective from date is required';
    }

    if (formData.effective_to && formData.effective_to <= formData.effective_from) {
      newErrors.effective_to = 'Effective to date must be after effective from date';
    }

    // Validate bracket items
    if (formData.bracket_items.length === 0) {
      newErrors.bracket_items = 'At least one bracket item is required';
    }

    formData.bracket_items.forEach((item, index) => {
      if (!item.min_quantity || item.min_quantity < 1) {
        newErrors[`bracket_items.${index}.min_quantity`] = 'Minimum quantity must be at least 1';
      }

      if (item.max_quantity && parseInt(item.max_quantity) <= parseInt(item.min_quantity)) {
        newErrors[`bracket_items.${index}.max_quantity`] = 'Maximum quantity must be greater than minimum quantity';
      }

      if (!item.price || parseFloat(item.price) < 0) {
        newErrors[`bracket_items.${index}.price`] = 'Price must be a positive number';
      }

      // Check for overlapping quantities within same price type
      const sameTypeItems = formData.bracket_items.filter((otherItem, otherIndex) => 
        otherIndex !== index && otherItem.price_type === item.price_type
      );

      for (const otherItem of sameTypeItems) {
        const itemMin = parseInt(item.min_quantity);
        const itemMax = item.max_quantity ? parseInt(item.max_quantity) : Infinity;
        const otherMin = parseInt(otherItem.min_quantity);
        const otherMax = otherItem.max_quantity ? parseInt(otherItem.max_quantity) : Infinity;

        if ((itemMin >= otherMin && itemMin <= otherMax) || 
            (itemMax >= otherMin && itemMax <= otherMax) ||
            (itemMin <= otherMin && itemMax >= otherMax)) {
          newErrors[`bracket_items.${index}.min_quantity`] = 'Quantity ranges cannot overlap for the same price type';
          break;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (bracket) {
        // Update existing bracket
        await updateBracket(bracket.id, formData);
      } else {
        // Create new bracket
        await createBracket(product.id, formData);
      }
      onClose(true); // Close with refresh
    } catch (error) {
      console.error('Error saving bracket:', error);
    }
  };

  const priceTypes = [
    { value: 'regular', label: 'Regular' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'walk_in', label: 'Walk-in' }
  ];

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="lg" fullWidth>
      <DialogTitle>
        {bracket ? 'Edit Bracket' : 'Create New Bracket'}
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Effective From"
              type="date"
              value={formData.effective_from}
              onChange={(e) => handleFormChange('effective_from', e.target.value)}
              error={!!errors.effective_from}
              helperText={errors.effective_from}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Effective To (Optional)"
              type="date"
              value={formData.effective_to}
              onChange={(e) => handleFormChange('effective_to', e.target.value)}
              error={!!errors.effective_to}
              helperText={errors.effective_to}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_selected}
                  onChange={(e) => handleFormChange('is_selected', e.target.checked)}
                />
              }
              label="Activate this bracket immediately"
            />
          </Grid>

          {/* Bracket Items */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Price Tiers
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addBracketItem}
              >
                Add Tier
              </Button>
            </Box>

            {errors.bracket_items && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.bracket_items}
              </Alert>
            )}

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Min Qty</TableCell>
                    <TableCell>Max Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Price Type</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.bracket_items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={item.min_quantity}
                          onChange={(e) => handleBracketItemChange(index, 'min_quantity', parseInt(e.target.value) || '')}
                          error={!!errors[`bracket_items.${index}.min_quantity`]}
                          helperText={errors[`bracket_items.${index}.min_quantity`]}
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={item.max_quantity}
                          onChange={(e) => handleBracketItemChange(index, 'max_quantity', e.target.value ? parseInt(e.target.value) : '')}
                          error={!!errors[`bracket_items.${index}.max_quantity`]}
                          helperText={errors[`bracket_items.${index}.max_quantity`]}
                          placeholder="∞"
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleBracketItemChange(index, 'price', parseFloat(e.target.value) || '')}
                          error={!!errors[`bracket_items.${index}.price`]}
                          helperText={errors[`bracket_items.${index}.price`]}
                          sx={{ width: 120 }}
                        />
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ width: 100 }}>
                          <Select
                            value={item.price_type}
                            onChange={(e) => handleBracketItemChange(index, 'price_type', e.target.value)}
                          >
                            {priceTypes.map(type => (
                              <MenuItem key={type.value} value={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.is_active}
                          onChange={(e) => handleBracketItemChange(index, 'is_active', e.target.checked)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => duplicateBracketItem(index)}
                          title="Duplicate"
                        >
                          <CopyIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeBracketItem(index)}
                          disabled={formData.bracket_items.length <= 1}
                          title="Remove"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={() => onClose(false)}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : (bracket ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BracketForm;