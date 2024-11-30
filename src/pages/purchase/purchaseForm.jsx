import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
} from '@mui/material';
import { DeleteOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import {  useCreateSupplier } from '@/hooks/useSuppliers';
import { useCreatePurchaseOrder } from '@/hooks/usePurchaseOrders';
import AddSupplierModal from '../supplier/addSupplierModal';
import {
    selectProducts,
    selectSuppliers,

  } from '@/store/slices/productsSlice';

const initialFormState = {
  supplier_id: '',
  po_date: new Date().toISOString().split('T')[0],
  remarks: '',
  items: [
    {
      product_id: '',
      requested_quantity: 1,
      price: 0
    }
  ]
};

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const products = useSelector(selectProducts); 
  const suppliers = useSelector(selectSuppliers); 

  const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);


  const createPOMutation = useCreatePurchaseOrder();
  const createSupplierMutation = useCreateSupplier();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await createPOMutation.mutateAsync(formData);
      navigate('/app/purchase');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const handleAddSupplier = async (newSupplier) => {
    try {
      await createSupplierMutation.mutateAsync(newSupplier);
      handleCloseAddSupplierModal();
    } catch (error) {
      console.error('Error creating supplier:', error);
    }
  };

  const handleOpenAddSupplierModal = () => {
    setOpenAddSupplierModal(true);
  };

  const handleCloseAddSupplierModal = () => {
    setOpenAddSupplierModal(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product_id: '', requested_quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: updatedItems }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => 
      sum + (item.price * item.requested_quantity), 0
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/app/purchase')}>
          <ArrowLeftOutlined />
        </IconButton>
        <Typography variant="h5">
          Create Purchase Order
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              value={suppliers?.find(supplier => supplier.supplier_id === formData.supplier_id) || null}
              onChange={(e, newValue) => handleChange({ target: { name: 'supplier_id', value: newValue ? newValue.supplier_id : '' }})}
              options={suppliers || []}
              getOptionLabel={(option) => option.supplier_name || ''}
              isOptionEqualToValue={(option, value) => option.supplier_id === value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Supplier"
                  name="supplier_id"
                  error={!!errors.supplier_id}
                  helperText={errors.supplier_id}
                  sx={{
                    '& .MuiInputBase-root': {
                      padding: '4px 8px',
                    },
                    '& .MuiFormLabel-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              )}
            />

          </Grid>
          <Grid item xs="auto" sx={{paddingLeft:0}}>
            <IconButton sx={{marginLeft:"0px !important"}} onClick={handleOpenAddSupplierModal}>
            <PlusOutlined />
            </IconButton>
           </Grid>
          <Grid item xs={12} md={5} ml={7}>
            <TextField
              fullWidth
              type="date"
              name="po_date"
              label="PO Date"
              value={formData.po_date}
              onChange={handleChange}
              error={!!errors.po_date}
              helperText={errors.po_date}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell width={50} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Autocomplete
                          value={products?.find(product => product.id === item.product_id) || null}
                          onChange={(e, newValue) => handleItemChange(index, 'product_id', newValue ? newValue.id : '')}
                          options={products || []}
                          getOptionLabel={(option) => option.product_name || ''}
                          isOptionEqualToValue={(option, value) => option.id === value}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              sx={{
                                '& .MuiInputBase-root': {
                                  padding: '4px 8px',
                                },
                                '& .MuiFormLabel-root': {
                                  fontSize: '0.875rem',
                                }
                              }}
                              error={!!errors[`items.${index}.product_id`]}
                              helperText={errors[`items.${index}.product_id`] && 'Please select a product'}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.requested_quantity}
                          onChange={(e) => handleItemChange(index, 'requested_quantity', e.target.value)}
                          error={!!errors[`items.${index}.requested_quantity`]}
                          inputProps={{ min: 1 }}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          error={!!errors[`items.${index}.price`]}
                          inputProps={{ min: 0, step: 0.01 }}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        ₱{(item.price * item.requested_quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => removeItem(index)}
                          disabled={formData.items.length === 1}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                startIcon={<PlusOutlined />}
                onClick={addItem}
              >
                Add Item
              </Button>
              <Typography variant="h6">
                Total: ₱{calculateTotal().toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="remarks"
              label="Remarks"
              value={formData.remarks}
              onChange={handleChange}
              error={!!errors.remarks}
              helperText={errors.remarks}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/app/purchase')}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                type="submit"
                disabled={createPOMutation.isPending}
              >
                Create Purchase Order
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <AddSupplierModal
        open={openAddSupplierModal}
        handleClose={handleCloseAddSupplierModal}
        handleAddSupplier={handleAddSupplier}
      />
    </Container>
  );
};

export default CreatePurchaseOrder;