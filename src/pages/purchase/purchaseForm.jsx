import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import { toast } from 'sonner';
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
import { selectCostTypes } from '@/store/slices/productsSlice';
import AddSupplierModal from '../supplier/SupplierModal';
import AddCostTypeModal from '../product/AddCostTypeModal';

import {
    selectAttributes,
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
  ],
  // additional_costs: []
};

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const products = useSelector(selectProducts); 
  const attributes = useSelector(selectAttributes);
  const suppliers = useSelector(selectSuppliers); 
  const costTypes = useSelector(selectCostTypes);

  const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);
  const [openCostTypeModal, setOpenCostTypeModal] = useState(false);
  


  const createPOMutation = useCreatePurchaseOrder();
  const createSupplierMutation = useCreateSupplier();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    // Validate supplier
    if (!formData.supplier_id) {
      newErrors.supplier_id = 'Supplier is required';
    }
    
    // Validate items
    formData.items.forEach((item, index) => {
      // Check if product is selected
      if (!item.product_id) {
        newErrors[`items.${index}.product_id`] = 'Product is required';
      }

      if (!item.attribute_id) {
        newErrors[`items.${index}.attribute_id`] = 'Measurement is required';
      }
  
      // Check quantity
      if (!item.requested_quantity || item.requested_quantity <= 0) {
        newErrors[`items.${index}.requested_quantity`] = 'Quantity must be greater than 0';
      }
  
      // Check price
      if (!item.price || item.price <= 0) {
        newErrors[`items.${index}.price`] = 'Price must be greater than 0';
      }
  
      // Check for duplicate products
      const productOccurrences = formData.items.filter(i => i.product_id === item.product_id).length;
      if (item.product_id && productOccurrences > 1) {
        newErrors[`items.${index}.product_id`] = 'Duplicate product is not allowed';
      }

      
    });

    // formData.additional_costs.forEach((cost, index) => {
    //   if (!cost.cost_type_id) {
    //     newErrors[`additional_costs.${index}.cost_type_id`] = 'Cost type is required';
    //   }
    //   if (!cost.amount || Number(cost.amount) <= 0) {
    //     newErrors[`additional_costs.${index}.amount`] = 'Amount must be greater than 0';
    //   }
    // });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields correctly');
      return;
    }
  
    try {
      await createPOMutation.mutateAsync(formData);
      navigate('/app/purchase');
      toast.success('Successfully Created Purchase Order');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error('Something went wrong please try again');
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

  const handleAddCost = () => {
    setFormData(prev => ({
      ...prev,
      additional_costs: [
        ...prev.additional_costs,
        { cost_type_id: '', amount: '', remarks: '' }
      ]
    }));
  };

  const handleCostChange = (index, field, value) => {
    if (field === 'cost_type_id' && value) {
      // Check for duplicate cost type
      const isDuplicate = formData.additional_costs.some(
        (cost, i) => i !== index && cost.cost_type_id === value
      );
      
      if (isDuplicate) {
        setErrors(prev => ({
          ...prev,
          [`additional_costs.${index}.cost_type_id`]: 'This cost type is already added'
        }));
        return;
      }
    }
  
    const updatedCosts = [...formData.additional_costs];
    updatedCosts[index] = {
      ...updatedCosts[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, additional_costs: updatedCosts }));
    
    // Clear error for this field if it exists
    if (errors[`additional_costs.${index}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`additional_costs.${index}.${field}`];
        return newErrors;
      });
    }
  };

  const removeCost = (index) => {
    const updatedCosts = formData.additional_costs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, additional_costs: updatedCosts }));
  };

  const calculateTotalWithCosts = () => {
    const itemsTotal = calculateTotal();
    const costsTotal = formData.additional_costs.reduce((sum, cost) => 
      sum + (Number(cost.amount) || 0), 0
    );
    return itemsTotal + costsTotal;
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
    if (field === 'product_id' && value) {
      // Check for duplicate product
      const isDuplicate = formData.items.some(
        (item, i) => i !== index && item.product_id === value
      );
      
      if (isDuplicate) {
        setErrors(prev => ({
          ...prev,
          [`items.${index}.product_id`]: 'This product is already added'
        }));
        return;
      }
    }
  
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, items: updatedItems }));
    
    // Clear error for this field if it exists
    if (errors[`items.${index}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`items.${index}.${field}`];
        return newErrors;
      });
    }
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
             size="small"
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
          <Grid item xs={12} md={4} ml={7}>
            <TextField
              size="small"
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
                    <TableCell>Measurement</TableCell>
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
                        size="small"
                         sx={{ width: 300 }}
                        value={products?.find(product => product.id === item.product_id) || null}
                        onChange={(e, newValue) => handleItemChange(index, 'product_id', newValue ? newValue.id : '')}
                        options={products?.filter(product => 
                        !formData.items.some((item, i) => i !== index && item.product_id === product.id)
                        ) || []}
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
                            helperText={errors[`items.${index}.product_id`] || 'Required'}
                        />
                        )}
                    />
                    </TableCell>
                    <TableCell>
                    <Autocomplete
                        size="small"
                        sx={{ width: 200 }}
                        value={attributes?.find(attribute => attribute.id === item.attribute_id) || null}
                        onChange={(e, newValue) => handleItemChange(index, 'attribute_id', newValue ? newValue.id : '')}
                        options={attributes || []} 
                        getOptionLabel={(option) => `${option.attribute_name} (${option.unit_of_measurement})` || ''}
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
                            error={!!errors[`items.${index}.attribute_id`]}
                            helperText={errors[`items.${index}.attribute_id`] || 'Required'}
                        />
                        )}
                    />
                    </TableCell>
                    <TableCell>
                    <TextField
                       size="small"
                        type="number"
                        value={item.requested_quantity}
                        onChange={(e) => handleItemChange(index, 'requested_quantity', e.target.value)}
                        error={!!errors[`items.${index}.requested_quantity`]}
                        helperText={errors[`items.${index}.requested_quantity`] || 'Required'}
                        inputProps={{ min: 1 }}

                    />
                    </TableCell>
                    <TableCell>
                    <TextField
                        size="small"
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        error={!!errors[`items.${index}.price`]}
                        helperText={errors[`items.${index}.price`] || 'Required'}
                        inputProps={{ min: 0, step: 0.01 }}
     
                    />
                    </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        <Typography mt={1}>
                        ₱{(item.price * item.requested_quantity).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        <IconButton 
                           size='large'
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
          {/* <Grid item xs={12}>
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Additional Costs            
           <IconButton sx={{marginLeft:"0px !important"}} onClick={() => setOpenCostTypeModal(true)}>
            <PlusOutlined />
            </IconButton>
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cost Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Remarks</TableCell>
                <TableCell width={50} />
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.additional_costs.map((cost, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Autocomplete
                    size='small'
                      value={costTypes?.find(type => type.cost_type_id === cost.cost_type_id) || null}
                      onChange={(e, newValue) => handleCostChange(index, 'cost_type_id', newValue ? newValue.cost_type_id : '')}
                      options={costTypes?.filter(type => 
                        type.is_active && !formData.additional_costs.some(
                          (c, i) => i !== index && c.cost_type_id === type.cost_type_id
                        )
                      ) || []}
                      getOptionLabel={(option) => option.name || ''}
                      isOptionEqualToValue={(option, value) => option.cost_type_id === value}
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
                          error={!!errors[`additional_costs.${index}.cost_type_id`]}
                          helperText={errors[`additional_costs.${index}.cost_type_id`] || 'Required'}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                     size='small'
                      type="number"
                      value={cost.amount}
                      onChange={(e) => handleCostChange(index, 'amount', e.target.value)}
                      error={!!errors[`additional_costs.${index}.amount`]}
                      helperText={errors[`additional_costs.${index}.amount`] || 'Required'}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                     size='small'
                      value={cost.remarks || ''}
                      onChange={(e) => handleCostChange(index, 'remarks', e.target.value)}
                      fullWidth
                      helperText={'Not Required'}
                    />
                  </TableCell>
                  <TableCell sx={{verticalAlign:"top"}} >
                    <IconButton  size='large' onClick={() => removeCost(index)}>
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
            onClick={handleAddCost}
          >
            Add Additional Cost
          </Button>
          <Typography variant="h6">
            Total with Costs: ₱{calculateTotalWithCosts().toFixed(2)}
          </Typography>
        </Box>
      </Grid> */}

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
          <AddCostTypeModal
        open={openCostTypeModal}
        handleClose={() => setOpenCostTypeModal(false)}
      />
    </Container>
  );
};

export default CreatePurchaseOrder;