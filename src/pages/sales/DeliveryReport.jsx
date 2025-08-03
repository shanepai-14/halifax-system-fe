import React, { useState, forwardRef, useCallback, useMemo, memo } from 'react';
import {
  Typography, TextField, Box, Autocomplete, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, IconButton, InputAdornment, Button,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  Paper, Divider, Grid, Select, MenuItem, Checkbox,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Tooltip
} from '@mui/material';
import { 
  DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, 
  SaveOutlined, ShoppingCartOutlined, EditOutlined, StarFilled 
} from '@ant-design/icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import cities from '@/utils/cities';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Format date to YYYY-MM-DD for input
const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const validationSchema = Yup.object().shape({
  customer: Yup.object().nullable().required('Customer is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  orderDate: Yup.date().required('Order date is required'),
  deliveryDate: Yup.date().required('Delivery date is required')
    .min(Yup.ref('orderDate'), 'Delivery date must be after order date'),
  paymentMethod: Yup.string().required('Payment method is required'),
  term_days: Yup.string().when('paymentMethod', {
    is: 'term',
    then: (schema) => schema.required('Term days is required'),
    otherwise: (schema) => schema.notRequired()
  }),
});

// Memoized CustomerFormSection with valued customer indicator
const CustomerFormSection = memo(({ values, touched, errors, setFieldValue, customers }) => {
  const handleCustomerChange = useCallback((_, value) => {
    setFieldValue('customer', value);
    setFieldValue('phone', value?.contact_number || '');
    setFieldValue('address', value?.address || '');
    const selectedCity = cities.find(city => city.name === value?.city);
    setFieldValue('city', selectedCity?.name || '');
    setFieldValue('business', value?.business_name || 'N/A');
  }, [setFieldValue]);

  const handleCityChange = useCallback((event, newValue) => {
    const cityValue = newValue ? 
      (newValue.province ? `${newValue.name}, ${newValue.province}` : newValue.name) : "";
    setFieldValue("city", cityValue);
  }, [setFieldValue]);

  return (
    <Grid container spacing={2} sx={{paddingTop: "0!important"}}>
      <Grid item xs={12} md={6} sx={{paddingTop: "0!important"}}>
        <Field
          name="customer"
          component={Autocomplete}
          size="small" 
          options={customers}
          getOptionLabel={(option) => option.customer_name}
          renderOption={(props, option) => (
            <li {...props}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <span>{option.customer_name}</span>
                {option.is_valued_customer && (
                   <StarFilled style={{ color: '#ffa726' }} />
                )}
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Customer"
              slotProps={{
                inputLabel: {
                  sx: { top: '1px' }, 
                },
              }}
              error={touched.customer && !!errors.customer}
              helperText={touched.customer && errors.customer}
              fullWidth
              margin="normal"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {values.customer?.is_valued_customer && (
                      <Tooltip title="Valued Customer - Custom pricing available">
                        <StarFilled style={{ color: '#ffa726', marginRight: 8 }} />
                      </Tooltip>
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          onChange={handleCustomerChange}
        />
      </Grid>

      <Grid item xs={12} md={6} sx={{paddingTop: "0!important"}}>
        <Field
          size="small"
          slotProps={{
            inputLabel: {
              sx: { top: '1px' }, 
            },
          }}
          as={TextField}
          name="business"
          label="Business"
          fullWidth
          margin="normal"
          error={touched.business && !!errors.business}
          helperText={touched.business && errors.business}
        />
      </Grid>

      <Grid item xs={12} md={12} sx={{paddingTop: "0!important"}}>
        <Field
          size="small"
          slotProps={{
            inputLabel: {
              sx: { top: '1px' }, 
            },
          }}
          as={TextField}
          name="address"
          label="Address"
          fullWidth
          margin="normal"
          error={touched.address && !!errors.address}
          helperText={touched.address && errors.address}
        />
      </Grid>
     
      <Grid item xs={12} md={6} sx={{paddingTop: "0!important"}}>
        <Field
          size="small"
          slotProps={{
            inputLabel: {
              sx: { top: '1px' }, 
            },
          }}
          as={TextField}
          name="phone"
          label="Phone"
          fullWidth
          margin="normal"
          error={touched.phone && !!errors.phone}
          helperText={touched.phone && errors.phone}
        />

        <Field
          size="small"
          slotProps={{
            inputLabel: {
              sx: { top: '1px' }, 
            },
          }}
          as={TextField}
          name="orderDate"
          label="Order Date"
          type="date"
          fullWidth
          disabled={true}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={touched.orderDate && !!errors.orderDate}
          helperText={touched.orderDate && errors.orderDate}
        />
      </Grid>
      
      <Grid item xs={12} md={6} sx={{paddingTop: "0!important"}}>
        <Autocomplete
          size="small"
          options={cities}
          getOptionLabel={(option) => option.province ? `${option.name}, ${option.province}` : option.name}
          isOptionEqualToValue={(option, value) => 
            option.name === value?.name && 
            (option.province || '') === (value?.province || '')
          }
          value={cities.find(city => 
            city.name === values.city || 
            (city.province && `${city.name}, ${city.province}` === values.city)
          ) || null}
          onChange={handleCityChange}
          renderOption={(props, option) => (
            <li {...props} key={`${option.name}-${option.province || 'no-province'}`}>
              {option.province ? `${option.name}, ${option.province}` : option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              slotProps={{
                inputLabel: {
                  sx: { top: '1px' }, 
                },
              }}
              label="City"
              error={touched.city && !!errors.city}
              helperText={touched.city && errors.city}
              fullWidth
              margin="normal"
            />
          )}
        />

        <Field
          size="small"
          slotProps={{
            inputLabel: {
              sx: { top: '1px' }, 
            },
          }}
          as={TextField}
          name="deliveryDate"
          label="Delivery Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={touched.deliveryDate && !!errors.deliveryDate}
          helperText={touched.deliveryDate && errors.deliveryDate}
        />
      </Grid>
    </Grid>
  );
});

// Memoized PaymentSection
const PaymentSection = memo(({ values, setFieldValue, touched, errors }) => {
  const handlePaymentMethodChange = useCallback((e) => {
    setFieldValue('paymentMethod', e.target.value);
  }, [setFieldValue]);

  return (
    <Grid item xs={12} md={12} sx={{paddingTop: "0!important"}}>
      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup
          row
          name="paymentMethod"
          value={values.paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          <FormControlLabel value="cod" control={<Radio />} label="COD" />
          <FormControlLabel value="cash" control={<Radio />} label="Cash" />
          <FormControlLabel value="cheque" control={<Radio />} label="Cheque" />
          <FormControlLabel value="online" control={<Radio />} label="Online Payment" />
          <FormControlLabel value="term" control={<Radio />} label="Term" />
        </RadioGroup>
        {touched.paymentMethod && errors.paymentMethod && (
          <Typography color="error" variant="caption">{errors.paymentMethod}</Typography>
        )}
      </FormControl>
    </Grid>
  );
});

// Enhanced OrderItemRow with custom pricing support
const OrderItemRow = memo(({ 
  item, 
  customer,
  onQuantityChange, 
  onDiscountChange, 
  onBracketPricingChange,
  onCustomPriceChange,
  onRemoveProduct,
  onOpenCompositionModal,
  getPriceByPriceType,
  calculateBracketPrice,
  calculateCustomPrice,
  calculateItemSubtotal,
  availableInventory = 0
}) => {
  const handleQuantityDecrease = useCallback(() => {
    if (item.quantity > 0) {
      onQuantityChange(item.id, -1);
    }
  }, [item.id, item.quantity, onQuantityChange]);

  const handleQuantityIncrease = useCallback(() => {
    onQuantityChange(item.id, 1);
  }, [item.id, item.quantity, onQuantityChange]);

  const handleQuantityChange = useCallback((e) => {
    const newQuantity = parseInt(e.target.value) || 0;
    const validQuantity = Math.max(0, newQuantity);
    onQuantityChange(item.id, 0, validQuantity);
  }, [item.id, onQuantityChange]);

  const handleQuantityKeyDown = useCallback((e) => {
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowDown') && item.quantity > 0) {
      onQuantityChange(item.id, -1);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      onQuantityChange(item.id, 1);
    }
  }, [item.id, item.quantity, onQuantityChange]);

  const handleDiscountChange = useCallback((e) => {
    onDiscountChange(item.id, e.target.value);
  }, [item.id, onDiscountChange]);

  const handleBracketPricingChange = useCallback((e) => {
    onBracketPricingChange(item.id, e.target.checked);
  }, [item.id, onBracketPricingChange]);

  const handleCustomPriceChange = useCallback((e) => {
    onCustomPriceChange(item.id, parseFloat(e.target.value));
  }, [item.id, onCustomPriceChange]);

  const handleRemoveProduct = useCallback(() => {
    onRemoveProduct(item.id);
  }, [item.id, onRemoveProduct]);

  const handleEditComposition = useCallback(() => {
    onOpenCompositionModal(item.id);
  }, [item.id, onOpenCompositionModal]);

  const handleBracketPriceSelection = useCallback((e) => {
  const selectedPrice = parseFloat(e.target.value);
  // Update the item's selected bracket price
  if (onCustomPriceChange) {
    onCustomPriceChange(item.id, selectedPrice);
  }
}, [item.id, onCustomPriceChange]);

  // Calculate pricing options
  const customPricing = useMemo(() => 
    calculateCustomPrice(item, item.quantity, customer), 
    [item, calculateCustomPrice, customer]
  );
  
  const bracketPricing = useMemo(() => 
    calculateBracketPrice(item, item.quantity), 
    [item, calculateBracketPrice]
  );

  const itemPrice = useMemo(() => 
    getPriceByPriceType(item, customer), 
    [item, customer, getPriceByPriceType]
  );

  const subtotal = useMemo(() => 
    calculateItemSubtotal(item, customer), 
    [item, customer, calculateItemSubtotal]
  );

  const isZeroQuantity = item.quantity === 0;
  const isValuedCustomer = customer?.is_valued_customer;

  // Determine price display and options
  const getPriceDisplay = () => {
    // For valued customers, prioritize custom pricing
    if (isValuedCustomer && customPricing) {
        return (
          <Box>
            <Typography variant="body2">
              ₱{customPricing.price.toFixed(2)}
            </Typography>
            <Typography variant="caption" display="block" color="primary">
              Custom Price
            </Typography>
          </Box>
        );
      }
    

    // Fallback to bracket pricing if available and enabled
    if (item.use_bracket_pricing && item.price_bracket && bracketPricing) {
      if (bracketPricing.options && bracketPricing.options.length > 1) {
        // Multiple bracket prices - show dropdown
        return (
          <Box>
            <Select
              size="small"
              value={item.selected_bracket_price || bracketPricing.options[0]}
              onChange={handleBracketPriceSelection}
              sx={{ minWidth: 80 }}
            >
              {bracketPricing.options.map((price, index) => (
                <MenuItem key={index} value={price}>
                  ₱{price.toFixed(2)}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" display="block" color="secondary">
              Bracket Price
            </Typography>
          </Box>
        );
      } else {
        // Single bracket price
        return (
          <Box>
            <Typography variant="body2">
              ₱{bracketPricing.price.toFixed(2)}
            </Typography>
            <Typography variant="caption" display="block" color="secondary">
              Bracket Price
            </Typography>
          </Box>
        );
      }
    }

    // Standard pricing
    return (
      <Box>
        <Typography variant="body2">
          ₱{itemPrice.toFixed(2)}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Standard Price
        </Typography>
      </Box>
    );
  };

  return (
    <React.Fragment>
      <TableRow sx={{ 
        opacity: isZeroQuantity ? 0.6 : 1,
        backgroundColor: isZeroQuantity ? '#f5f5f5' : 'inherit'
      }}>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>{item.name}</span>
            {isValuedCustomer && customPricing && (
              <StarFilled style={{ color: '#ffa726' }} />
            )}
          </Box>
        </TableCell>
        
        {/* Bracket Pricing Checkbox Cell - only show for non-valued customers or when no custom pricing */}
        <TableCell align="center">
          {(!isValuedCustomer || !customPricing) && (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.use_bracket_pricing || false}
                    onChange={handleBracketPricingChange}
                    size="small"
                    disabled={!item.price_bracket}
                  />
                }
                label=""
                sx={{ 
                  m: 0,
                  opacity: item.price_bracket ? 1 : 0.3 
                }}
              />
            </>
          )}
          {isValuedCustomer && customPricing && (
            <Typography variant="caption" color="warning.main" sx={{ fontSize: '0.7rem' }}>
              Auto Applied
            </Typography>
          )}
        </TableCell>
        
        {/* Price Cell with enhanced display */}
        <TableCell align="right">
          {getPriceDisplay()}
        </TableCell>
        
        {/* Quantity Cell */}
        <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center', alignItems: "center"}} >
          <IconButton size="small" onClick={handleQuantityDecrease} disabled={item.quantity <= 0} >
            <MinusCircleOutlined />
          </IconButton>
          <TextField
            value={item.quantity || 0}
            onChange={handleQuantityChange}
            onKeyDown={handleQuantityKeyDown}
            inputProps={{ 
              style: { 
                textAlign: 'center', 
                width: '40px',
                color: isZeroQuantity ? '#f57c00' : 'inherit'
              },
              min: 0,
              max: availableInventory
            }}
            size="small"
            error={isZeroQuantity}
          />
          <IconButton size="small" onClick={handleQuantityIncrease}>
            <PlusCircleOutlined />
          </IconButton>
        </TableCell>
        
        {/* Subtotal Cell */}
        <TableCell align="right">₱{subtotal.toFixed(2)}</TableCell>
        
        {/* Actions Cell */}
        <TableCell align="right">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton 
              size="small" 
              color="primary"
              onClick={handleEditComposition}
              title="Add/Edit Composition"
            >
              <EditOutlined />
            </IconButton>
            <IconButton 
              size="small"
              onClick={handleRemoveProduct}
            >
              <DeleteOutlined />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
              
      {/* Composition row */}
      {item.composition && (
        <TableRow>
          <TableCell colSpan={7} style={{ paddingTop: 0, paddingBottom: 8 }}>
            <Box 
              sx={{ 
                pl: 2, 
                pr: 2,
                pt: 1,
                pb: 1,
                mt: 1, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1,
                borderLeft: '3px solid #1976d2'
              }}
            >
              <Typography variant="subtitle2" color="primary">
                Composition:
              </Typography>
              <div 
                className="composition-content"
                dangerouslySetInnerHTML={{ __html: item.composition }}
              />
            </Box>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
});

// Memoized CompositionModal
const CompositionModal = memo(({ 
  open, 
  onClose, 
  composition, 
  setComposition, 
  onSave 
}) => {
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['clean']
    ],
  }), []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Edit Composition</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <ReactQuill
            value={composition}
            onChange={setComposition}
            style={{ height: '200px', marginBottom: '50px' }}
            modules={quillModules}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
});

// Main DeliveryReport component with enhanced pricing logic
const DeliveryReport = forwardRef(({ 
  orderItems, 
  totalPrice, 
  customers, 
  onSubmit, 
  onRemoveProduct, 
  onQuantityChange, 
  onDiscountChange,
  onPriceTypeChange,
  onUpdateItemComposition,
  onBracketPricingChange,
  onCustomPriceChange,
  isSubmitting = false,
  onOpenProductModal
}, ref) => {
  // State for composition modal
  const [compositionModalOpen, setCompositionModalOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [composition, setComposition] = useState('');

  // Memoized initial values with proper defaults
  const initialValues = useMemo(() => ({
    customer: null,
    phone: '',
    address: '',
    city: '',
    business: '',
    orderDate: formatDateForInput(new Date()),
    deliveryDate: formatDateForInput(new Date(Date.now() + 86400000)),
    paymentMethod: '',
    term_days: '',
    delivery_fee: 0,
    cutting_charges: 0
  }), []);

  // Enhanced custom pricing calculation - automatically applies based on quantity
  const calculateCustomPrice = useCallback((item, quantity, customer) => {
    if (!customer?.is_valued_customer || !customer.custom_pricing_groups) {
      return null;
    }

    // Find custom pricing for this product
    const productPricing = customer.custom_pricing_groups.find(
      group => group.product_id === item.id
    );

    if (!productPricing) {
      return null;
    }

    // Find the best matching price range for the quantity (prefer higher quantity tiers)
    const matchingRange = productPricing.price_ranges
      .filter(range => 
        range.is_active &&
        quantity >= range.min_quantity &&
        (range.max_quantity === null || quantity <= range.max_quantity)
      )
      .sort((a, b) => b.min_quantity - a.min_quantity)[0]; // Get highest tier that matches

    if (!matchingRange) {
      return null;
    }

    return {
      available: true,
      price: parseFloat(matchingRange.price),
      range: matchingRange.quantity_range,
      label: matchingRange.label,
      source: 'custom_pricing'
    };
  }, []);

  // Enhanced bracket pricing calculation to handle multiple prices by grouping quantity ranges
  const calculateBracketPrice = useCallback((item, quantity) => {
    if (!item.price_bracket || !item.use_bracket_pricing) return null;
    
    const priceType = item.price_type || 'regular';
    
    // Group bracket items by quantity range
    const quantityGroups = {};
    item.price_bracket.items.forEach(bracketItem => {
      if (bracketItem.price_type === priceType && bracketItem.is_active) {
        const key = `${bracketItem.min_quantity}-${bracketItem.max_quantity || '∞'}`;
        if (!quantityGroups[key]) {
          quantityGroups[key] = {
            min_quantity: bracketItem.min_quantity,
            max_quantity: bracketItem.max_quantity,
            prices: []
          };
        }
        quantityGroups[key].prices.push(parseFloat(bracketItem.price));
      }
    });

    // Find matching quantity group
    const matchingGroup = Object.values(quantityGroups).find(group =>
      quantity >= group.min_quantity &&
      (group.max_quantity === null || quantity <= group.max_quantity)
    );

    if (!matchingGroup) return null;

    // Sort prices for consistent ordering
    matchingGroup.prices.sort((a, b) => a - b);

    return {
      available: true,
      price: item.selected_bracket_price || matchingGroup.prices[0],
      options: matchingGroup.prices.length > 1 ? matchingGroup.prices : null,
      source: 'bracket_pricing'
    };
  }, []);

  // Enhanced price calculation with priority order and proper bracket price selection
  // const getPriceByPriceType = useCallback((item, customer) => {
  //   // 1. First priority: Custom pricing for valued customers
  //   const customPricing = calculateCustomPrice(item, item.quantity, customer);
  //   if (customPricing && customPricing.price) {
  //     return customPricing.price;
  //   }

  //   // 2. Second priority: Bracket pricing if enabled
  //   if (item.use_bracket_pricing && item.price_bracket) {
  //     const bracketPricing = calculateBracketPrice(item, item.quantity);
  //     if (bracketPricing && bracketPricing.price) {
  //       // Use selected bracket price if available, otherwise use default
  //       return item.selected_bracket_price || bracketPricing.price;
  //     }
  //   }

  //   // 3. Fallback to standard pricing
  //   const standardPrice = (() => {
  //     switch(item.price_type || 'regular') {
  //       case 'walkin':
  //         return item.walk_in_price || item.regular_price;
  //       case 'wholesale':
  //         return item.wholesale_price || item.regular_price;
  //       case 'regular':
  //       default:
  //         return item.regular_price;
  //     }
  //   })();

  //   return parseFloat(standardPrice) || 0;
  // }, [calculateCustomPrice, calculateBracketPrice]);

 const getPriceByPriceType = useCallback((item, customer) => {
    // 1. First priority: Custom pricing for valued customers
    const customPricing = calculateCustomPrice(item, item.quantity, customer);
    if (customPricing && customPricing.price) {
      return customPricing.price;
    }

    // 2. Second priority: Bracket pricing if enabled
    if (item.use_bracket_pricing && item.price_bracket) {
      const bracketPricing = calculateBracketPrice(item, item.quantity);
      if (bracketPricing && bracketPricing.price) {
        // Use selected bracket price if available, otherwise use default
        return item.selected_bracket_price || bracketPricing.price;
      }
    }

    // 3. Fallback to standard pricing
    const standardPrice = (() => {
      switch(item.price_type || 'regular') {
        case 'walkin':
          return item.walk_in_price || item.regular_price;
        case 'wholesale':
          return item.wholesale_price || item.regular_price;
        case 'regular':
        default:
          return item.regular_price;
      }
    })();

    return parseFloat(standardPrice) || 0;
  }, [calculateCustomPrice, calculateBracketPrice]);


  const calculateItemSubtotal = useCallback((item, customer) => {
    const price = getPriceByPriceType(item, customer);
    const numericPrice = parseFloat(price) || 0;
    const subtotal = numericPrice * (item.quantity || 0);
    const discountPercentage = parseFloat(item.discount) || 0;
    const discountAmount = subtotal * (discountPercentage / 100);
    return subtotal - discountAmount;
  }, [getPriceByPriceType]);

  // Memoized handlers
  const handleOpenCompositionModal = useCallback((itemId) => {
    const item = orderItems.find(item => item.id === itemId);
    setCurrentItemId(itemId);
    setComposition(item.composition || '');
    setCompositionModalOpen(true);
  }, [orderItems]);

  const handleSaveComposition = useCallback(() => {
    onUpdateItemComposition(currentItemId, composition);
    setCompositionModalOpen(false);
  }, [currentItemId, composition, onUpdateItemComposition]);

  const handleCloseCompositionModal = useCallback(() => {
    setCompositionModalOpen(false);
  }, []);

  const hasZeroQuantityItems = orderItems.some(item => item.quantity === 0);

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
        }}
      >
        {({ errors, touched, setFieldValue, values, isValid, dirty }) => {
          // Calculate total with enhanced pricing
          const calculatedTotal = useMemo(() => {
            const itemsTotal = orderItems.reduce((sum, item) => 
              sum + calculateItemSubtotal(item, values.customer), 0
            );
            const deliveryFee = parseFloat(values.delivery_fee) || 0;
            const cuttingCharges = parseFloat(values.cutting_charges) || 0;
            return itemsTotal + deliveryFee + cuttingCharges;
          }, [orderItems, calculateItemSubtotal, values.customer, values.delivery_fee, values.cutting_charges]);

          return (
            <Form>
              <div ref={ref}>
                <Box sx={{ width: '100%', border: (ref ? '1px solid transparent' : 'none') }}>
                  {/* Header */}
                  <Box sx={{ mb:0, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                      DELIVERY REPORT
                    </Typography>
                  </Box>
                
                  {/* Customer Form Section */}
                  <CustomerFormSection
                    values={values}
                    touched={touched}
                    errors={errors}
                    setFieldValue={setFieldValue}
                    customers={customers}
                  />

                  {/* Payment Section */}
                  <PaymentSection
                    values={values}
                    setFieldValue={setFieldValue}
                    touched={touched}
                    errors={errors}
                  />

                  <Divider sx={{ mb: 1 }} />
                  
                  {/* Order Items Header */}
                  <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between' , width: '100%'  }}>
                      <Typography variant="h6" gutterBottom>
                        Order Items
                      </Typography>
                      {onOpenProductModal && (
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<ShoppingCartOutlined />}
                          onClick={onOpenProductModal}
                          sx={{ ml: 2, mb: 1 }}
                        >
                          Add Products
                        </Button>
                      )}
                    </Box>
                    {values.paymentMethod === 'term' && (
                      <Field
                        size="small"
                        as={TextField}
                        name="term_days"
                        label="Term"
                        type="number"
                        width={50}
                        sx={{ mb: 1 , ml:1 }}
                        slotProps={{
                          inputLabel: {
                            sx: { top: '1px' }, 
                          },
                        }}
                        margin="small"
                        InputProps={{ min: 0 }}
                        error={touched.term_days && !!errors.term_days}
                        helperText={touched.term_days && errors.term_days}
                      />
                    )}
                  </Box>
                  
                  {/* Order Items Table */}
                  <TableContainer component={Paper} sx={{ mb: 2}}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="center">
                            {values.customer?.is_valued_customer ? 'Pricing' : 'Bracket'}
                          </TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="center">Qty</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center">No items added to order</TableCell>
                          </TableRow>
                        ) : (
                          orderItems.map((item) => (
                            <OrderItemRow
                              key={item.id}
                              item={item}
                              customer={values.customer}
                              onQuantityChange={onQuantityChange}
                              onDiscountChange={onDiscountChange}
                              onBracketPricingChange={onBracketPricingChange}
                              onCustomPriceChange={onCustomPriceChange}
                              onRemoveProduct={onRemoveProduct}
                              onOpenCompositionModal={handleOpenCompositionModal}
                              getPriceByPriceType={getPriceByPriceType}
                              calculateBracketPrice={calculateBracketPrice}
                              calculateCustomPrice={calculateCustomPrice}
                              calculateItemSubtotal={calculateItemSubtotal}
                            />
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  {/* Pricing Summary for Valued Customers */}
                  {/* {values.customer?.is_valued_customer && orderItems.length > 0 && (
                    <Paper sx={{ p: 2, mb: 2, backgroundColor: '#fff8e1' }}>
                      <Typography variant="subtitle2" color="warning.dark" gutterBottom>
                        <StarFilled style={{ marginRight: 4 }} />
                        Valued Customer Pricing Summary
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {orderItems.map((item) => {
                          const customPricing = calculateCustomPrice(item, item.quantity, values.customer);
                          if (customPricing) {
                            return (
                              <Chip
                                key={item.id}
                                label={`${item.name}: ₱${customPricing.price.toFixed(2)} (${customPricing.range})`}
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                            );
                          }
                          return null;
                        })}
                      </Box>
                    </Paper>
                  )} */}
                  
                  {/* Total Section */}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Typography variant="body2">
                      Payment Method: {values.paymentMethod.charAt(0).toUpperCase() + values.paymentMethod.slice(1)}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                      <Field
                        size="small"
                        as={TextField}
                        name="delivery_fee"
                        label="Delivery fee"
                        type="number"
                        width={50}
                        sx={{ mb: 1 }}
                        slotProps={{
                          inputLabel: {
                            sx: { top: '1px' }, 
                          },
                        }}
                        margin="small"
                        InputProps={{ min: 0 }}
                      />
                      <Field
                        size="small"
                        as={TextField}
                        name="cutting_charges"
                        label="Cutting charges"
                        type="number"
                        width={50}
                        sx={{ mb: 1 }}
                        slotProps={{
                          inputLabel: {
                            sx: { top: '1px' }, 
                          },
                        }}
                        margin="small"
                        InputProps={{ min: 0 }}
                      />
                      <Typography variant="h6">
                        Total Amount: ₱{calculatedTotal.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </div>
              
              {/* Submit Button */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SaveOutlined />}
                    disabled={ orderItems.length === 0 ||  
                              hasZeroQuantityItems || 
                              isSubmitting || 
                              !isValid}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Delivery Report'}
                  </Button>
                </Box>
              </Box>
            </Form>
          );
        }}
      </Formik>

      {/* Composition Modal */}
      <CompositionModal
        open={compositionModalOpen}
        onClose={handleCloseCompositionModal}
        composition={composition}
        setComposition={setComposition}
        onSave={handleSaveComposition}
      />
    </>
  );
});

DeliveryReport.displayName = 'DeliveryReport';

export default DeliveryReport;