import React, { useState, useEffect ,useCallback } from 'react';
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
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import { useBracketPricing } from '@/hooks/useBracketPricing';
import { formatCurrency } from '@/utils/formatUtils';

const BracketForm = ({ open, product, bracket, onClose }) => {
  const { createBracket, updateBracket, loading } = useBracketPricing();

  const [formData, setFormData] = useState({
    is_selected: false,
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: '',
    bracket_tiers: [
      {
        min_quantity: 1,
        max_quantity: '',
        price_entries: [
          {
            price: '',
            price_type: 'regular',
            is_active: true
          }
        ]
      }
    ]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bracket && open) {
      // Convert existing bracket data to new tier structure
      const tierMap = new Map();
      
      // Group bracket items by quantity range to create tiers
      bracket.bracket_items?.forEach(item => {
        const tierKey = `${item.min_quantity}-${item.max_quantity || 'inf'}`;
        
        if (!tierMap.has(tierKey)) {
          tierMap.set(tierKey, {
            min_quantity: item.min_quantity,
            max_quantity: item.max_quantity || '',
            price_entries: []
          });
        }
        
        tierMap.get(tierKey).price_entries.push({
          id: item.id,
          price: item.price,
          price_type: item.price_type,
          is_active: item.is_active
        });
      });

      setFormData({
        is_selected: bracket.is_selected || false,
        effective_from: bracket.effective_from ? bracket.effective_from.split('T')[0] : '',
        effective_to: bracket.effective_to ? bracket.effective_to.split('T')[0] : '',
        bracket_tiers: Array.from(tierMap.values())
      });
    } else if (open) {
      // Reset form for new bracket
      setFormData({
        is_selected: false,
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: '',
        bracket_tiers: [
          {
            min_quantity: 1,
            max_quantity: '',
            price_entries: [
              {
                price: '',
                price_type: 'regular',
                is_active: true
              }
            ]
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
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleTierChange = (tierIndex, field, value) => {
    const newTiers = [...formData.bracket_tiers];
    newTiers[tierIndex] = {
      ...newTiers[tierIndex],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      bracket_tiers: newTiers
    }));

    const errorKey = `bracket_tiers.${tierIndex}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: null
      }));
    }
  };


const handlePriceEntryChange = useCallback((tierIndex, entryIndex, field, value) => {
    const newTiers = [...formData.bracket_tiers];
    newTiers[tierIndex].price_entries[entryIndex] = {
      ...newTiers[tierIndex].price_entries[entryIndex],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      bracket_tiers: newTiers
    }));

    const errorKey = `bracket_tiers.${tierIndex}.price_entries.${entryIndex}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: null
      }));
    }
}, [formData.bracket_tiers, errors]);


  const addTier = () => {
    const lastTier = formData.bracket_tiers[formData.bracket_tiers.length - 1];
    const newMinQuantity = lastTier.max_quantity ? parseInt(lastTier.max_quantity) + 1 : lastTier.min_quantity + 10;
    
    const newTier = {
      min_quantity: newMinQuantity,
      max_quantity: '',
      price_entries: [
        {
          price: '',
          price_type: 'regular',
          is_active: true
        }
      ]
    };
    
    setFormData(prev => ({
      ...prev,
      bracket_tiers: [...prev.bracket_tiers, newTier]
    }));
  };

  const removeTier = (tierIndex) => {
    if (formData.bracket_tiers.length > 1) {
      setFormData(prev => ({
        ...prev,
        bracket_tiers: prev.bracket_tiers.filter((_, i) => i !== tierIndex)
      }));
    }
  };

  const addPriceEntry = (tierIndex) => {
    const newEntry = {
      price: '',
      price_type: 'regular',
      is_active: true
    };
    
    const newTiers = [...formData.bracket_tiers];
    newTiers[tierIndex].price_entries.push(newEntry);
    
    setFormData(prev => ({
      ...prev,
      bracket_tiers: newTiers
    }));
  };

  const removePriceEntry = (tierIndex, entryIndex) => {
    const newTiers = [...formData.bracket_tiers];
    if (newTiers[tierIndex].price_entries.length > 1) {
      newTiers[tierIndex].price_entries.splice(entryIndex, 1);
      setFormData(prev => ({
        ...prev,
        bracket_tiers: newTiers
      }));
    }
  };

  const duplicatePriceEntry = (tierIndex, entryIndex) => {
    const originalEntry = formData.bracket_tiers[tierIndex].price_entries[entryIndex];
    const duplicatedEntry = {
      ...originalEntry,
      id: undefined // Remove ID for new entry
    };
    
    const newTiers = [...formData.bracket_tiers];
    newTiers[tierIndex].price_entries.splice(entryIndex + 1, 0, duplicatedEntry);
    
    setFormData(prev => ({
      ...prev,
      bracket_tiers: newTiers
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

    // Validate tiers
    if (formData.bracket_tiers.length === 0) {
      newErrors.bracket_tiers = 'At least one tier is required';
    }

    formData.bracket_tiers.forEach((tier, tierIndex) => {
      if (!tier.min_quantity || tier.min_quantity < 1) {
        newErrors[`bracket_tiers.${tierIndex}.min_quantity`] = 'Min quantity must be at least 1';
      }

      if (tier.max_quantity && parseInt(tier.max_quantity) <= parseInt(tier.min_quantity)) {
        newErrors[`bracket_tiers.${tierIndex}.max_quantity`] = 'Max quantity must be greater than min quantity';
      }

      // Validate price entries
      if (tier.price_entries.length === 0) {
        newErrors[`bracket_tiers.${tierIndex}.price_entries`] = 'At least one price entry is required';
      }

      tier.price_entries.forEach((entry, entryIndex) => {
       if (!entry.price || entry.price === '' || parseFloat(entry.price) < 0 || isNaN(parseFloat(entry.price))) {
          newErrors[`bracket_tiers.${tierIndex}.price_entries.${entryIndex}.price`] = 'Price must be positive';
        }
      });

      // Check for overlapping quantity ranges
      formData.bracket_tiers.forEach((otherTier, otherIndex) => {
        if (otherIndex !== tierIndex) {
          const tierMin = parseInt(tier.min_quantity);
          const tierMax = tier.max_quantity ? parseInt(tier.max_quantity) : Infinity;
          const otherMin = parseInt(otherTier.min_quantity);
          const otherMax = otherTier.max_quantity ? parseInt(otherTier.max_quantity) : Infinity;

          if ((tierMin >= otherMin && tierMin <= otherMax) || 
              (tierMax >= otherMin && tierMax <= otherMax) ||
              (tierMin <= otherMin && tierMax >= otherMax)) {
            newErrors[`bracket_tiers.${tierIndex}.min_quantity`] = 'Quantity ranges cannot overlap';
          }
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Convert tier structure back to the original bracket_items format
      const bracketData = {
        is_selected: formData.is_selected,
        effective_from: formData.effective_from,
        effective_to: formData.effective_to,
        bracket_items: []
      };

      formData.bracket_tiers.forEach(tier => {
        tier.price_entries.forEach(entry => {
          bracketData.bracket_items.push({
            id: entry.id,
            min_quantity: tier.min_quantity,
            max_quantity: tier.max_quantity || null,
            price: parseFloat(entry.price),
            price_type: entry.price_type,
            is_active: entry.is_active
          });
        });
      });

      if (bracket) {
        await updateBracket(bracket.id, bracketData);
      } else {
        await createBracket(product.id, bracketData);
      }
      onClose(true);
    } catch (error) {
      console.error('Error saving bracket:', error);
    }
  };

  const getQuantityRangeDisplay = (tier) => {
    if (tier.max_quantity) {
      return `${tier.min_quantity} - ${tier.max_quantity}`;
    }
    return `${tier.min_quantity}+`;
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">
            {bracket ? 'Edit Bracket' : 'Create New Bracket'}
          </Typography>
          <Chip 
            label={`${formData.bracket_tiers.length} Tier${formData.bracket_tiers.length !== 1 ? 's' : ''}`}
            color="primary"
            size="small"
          />
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* Basic Information */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Effective From"
                type="date"
                value={formData.effective_from}
                onChange={(e) => handleFormChange('effective_from', e.target.value)}
                error={!!errors.effective_from}
                helperText={errors.effective_from}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Effective To (Optional)"
                type="date"
                value={formData.effective_to}
                onChange={(e) => handleFormChange('effective_to', e.target.value)}
                error={!!errors.effective_to}
                helperText={errors.effective_to}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={12} md={6}>
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
          </Grid>
        </Box>

        {/* Pricing Tiers - Horizontal Layout */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Pricing Tiers
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={addTier}
            >
              Add Tier
            </Button>
          </Box>

          {errors.bracket_tiers && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.bracket_tiers}
            </Alert>
          )}

          {/* Horizontal Scrollable Tiers */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            overflowX: 'auto', 
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'grey.100',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'grey.400',
              borderRadius: 4,
            },
          }}>
            {formData.bracket_tiers.map((tier, tierIndex) => (
              <Card
                key={tierIndex}
                sx={{ 
                  minWidth: 320,
                  maxWidth: 400,
                  flexShrink: 0,
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                <CardHeader
                  avatar={
                    <Chip 
                      label={`Tier ${tierIndex + 1}`}
                      color="primary"
                      size="small"
                    />
                  }
                  title={
                    <Typography variant="subtitle1">
                      Qty: {getQuantityRangeDisplay(tier)}
                    </Typography>
                  }
                  action={
                    <IconButton
                      size="small"
                      onClick={() => removeTier(tierIndex)}
                      disabled={formData.bracket_tiers.length <= 1}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ pb: 1 }}
                />
                
                <CardContent sx={{ pt: 0 }}>
                  <Stack spacing={2}>
                    {/* Quantity Range */}
                    <Box>
                      {/* <Typography variant="subtitle2" gutterBottom>
                        Quantity Range
                      </Typography> */}
                      <Grid container spacing={1} mt={0.1}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Min Qty"
                            type="number"
                            value={tier.min_quantity}
                            onChange={(e) => handleTierChange(tierIndex, 'min_quantity', parseInt(e.target.value) || '')}
                            error={!!errors[`bracket_tiers.${tierIndex}.min_quantity`]}
                            helperText={errors[`bracket_tiers.${tierIndex}.min_quantity`]}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Max Qty"
                            type="number"
                            value={tier.max_quantity}
                            onChange={(e) => handleTierChange(tierIndex, 'max_quantity', e.target.value ? parseInt(e.target.value) : '')}
                            error={!!errors[`bracket_tiers.${tierIndex}.max_quantity`]}
                            helperText={errors[`bracket_tiers.${tierIndex}.max_quantity`]}
                            placeholder="∞"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider />

                    {/* Price Entries */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">
                          Price Entries ({tier.price_entries.length})
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => addPriceEntry(tierIndex)}
                        >
                          Add
                        </Button>
                      </Box>

                      {errors[`bracket_tiers.${tierIndex}.price_entries`] && (
                        <Alert severity="error" sx={{ mb: 1, fontSize: '0.75rem' }}>
                          {errors[`bracket_tiers.${tierIndex}.price_entries`]}
                        </Alert>
                      )}

                      <Stack spacing={1} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                        {tier.price_entries.map((entry, entryIndex) => (


                        <Box
                            sx={{ 
                              pt:1.5,
                              minWidth: 200,
                              position: 'relative',
                              backgroundColor: entry.is_active ? 'background.paper' : 'action.hover'
                            }}
                          >
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <TextField
                                size="small"
                                label={`Price`}
                                type="number"
                                step="0.01"
                                value={entry.price}
                                onChange={(e) => handlePriceEntryChange(tierIndex, entryIndex, 'price', e.target.value)}
                                error={!!errors[`bracket_tiers.${tierIndex}.price_entries.${entryIndex}.price`]}
                                helperText={errors[`bracket_tiers.${tierIndex}.price_entries.${entryIndex}.price`]}
                                fullWidth
                              />
                                <Box sx={{ display: 'flex' }}> 
                                  <IconButton
                                    size="small"
                                    onClick={() => duplicatePriceEntry(tierIndex, entryIndex)}
                                    title="Duplicate"
                                  >
                                    <CopyIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => removePriceEntry(tierIndex, entryIndex)}
                                    disabled={formData.bracket_tiers[tierIndex].price_entries.length <= 1}
                                    title="Remove"
                                    color="error"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              

                              
                              {/* <FormControlLabel
                                control={
                                  <Switch
                                    checked={entry.is_active}
                                    onChange={(e) => handlePriceEntryChange(tierIndex, entryIndex, 'is_active', e.target.checked)}
                                    size="small"
                                  />
                                }
                                sx={{ m: 0 }}
                              /> */}
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
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