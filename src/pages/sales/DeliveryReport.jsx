import React, { useState, forwardRef } from 'react';
import {
  Typography, TextField, Box, Autocomplete, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, IconButton, InputAdornment, Button,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  Paper, Divider, Grid, Select, MenuItem, InputLabel
} from '@mui/material';
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Format date to YYYY-MM-DD for input
const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Format date for display
const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
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
  customerType: Yup.string().required('Customer type is required')
});

const DeliveryReport = forwardRef(({ 
  orderItems, 
  totalPrice, 
  customers, 
  onSubmit, 
  onRemoveProduct, 
  onQuantityChange, 
  onDiscountChange,
  onPrint
}, ref) => {
  const initialValues = {
    customer: null,
    phone: '',
    address: '',
    city: '',
    orderDate: formatDateForInput(new Date()),
    deliveryDate: formatDateForInput(new Date(Date.now() + 86400000)), // today + 1 day
    paymentMethod: 'cash',
    customerType: 'walkin' // Default to regular pricing
  };

  const getPriceByCustomerType = (item, customerType) => {
    switch(customerType) {
      case 'walkin':
        return item.walk_in_price || item.regular_price;
      case 'wholesale':
        return item.wholesale_price || item.regular_price;
      case 'regular':
      default:
        return item.regular_price;
    }
  };

  const calculateItemSubtotal = (item, customerType) => {
    const price = getPriceByCustomerType(item, customerType);
    const subtotal = Number(price) * item.quantity;
    const discountPercentage = parseFloat(item.discount) || 0;
    const discountAmount = subtotal * (discountPercentage / 100);
    return subtotal - discountAmount;
  };

  // Generate a random DR number for display purposes
  const drNumber = "DR-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit({...values, orderItems: orderItems.map(item => ({
          ...item,
          price: getPriceByCustomerType(item, values.customerType)
        }))});
        setSubmitting(false);
      }}
    >
      {({ errors, touched, setFieldValue, values, isSubmitting }) => (
        <Form>
          <div ref={ref}>
            <Box sx={{ width: '100%', border: (ref ? '1px solid transparent' : 'none') }}>
              {/* Header for DR */}
              <Box sx={{ mb:0, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  DELIVERY REPORT
                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{paddingTop :"0!important"}}>
                <Grid item xs={12} md={6} sx={{paddingTop :"0!important"}}>
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
                      setFieldValue('city', value ? value.city : '');
                    }}
                  />
                  
            
                </Grid>

                <Grid item xs={12} md={6} sx={{paddingTop :"0!important"}}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="customer-type-label">Customer Type</InputLabel>
                    <Field
                     size="small" 
                      as={Select}
                      labelId="customer-type-label"
                      id="customerType"
                      name="customerType"
                      label="Customer Type"
                      value={values.customerType}
                      onChange={(e) => setFieldValue('customerType', e.target.value)}
                    >
                      <MenuItem value="regular">Regular</MenuItem>
                      <MenuItem value="walkin">Walk-in</MenuItem>
                      <MenuItem value="wholesale">Wholesale</MenuItem>
                    </Field>
                    {touched.customerType && errors.customerType && (
                      <Typography color="error" variant="caption">{errors.customerType}</Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={12} sx={{paddingTop :"0!important"}}>
                <Field
                    as={TextField}
                    name="address"
                    label="Address"
                    fullWidth
                    margin="normal"
                    error={touched.address && !!errors.address}
                    helperText={touched.address && errors.address}
                  />
               </Grid>
               
                <Grid item xs={12} md={6} sx={{paddingTop :"0!important"}}>
                  <Field
                    as={TextField}
                    name="phone"
                    label="Phone"
                    fullWidth
                    margin="normal"
                    error={touched.phone && !!errors.phone}
                    // helperText={touched.phone && errors.phone}
                  />

                  <Field
                    as={TextField}
                    name="orderDate"
                    label="Order Date"
                    type="date"
                    disabled
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    error={touched.orderDate && !!errors.orderDate}
                    //   helperText={touched.orderDate && errors.orderDate}
                  />
                 
                </Grid>
                
                <Grid item xs={12} md={6} sx={{paddingTop :"0!important"}}>
                  <Box>
                    <Field
                      as={TextField}
                      name="city"
                      label="City"
                      fullWidth
                      margin="normal"
                      error={touched.city && !!errors.city}
                      // helperText={touched.city && errors.city}
                    />
                  </Box>
                  <Box>
                    <Field
                      as={TextField}
                      name="deliveryDate"
                      label="Delivery Date"
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={touched.deliveryDate && !!errors.deliveryDate}
                      //   helperText={touched.deliveryDate && errors.deliveryDate}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{paddingTop :"0!important"}}>
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

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Order Items</Typography>
              
              <TableContainer component={Paper} sx={{ mb: 2, maxHeight: 'auto', overflow: 'auto' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Discount (%)</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell align="right"> </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No items added to order</TableCell>
                      </TableRow>
                    ) : (
                      orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">₱{Number(getPriceByCustomerType(item, values.customerType)).toFixed(2)}</TableCell>
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
                          <TableCell align="right">₱{calculateItemSubtotal(item, values.customerType).toFixed(2)}</TableCell>
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
                  Total Amount: ₱{orderItems.reduce((sum, item) => sum + calculateItemSubtotal(item, values.customerType), 0).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </div>
          
          {/* Action buttons */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PrinterOutlined />}
              onClick={() => onPrint(values)}
              disabled={orderItems.length === 0}
            >
              Print Delivery Report
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={orderItems.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Delivery Report'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
});

export default DeliveryReport;