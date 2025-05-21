import React, { useState, forwardRef } from 'react';
import {
  Typography, TextField, Box, Autocomplete, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, IconButton, InputAdornment, Button,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  Paper, Divider, Grid, Select, MenuItem,
  CircularProgress
} from '@mui/material';
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, SaveOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import cities from '@/utils/cities';

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
});

const DeliveryReport = forwardRef(({ 
  orderItems, 
  totalPrice, 
  customers, 
  onSubmit, 
  onRemoveProduct, 
  onQuantityChange, 
  onDiscountChange,
  onPriceTypeChange,
  isSubmitting = false,
  onOpenProductModal
}, ref) => {
  const initialValues = {
    customer: null,
    phone: '',
    address: '',
    city: '',
    business: '',
    orderDate: formatDateForInput(new Date()),
    deliveryDate: formatDateForInput(new Date(Date.now() + 86400000)), // today + 1 day
    paymentMethod: '',
    term_days: null,
  };

  // Get the appropriate price based on the selected price type for the item
  const getPriceByPriceType = (item) => {
    switch(item.price_type || 'regular') {
      case 'walkin':
        return item.walk_in_price || item.regular_price;
      case 'wholesale':
        return item.wholesale_price || item.regular_price;
      case 'regular':
      default:
        return item.regular_price;
    }
  };

  const calculateItemSubtotal = (item) => {
    const price = getPriceByPriceType(item);
    const subtotal = Number(price) * item.quantity;
    const discountPercentage = parseFloat(item.discount) || 0;
    const discountAmount = subtotal * (discountPercentage / 100);
    return subtotal - discountAmount;
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
      }}
    >
      {({ errors, touched, setFieldValue, values, isValid, dirty }) => (
        <Form>
          <div ref={ref}>
            <Box sx={{ width: '100%', border: (ref ? '1px solid transparent' : 'none') }}>
              {/* Header for DR */}
              <Box sx={{ mb:0, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  DELIVERY REPORT
                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{paddingTop: "0!important"}}>
                <Grid item xs={12} md={6} sx={{paddingTop: "0!important"}}>
                  <Field
                    name="customer"
                    component={Autocomplete}
                    size="small" 
                    options={customers}
                    getOptionLabel={(option) => option.customer_name}
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
                      />
                    )}
                    onChange={(_, value) => {
                      setFieldValue('customer', value);
                      setFieldValue('phone', value ? value.contact_number : '');
                      setFieldValue('address', value ? value.address : '');
                      const selectedCity = cities.find(city => city.name === value?.city);
                      setFieldValue('city', selectedCity?.name || '');
                      console.log(selectedCity?.name);
                      setFieldValue('business', value ? value.business_name ? value.business_name : 'N/A' : '');
                    }}
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
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    error={touched.orderDate && !!errors.orderDate}
                    helperText={touched.orderDate && errors.orderDate}
                  />
                </Grid>
                
                <Grid item xs={12} md={6} sx={{paddingTop: "0!important"}}>
                  <Box>
                  <Autocomplete
                size="small"
                options={cities}
                getOptionLabel={(option) => `${option.name}`}
                isOptionEqualToValue={(option, value) => option.name === value?.name}
                value={cities.find(city => city.name === values.city) || null}
                onChange={(event, newValue) => {
                  setFieldValue("city", newValue ? newValue.name : ""); // Store only the city name
                }}
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


                  </Box>
                  <Box>
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
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{paddingTop: "0!important"}}>
                  <FormControl component="fieldset" margin="normal" fullWidth>
                    <FormLabel component="legend">Payment Method</FormLabel>
                    <RadioGroup
                      row
                      name="paymentMethod"
                      value={values.paymentMethod}
                      onChange={(e) => setFieldValue('paymentMethod', e.target.value)}
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
              
              </Grid>

              <Divider sx={{ mb: 1 }} />
              
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>Order Items</Typography>
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
                  sx={{
                    mb: 1,
                  }}
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
              
              <TableContainer component={Paper} sx={{ mb: 2, maxHeight: '300px', overflow: 'auto' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price Type</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Discount (%)</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">No items added to order</TableCell>
                      </TableRow>
                    ) : (
                      orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Select
                              value={item.price_type || 'regular'}
                              onChange={(e) => onPriceTypeChange(item.id, e.target.value)}
                              size="small"
                              fullWidth
                            >
                              <MenuItem value="regular">Regular</MenuItem>
                              <MenuItem value="walkin">Walk-in</MenuItem>
                              <MenuItem value="wholesale">Wholesale</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell align="right">₱{Number(getPriceByPriceType(item)).toFixed(2)}</TableCell>
                          <TableCell align="center" sx={{ display: 'flex', justifyContent: 'center', alignItems: "center"}} >
                            <IconButton size="small" onClick={() => onQuantityChange(item.id, -1)}>
                              <MinusCircleOutlined />
                            </IconButton>
                            <TextField
                              value={item.quantity}
                              onChange={(e) => onQuantityChange(item.id, 0, parseInt(e.target.value) || 0)}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowLeft') onQuantityChange(item.id, -1);
                                if (e.key === 'ArrowRight') onQuantityChange(item.id, 1);
                              }}
                              inputProps={{ style: { textAlign: 'center', width: '40px' } }}
                              size="small"
                            />
                            <IconButton size="small" onClick={() => onQuantityChange(item.id, 1)}>
                              <PlusCircleOutlined />
                            </IconButton>
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              value={item.discount || 0}
                              onChange={(e) => onDiscountChange(item.id, e.target.value)}
                              InputProps={{
                                style: { textAlign: 'right', width: '80px' },
                                min: 0,
                                max: 100,
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">₱{calculateItemSubtotal(item).toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => onRemoveProduct(item.id)}>
                              <DeleteOutlined />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                  Payment Method: {values.paymentMethod.charAt(0).toUpperCase() + values.paymentMethod.slice(1)}
                </Typography>
                <Typography variant="h6">
                  Total Amount: ₱{orderItems.reduce((sum, item) => sum + calculateItemSubtotal(item), 0).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </div>
          
          {/* Action buttons */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : <SaveOutlined />}
                disabled={orderItems.length === 0 || isSubmitting || !isValid}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Delivery Report'}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
});

export default DeliveryReport;