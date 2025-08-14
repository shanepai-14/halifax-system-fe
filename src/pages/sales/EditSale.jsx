import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid, Paper, Backdrop, CircularProgress, Snackbar, Alert, Typography, Box,
  Dialog, DialogContent, DialogTitle, IconButton, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Autocomplete, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  Divider, DialogActions, Checkbox, Tooltip, Chip, Skeleton
} from '@mui/material';
import { 
  CloseOutlined, ShoppingCartOutlined, SaveOutlined, ArrowLeftOutlined,
  DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, EditOutlined, StarFilled 
} from '@ant-design/icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Hooks and utilities
import { selectCustomers } from '@/store/slices/customerSlice';
import { selectCategories } from '@/store/slices/productsSlice';
import { useSales } from '@/hooks/useSales';
import cities from '@/utils/cities';
import { formatDate } from '@/utils/formatUtils';
import ProductList from './ProductList';

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
  deliveryDate: Yup.date().required('Delivery date is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
  term_days: Yup.string().when('paymentMethod', {
    is: 'term',
    then: (schema) => schema.required('Term days is required'),
    otherwise: (schema) => schema.notRequired()
  }),
});

// Skeleton components
const FormSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
    </Grid>
    
    <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Skeleton key={item} variant="circular" width={40} height={40} />
      ))}
    </Box>
    
    <Skeleton variant="text" width="20%" height={32} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={300} sx={{ mb: 3 }} />
    
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
      <Skeleton variant="rectangular" width={100} height={40} />
      <Skeleton variant="rectangular" width={150} height={40} />
    </Box>
  </Box>
);

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
    <TableCell align="center"><Skeleton variant="rectangular" width={24} height={24} /></TableCell>
    <TableCell align="right"><Skeleton variant="text" width="60%" /></TableCell>
    <TableCell align="center">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="rectangular" width={40} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
    </TableCell>
    <TableCell align="right"><Skeleton variant="text" width="70%" /></TableCell>
    <TableCell align="right">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
      </Box>
    </TableCell>
  </TableRow>
);

