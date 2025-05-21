import React, { useState, forwardRef } from 'react';
import {
  Typography, TextField, Box, Autocomplete, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, IconButton, InputAdornment, Button,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  Paper, Divider, Grid, Select, MenuItem,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
  DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined, 
  SaveOutlined, ShoppingCartOutlined, EditOutlined 
} from '@ant-design/icons';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import cities from '@/utils/cities';
import ReactQuill from 'react-quill'; // Import the rich text editor
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

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
  onUpdateItemComposition, // New prop to handle composition updates
  isSubmitting = false,
  onOpenProductModal
}, ref) => {
  // State for composition modal
  const [compositionModalOpen, setCompositionModalOpen] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [composition, setComposition] = useState('');

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

  // Function to open composition modal
  const handleOpenCompositionModal = (itemId) => {
    const item = orderItems.find(item => item.id === itemId);
    setCurrentItemId(itemId);
    setComposition(item.composition || '');
    setCompositionModalOpen(true);
  };

  // Function to save composition
  const handleSaveComposition = () => {
    // Update the orderItems with the new composition
    onUpdateItemComposition(currentItemId, composition);
    setCompositionModalOpen(false);
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
    <>
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
                
                <TableContainer component={Paper} sx={{ mb: 2}}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Price Type</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Qty</TableCell>
                        <TableCell align="right">Discount (%)</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">No items added to order</TableCell>
                        </TableRow>
                      ) : (
                        orderItems.map((item) => (
                          <React.Fragment key={item.id}>
                            <TableRow>
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
                                    onClick={() => onRemoveProduct(item.id)}
                                  >
                                    <DeleteOutlined />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </TableRow>
                            
                            {/* Composition row - only show if composition exists */}
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

      {/* Composition Modal - now inside the main component return */}
      <Dialog
        open={compositionModalOpen}
        onClose={() => setCompositionModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Composition
        </DialogTitle>
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
    </>
  );
});

export default DeliveryReport;