const EditSale = () => {
  const { saleId } = useParams();
  const navigate = useNavigate();
  
  // Redux selectors
  const customers = useSelector(selectCustomers);
  const categories = useSelector(selectCategories);
  
  // Custom hooks
  const { 
    getSaleById,
    updateSale,
    inventory, 
    getAllInventory, 
    isInventoryLoading,
    isSalesLoading
  } = useSales();

  // Core state
  const [saleData, setSaleData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [removedItems, setRemovedItems] = useState([]); // Track removed items
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [compositionModalOpen, setCompositionModalOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [composition, setComposition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', type: 'info' });
  
  const deliveryReportRef = useRef();

  // Load sale data on component mount
  useEffect(() => {
    const loadSaleData = async () => {
      try {
        setLoading(true);
        const sale = await getSaleById(saleId);
        if (sale) {
          setSaleData(sale);
          // Transform sale items to order items format with proper pricing data
          const transformedItems = sale.items.map(item => ({
            id: item.product.id,
            name: item.product.product_name,
            regular_price: parseFloat(item.product.regular_price) || 0,
            walk_in_price: parseFloat(item.product.walk_in_price) || 0,
            wholesale_price: parseFloat(item.product.wholesale_price) || 0,
            cost_price: parseFloat(item.product.cost_price) || 0,
            distribution_price: parseFloat(item.distribution_price) || 0,
            quantity: parseInt(item.quantity) || 0,
            sold_price: parseFloat(item.sold_price) || 0,
            discount: parseFloat(item.discount) || 0,
            price_type: item.price_type || 'regular',
            composition: item.composition || '',
            product: {
              ...item.product,
              regular_price: parseFloat(item.product.regular_price) || 0,
              walk_in_price: parseFloat(item.product.walk_in_price) || 0,
              wholesale_price: parseFloat(item.product.wholesale_price) || 0,
              cost_price: parseFloat(item.product.cost_price) || 0,
            },
            price_bracket: item.product.price_bracket || null,
            use_bracket_pricing: false,
            selected_bracket_price: null,
            sale_item_id: item.id // Keep track of original sale item ID
          }));
          setOrderItems(transformedItems);
        }
      } catch (error) {
        console.error('Error loading sale data:', error);
        setAlertInfo({
          open: true,
          message: 'Failed to load sale data',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (saleId) {
      loadSaleData();
      getAllInventory();
    }
  }, [saleId]);

  // Set products when inventory is loaded
  useEffect(() => {
    if (inventory && inventory.length > 0) {
      setProducts(inventory);
    }
  }, [inventory]);

  // Pricing calculation functions (similar to NewOrderPage)
  const calculateCustomPrice = useCallback((item, quantity, customer) => {
    if (!customer?.is_valued_customer || !customer.custom_pricing_groups) {
      return null;
    }

    const productPricing = customer.custom_pricing_groups.find(
      group => group.product_id === item.id
    );

    if (!productPricing) {
      return null;
    }

    const matchingRange = productPricing.price_ranges
      .filter(range => 
        range.is_active &&
        quantity >= range.min_quantity &&
        (range.max_quantity === null || quantity <= range.max_quantity)
      )
      .sort((a, b) => b.min_quantity - a.min_quantity)[0];

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

  const calculateBracketPrice = useCallback((item, quantity) => {
    if (!item.price_bracket || !item.use_bracket_pricing) return null;
    
    const priceType = item.price_type || 'regular';
    
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

    const matchingGroup = Object.values(quantityGroups).find(group =>
      quantity >= group.min_quantity &&
      (group.max_quantity === null || quantity <= group.max_quantity)
    );

    if (!matchingGroup) return null;

    matchingGroup.prices.sort((a, b) => a - b);

    return {
      available: true,
      price: item.selected_bracket_price || matchingGroup.prices[0],
      options: matchingGroup.prices.length > 1 ? matchingGroup.prices : null,
      source: 'bracket_pricing'
    };
  }, []);

  const getPriceByPriceType = useCallback((item, customer) => {
    // For loaded sale items, prioritize the sold_price if it exists and is valid
    if (item.sale_item_id && item.sold_price && item.sold_price > 0) {
      return parseFloat(item.sold_price);
    }

    // 1. First priority: Custom pricing for valued customers
    const customPricing = calculateCustomPrice(item, item.quantity, customer);
    if (customPricing && customPricing.price) {
      return customPricing.price;
    }

    // 2. Second priority: Bracket pricing if enabled
    if (item.use_bracket_pricing && item.price_bracket) {
      const bracketPricing = calculateBracketPrice(item, item.quantity);
      if (bracketPricing && bracketPricing.price) {
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
    let price;
    
    // For loaded sale items, use the sold_price if available
    if (item.sale_item_id && item.sold_price && item.sold_price > 0) {
      price = parseFloat(item.sold_price);
    } else {
      price = getPriceByPriceType(item, customer);
    }
    
    const numericPrice = parseFloat(price) || 0;
    const subtotal = numericPrice * (item.quantity || 0);
    const discountPercentage = parseFloat(item.discount) || 0;
    const discountAmount = subtotal * (discountPercentage / 100);
    return subtotal - discountAmount;
  }, [getPriceByPriceType]);

  // Item manipulation handlers
  const handleAddProduct = useCallback((product) => {
    if (product.quantity > 0) {
      setOrderItems(prev => {
        const existingItem = prev.find(item => item.id === product.id);
        if (existingItem) {
          return prev.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prev, { 
            ...product, 
            quantity: 1, 
            discount: 0,
            distribution_price: product.distribution_price || product.cost_price || 0,
            price_type: 'regular',
            price_bracket: product.price_bracket,
            use_bracket_pricing: false,
            selected_bracket_price: null
          }];
        }
      });
      
      setProducts(prev => prev.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
      ));
    }
  }, []);

  const handleRemoveProduct = useCallback((productId) => {
    const removedItem = orderItems.find(item => item.id === productId);
    if (removedItem) {
      // If this item exists in the original sale, track it for deletion
      if (removedItem.sale_item_id) {
        setRemovedItems(prev => [...prev, removedItem.sale_item_id]);
      }
      
      setOrderItems(prev => prev.filter(item => item.id !== productId));
      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, quantity: p.quantity + removedItem.quantity } : p
      ));
    }
  }, [orderItems]);

  const handleQuantityChange = useCallback((productId, change, newQuantity = null) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id === productId) {
        const oldQuantity = item.quantity;
        let updatedQuantity;
        
        if (newQuantity !== null) {
          updatedQuantity = Math.max(0, newQuantity);
        } else {
          updatedQuantity = Math.max(0, item.quantity + change);
        }
        
        const product = products.find(p => p.id === productId);
        const availableInventory = product ? product.quantity : 0;
        const maxAllowedQuantity = availableInventory + oldQuantity;
        
        if (updatedQuantity > maxAllowedQuantity) {
          setAlertInfo({
            open: true,
            message: `Cannot exceed available inventory. Maximum available: ${maxAllowedQuantity}`,
            type: 'warning'
          });
          updatedQuantity = maxAllowedQuantity;
        }
        
        setProducts(prevProducts => prevProducts.map(p =>
          p.id === productId ? { ...p, quantity: p.quantity + (oldQuantity - updatedQuantity) } : p
        ));
        
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    }));
  }, [products]);

  const handleDiscountChange = useCallback((productId, discountValue) => {
    const discount = discountValue === '' ? 0 : Math.min(Math.max(0, parseFloat(discountValue) || 0), 100);
    setOrderItems(prev => prev.map(item =>
      item.id === productId ? { ...item, discount } : item
    ));
  }, []);

  const handleBracketPricingChange = useCallback((productId, useBracket) => {
    setOrderItems(prev => prev.map(item =>
      item.id === productId ? { 
        ...item, 
        use_bracket_pricing: useBracket,
        selected_bracket_price: useBracket ? null : null
      } : item
    ));
  }, []);

  const handleCustomPriceChange = useCallback((itemId, selectedPrice) => {
    setOrderItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, selected_bracket_price: selectedPrice }
        : item
    ));
  }, []);

  const handleUpdateItemComposition = useCallback((productId, compositionText) => {
    setOrderItems(prev => prev.map(item =>
      item.id === productId ? { ...item, composition: compositionText } : item
    ));
  }, []);

  // Composition modal handlers
  const handleOpenCompositionModal = useCallback((itemId) => {
    const item = orderItems.find(item => item.id === itemId);
    setCurrentItemId(itemId);
    setComposition(item.composition || '');
    setCompositionModalOpen(true);
  }, [orderItems]);

  const handleSaveComposition = useCallback(() => {
    handleUpdateItemComposition(currentItemId, composition);
    setCompositionModalOpen(false);
  }, [currentItemId, composition, handleUpdateItemComposition]);

  // UI handlers
  const handleOpenProductModal = useCallback(() => {
    setProductModalOpen(true);
  }, []);

  const handleCloseProductModal = useCallback(() => {
    setProductModalOpen(false);
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertInfo(prev => ({ ...prev, open: false }));
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Submit handler
  const handleSubmitUpdate = useCallback(async (formData) => {
    if (orderItems.length === 0) {
      setAlertInfo({
        open: true,
        message: 'Please add at least one item to the order',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        customer_id: formData.customer?.id,
        customer: {
          id: formData.customer?.id,
          customer_name: formData.customer?.customer_name || 'Walk-in Customer',
          contact_number: formData.phone || '',
          email: formData.customer?.email || '',
          address: formData.address || '',
          city: formData.city || ''
        },
        payment_method: formData.paymentMethod,
        delivery_date: formData.deliveryDate,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        term_days: formData.term_days,
        delivery_fee: parseFloat(formData.delivery_fee) || 0,
        cutting_charges: parseFloat(formData.cutting_charges) || 0,
        items: orderItems.map(item => ({
          id: item.sale_item_id || null, // Include ID for existing items
          product_id: item.id,
          quantity: item.quantity,
          distribution_price: item.distribution_price || item.cost_price || 0,
          sold_price: getPriceByPriceType(item, formData.customer),
          discount: item.discount || 0,
          price_type: item.price_type || 'regular',
          composition: item.composition
        })),
        removed_items: removedItems // Include removed item IDs
      };

      const result = await updateSale(saleId, updateData);
      
      if (result) {
        setAlertInfo({
          open: true,
          message: 'Sale updated successfully!',
          type: 'success'
        });
        
        // Navigate back to sale view after a brief delay
        setTimeout(() => {
          navigate(`/app/delivery-report/${saleId}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating sale:', error);
      setAlertInfo({
        open: true,
        message: error.message || 'Failed to update sale',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [orderItems, removedItems, getPriceByPriceType, updateSale, saleId, navigate]);

  // Get initial values for the form
  const getInitialValues = useCallback(() => {
    if (!saleData) return {};
    
    return {
      customer: saleData.customer || null,
      phone: saleData.phone || '',
      address: saleData.address || '',
      city: saleData.city || '',
      business: saleData.customer?.business_name || 'N/A',
      deliveryDate: formatDateForInput(saleData.delivery_date),
      paymentMethod: saleData.payment_method || '',
      term_days: saleData.term_days || '',
      delivery_fee: saleData.delivery_fee || 0,
      cutting_charges: saleData.cutting_charges || 0
    };
  }, [saleData]);

  // Calculate total
  const totalPrice = useMemo(() => {
    return orderItems.reduce((sum, item) => {
      return sum + calculateItemSubtotal(item, saleData?.customer);
    }, 0);
  }, [orderItems, calculateItemSubtotal, saleData?.customer]);

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <FormSkeleton />
      </Paper>
    );
  }

  if (!saleData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Sale not found</Typography>
        <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleGoBack}>
              <ArrowLeftOutlined />
            </IconButton>
            <Typography variant="h5">Edit Sale - {saleData.invoice_number}</Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ShoppingCartOutlined />}
            onClick={handleOpenProductModal}
          >
            Add Products
          </Button>
        </Box>

        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleSubmitUpdate}
        >
          {({ errors, touched, setFieldValue, values, isValid }) => {
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
                {/* Customer Information */}
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Field
                      name="customer"
                      component={({ field }) => (
                        <Autocomplete
                          {...field}
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
                          onChange={(_, value) => {
                            setFieldValue('customer', value);
                            setFieldValue('phone', value?.contact_number || '');
                            setFieldValue('address', value?.address || '');
                            const selectedCity = cities.find(city => city.name === value?.city);
                            setFieldValue('city', selectedCity?.name || '');
                            setFieldValue('business', value?.business_name || 'N/A');
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="business"
                      label="Business"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={touched.business && !!errors.business}
                      helperText={touched.business && errors.business}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="address"
                      label="Address"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={touched.address && !!errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      name="phone"
                      label="Phone"
                      size="small"
                      fullWidth
                      margin="normal"
                      error={touched.phone && !!errors.phone}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      name="city"
                      component={({ field }) => (
                        <Autocomplete
                          {...field}
                          size="small"
                          options={cities}
                          getOptionLabel={(option) => option.province ? `${option.name}, ${option.province}` : option.name}
                          value={cities.find(city => 
                            city.name === values.city || 
                            (city.province && `${city.name}, ${city.province}` === values.city)
                          ) || null}
                          onChange={(event, newValue) => {
                            const cityValue = newValue ? 
                              (newValue.province ? `${newValue.name}, ${newValue.province}` : newValue.name) : "";
                            setFieldValue("city", cityValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="City"
                              error={touched.city && !!errors.city}
                              helperText={touched.city && errors.city}
                              fullWidth
                              margin="normal"
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Field
                      as={TextField}
                      name="deliveryDate"
                      label="Delivery Date"
                      type="date"
                      size="small"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={touched.deliveryDate && !!errors.deliveryDate}
                      helperText={touched.deliveryDate && errors.deliveryDate}
                    />
                  </Grid>
                </Grid>

                {/* Payment Method */}
                <Typography variant="h6" gutterBottom>Payment Information</Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={8}>
                    <FormControl component="fieldset" margin="normal" fullWidth>
                      <FormLabel component="legend">Payment Method</FormLabel>
                      <Field
                        name="paymentMethod"
                        component={({ field }) => (
                          <RadioGroup
                            {...field}
                            row
                            onChange={(e) => setFieldValue('paymentMethod', e.target.value)}
                          >
                            <FormControlLabel value="cod" control={<Radio />} label="COD" />
                            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                            <FormControlLabel value="cheque" control={<Radio />} label="Cheque" />
                            <FormControlLabel value="online" control={<Radio />} label="Online Payment" />
                            <FormControlLabel value="term" control={<Radio />} label="Term" />
                          </RadioGroup>
                        )}
                      />
                      {touched.paymentMethod && errors.paymentMethod && (
                        <Typography color="error" variant="caption">{errors.paymentMethod}</Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {values.paymentMethod === 'term' && (
                    <Grid item xs={12} md={4}>
                      <Field
                        as={TextField}
                        name="term_days"
                        label="Term (Days)"
                        type="number"
                        size="small"
                        fullWidth
                        margin="normal"
                        InputProps={{ min: 0 }}
                        error={touched.term_days && !!errors.term_days}
                        helperText={touched.term_days && errors.term_days}
                      />
                    </Grid>
                  )}
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Order Items */}
                <Typography variant="h6" gutterBottom>Order Items</Typography>
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
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
                      {loading ? (
                        // Show skeleton rows while loading
                        Array.from({ length: 3 }).map((_, index) => (
                          <TableRowSkeleton key={index} />
                        ))
                      ) : orderItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">No items in order</TableCell>
                        </TableRow>
                      ) : (
                        orderItems.map((item) => (
                          <React.Fragment key={item.id}>
                            <TableRow>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span>{item.name}</span>
                                  {values.customer?.is_valued_customer && calculateCustomPrice(item, item.quantity, values.customer) && (
                                    <StarFilled style={{ color: '#ffa726' }} />
                                  )}
                                </Box>
                              </TableCell>
                              
                              <TableCell align="center">
                                {(!values.customer?.is_valued_customer || !calculateCustomPrice(item, item.quantity, values.customer)) && (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={item.use_bracket_pricing || false}
                                        onChange={(e) => handleBracketPricingChange(item.id, e.target.checked)}
                                        size="small"
                                        disabled={!item.price_bracket}
                                      />
                                    }
                                    label=""
                                    sx={{ m: 0, opacity: item.price_bracket ? 1 : 0.3 }}
                                  />
                                )}
                                {values.customer?.is_valued_customer && calculateCustomPrice(item, item.quantity, values.customer) && (
                                  <Typography variant="caption" color="warning.main">
                                    Auto Applied
                                  </Typography>
                                )}
                              </TableCell>
                              
                              <TableCell align="right">
                                ₱{getPriceByPriceType(item, values.customer).toFixed(2)}
                              </TableCell>
                              
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleQuantityChange(item.id, -1)} 
                                    disabled={item.quantity <= 0}
                                  >
                                    <MinusCircleOutlined />
                                  </IconButton>
                                  <TextField
                                    value={item.quantity || 0}
                                    onChange={(e) => handleQuantityChange(item.id, 0, parseInt(e.target.value) || 0)}
                                    inputProps={{ 
                                      style: { 
                                        textAlign: 'center', 
                                        width: '40px',
                                        color: item.quantity === 0 ? '#f57c00' : 'inherit'
                                      },
                                      min: 0
                                    }}
                                    size="small"
                                    error={item.quantity === 0}
                                  />
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                  >
                                    <PlusCircleOutlined />
                                  </IconButton>
                                </Box>
                              </TableCell>
                              
                              <TableCell align="right">
                                ₱{calculateItemSubtotal(item, values.customer).toLocaleString(undefined, { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 2 
                                })}
                              </TableCell>
                              
                              <TableCell align="right">
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => handleOpenCompositionModal(item.id)}
                                    title="Add/Edit Composition"
                                  >
                                    <EditOutlined />
                                  </IconButton>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleRemoveProduct(item.id)}
                                  >
                                    <DeleteOutlined />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </TableRow>
                            
                            {/* Composition row */}
                            {item.composition && (
                              <TableRow>
                                <TableCell colSpan={6} style={{ paddingTop: 0, paddingBottom: 8 }}>
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pricing Summary for Valued Customers */}
                {values.customer?.is_valued_customer && orderItems.length > 0 && (
                  <Paper sx={{ p: 2, mb: 2, backgroundColor: '#fff8e1' }}>
                    <Typography variant="subtitle2" color="warning.dark" gutterBottom>
                      <StarFilled style={{ marginRight: 4 }} />
                      Valued Customer Pricing Applied
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
                )}

                {/* Additional Charges and Total */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mt: 3 }}>
                  <Typography variant="body2">
                    Payment Method: {values.paymentMethod?.charAt(0).toUpperCase() + values.paymentMethod?.slice(1)}
                    {values.paymentMethod === 'term' && values.term_days && ` (${values.term_days} days)`}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    <Field
                      as={TextField}
                      name="delivery_fee"
                      label="Delivery Fee"
                      type="number"
                      size="small"
                      sx={{ width: '150px' }}
                      InputProps={{ min: 0, startAdornment: '₱' }}
                    />
                    <Field
                      as={TextField}
                      name="cutting_charges"
                      label="Cutting Charges"
                      type="number"
                      size="small"
                      sx={{ width: '150px' }}
                      InputProps={{ min: 0, startAdornment: '₱' }}
                    />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      Total Amount: ₱{calculatedTotal.toLocaleString(undefined, { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Submit Button */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={handleGoBack}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SaveOutlined />}
                    disabled={
                      orderItems.length === 0 ||
                      orderItems.some(item => item.quantity === 0) ||
                      isSubmitting ||
                      !isValid
                    }
                  >
                    {isSubmitting ? 'Updating...' : 'Update Sale'}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Paper>

      {/* Product List Modal */}
      <Dialog
        open={productModalOpen}
        onClose={handleCloseProductModal}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Add Products</Typography>
            <IconButton onClick={handleCloseProductModal} size="small">
              <CloseOutlined />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <ProductList 
            products={products}
            categories={categories}
            onAddProduct={handleAddProduct}
            isInModal={true}
            onMinimize={null}
          />
        </DialogContent>
      </Dialog>

      {/* Composition Modal */}
      <Dialog
        open={compositionModalOpen}
        onClose={() => setCompositionModalOpen(false)}
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
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  ['clean']
                ],
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompositionModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveComposition} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert for notifications */}
      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertInfo.type} sx={{ width: '100%' }}>
          {alertInfo.message}
        </Alert>
      </Snackbar>


    </>
  );
};

export default EditSale;