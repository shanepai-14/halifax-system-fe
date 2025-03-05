import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Autocomplete,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import {
  ArrowLeftOutlined,
  SearchOutlined,
  SaveOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  ReloadOutlined,
  WarningOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { selectProducts, selectCategories } from '@/store/slices/productsSlice';
import { 
  useGetInventory, 
  useCreateInventoryCount, 
  useGetInventoryCounts,
  useGetInventoryCount,
  useUpdateInventoryCount,
  useFinalizeInventoryCount
} from '@/hooks/useInventory';

const InventoryCountPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [countItems, setCountItems] = useState([]);
  const [countName, setCountName] = useState(`Count - ${new Date().toLocaleDateString()}`);
  const [countDescription, setCountDescription] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [countedQuantity, setCountedQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [activeCountId, setActiveCountId] = useState(null);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch data using custom hooks
  const { data: inventoryData = [], isLoading: isLoadingInventory, refetch: refetchInventory } = useGetInventory();
  const { data: inventoryCounts = [], isLoading: isLoadingCounts } = useGetInventoryCounts();
  const { data: activeCount, isLoading: isLoadingActiveCount } = useGetInventoryCount(activeCountId);
  const { mutateAsync: createCount } = useCreateInventoryCount();
  const { mutateAsync: updateCount } = useUpdateInventoryCount();
  const { mutateAsync: finalizeCount } = useFinalizeInventoryCount();

  // Get data from Redux
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);

  // Initialize with current inventory if we have a new count session
  useEffect(() => {
    if (inventoryData.length > 0 && countItems.length === 0 && !activeCountId) {
      const initialItems = inventoryData.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
          product_id: item.product_id,
          product_name: product?.product_name || 'Unknown Product',
          product_code: product?.product_code || '',
          system_quantity: item.quantity,
          counted_quantity: '',
          category_id: product?.product_category_id,
          has_discrepancy: false,
          notes: ''
        };
      });
      setCountItems(initialItems);
    }
  }, [inventoryData, products, countItems, activeCountId]);

  // Load active count data when it's selected
  useEffect(() => {
    if (activeCount && activeCount.items) {
      const mappedItems = activeCount.items.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
          ...item,
          product_name: product?.product_name || 'Unknown Product',
          product_code: product?.product_code || '',
          category_id: product?.product_category_id,
          has_discrepancy: item.counted_quantity !== null && 
                          item.counted_quantity !== undefined && 
                          item.system_quantity !== item.counted_quantity
        };
      });
      setCountItems(mappedItems);
      setCountName(activeCount.name);
      setCountDescription(activeCount.description || '');
    }
  }, [activeCount, products]);

  // Filtered items based on search and category
  const filteredItems = countItems.filter(item => {
    const matchesSearch = (
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesCategory = categoryFilter === 'All Categories' || 
      item.category_id?.toString() === categoryFilter;
  
    return matchesSearch && matchesCategory;
  });

  // Count items with discrepancies
  const discrepancyCount = countItems.filter(item => 
    item.counted_quantity !== null && 
    item.counted_quantity !== undefined && 
    item.counted_quantity !== '' && 
    Number(item.counted_quantity) !== Number(item.system_quantity)
  ).length;

  // Handle updating count item
  const handleUpdateItem = (productId, countedQty) => {
    const updatedItems = countItems.map(item => {
      if (item.product_id === productId) {
        const parsedQty = countedQty === '' ? '' : Number(countedQty);
        return {
          ...item,
          counted_quantity: parsedQty,
          has_discrepancy: parsedQty !== '' && Number(parsedQty) !== Number(item.system_quantity)
        };
      }
      return item;
    });
    setCountItems(updatedItems);
  };

  // Handle adding count entry
  const handleAddCountEntry = () => {
    if (!selectedProductId || countedQuantity === '') {
      setErrors({
        ...errors,
        selectedProductId: !selectedProductId ? 'Please select a product' : '',
        countedQuantity: countedQuantity === '' ? 'Please enter a quantity' : ''
      });
      return;
    }

    // Check if product already exists in count items
    const existingItem = countItems.find(item => item.product_id === selectedProductId);
    if (existingItem) {
      handleUpdateItem(selectedProductId, countedQuantity);
    } else {
      const product = products.find(p => p.id === selectedProductId);
      if (product) {
        const inventoryItem = inventoryData.find(item => item.product_id === selectedProductId);
        const newItem = {
          product_id: selectedProductId,
          product_name: product.product_name,
          product_code: product.product_code,
          system_quantity: inventoryItem?.quantity || 0,
          counted_quantity: Number(countedQuantity),
          category_id: product.product_category_id,
          has_discrepancy: Number(countedQuantity) !== (inventoryItem?.quantity || 0),
          notes: notes
        };
        setCountItems([...countItems, newItem]);
      }
    }

    // Reset form
    setSelectedProductId(null);
    setCountedQuantity('');
    setNotes('');
    setErrors({});
  };

  // Handle removing count entry
  const handleRemoveItem = (productId) => {
    setCountItems(countItems.filter(item => item.product_id !== productId));
  };

  // Handle saving the inventory count
  const handleSaveCount = async () => {
    try {
      setIsSubmitting(true);

      // Remove incomplete entries (no counted quantity)
      const validItems = countItems.filter(item => 
        item.counted_quantity !== null && 
        item.counted_quantity !== undefined && 
        item.counted_quantity !== ''
      );

      if (validItems.length === 0) {
        toast.error('Please add at least one counted item');
        setIsSubmitting(false);
        return;
      }

      const countData = {
        name: countName,
        description: countDescription,
        items: validItems.map(item => ({
          product_id: item.product_id,
          system_quantity: item.system_quantity,
          counted_quantity: item.counted_quantity,
          notes: item.notes
        }))
      };

      if (activeCountId) {
        // Update existing count
        await updateCount({
          countId: activeCountId,
          data: countData
        });
        toast.success('Inventory count updated successfully');
      } else {
        // Create new count
        const result = await createCount(countData);
        setActiveCountId(result.data.id);
        toast.success('Inventory count saved successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save inventory count');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle finalizing the inventory count
  const handleFinalizeCount = async () => {
    try {
      setIsSubmitting(true);
      await finalizeCount(activeCountId);
      refetchInventory();
      setConfirmDialogOpen(false);
      navigate('/app/inventory');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to finalize inventory count');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle selecting a previous count
  const handleSelectCount = (countId) => {
    setActiveCountId(countId);
  };

  // Reset to start a new count
  const handleStartNewCount = () => {
    setActiveCountId(null);
    setCountName(`Count - ${new Date().toLocaleDateString()}`);
    setCountDescription('');
    setCountItems([]);
    refetchInventory();
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, px: '0!important' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<ArrowLeftOutlined />}
            onClick={() => navigate('/app/inventory')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h5">
            {activeCountId ? `Inventory Count: ${countName}` : 'New Inventory Count'}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left column - Count form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Count Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Count Name"
                      value={countName}
                      onChange={(e) => setCountName(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Description (Optional)"
                      value={countDescription}
                      onChange={(e) => setCountDescription(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Add Item to Count
                </Typography>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      value={selectedProductId ? products.find(p => p.id === selectedProductId) : null}
                      onChange={(e, value) => {
                        setSelectedProductId(value ? value.id : null);
                        if (errors.selectedProductId) {
                          setErrors({ ...errors, selectedProductId: '' });
                        }
                      }}
                      options={products || []}
                      getOptionLabel={(option) => `${option.product_code} - ${option.product_name}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Product"
                          fullWidth
                          error={!!errors.selectedProductId}
                          helperText={errors.selectedProductId}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Counted Quantity"
                      type="number"
                      value={countedQuantity}
                      onChange={(e) => {
                        setCountedQuantity(e.target.value);
                        if (errors.countedQuantity) {
                          setErrors({ ...errors, countedQuantity: '' });
                        }
                      }}
                      InputProps={{
                        inputProps: { min: 0, step: 1 }
                      }}
                      error={!!errors.countedQuantity}
                      helperText={errors.countedQuantity}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Notes (Optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PlusOutlined />}
                      onClick={handleAddCountEntry}
                      disabled={isSubmitting}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Count Items
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      placeholder="Search products"
                      size="small"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchOutlined />
                          </InputAdornment>
                        ),
                      }}
                      disabled={isSubmitting}
                      sx={{ width: 250 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        label="Category"
                        disabled={isSubmitting}
                      >
                        <MenuItem value="All Categories">All Categories</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {discrepancyCount > 0 && (
                  <Alert 
                    severity="warning" 
                    icon={<WarningOutlined />}
                    sx={{ mb: 2 }}
                  >
                    {discrepancyCount} {discrepancyCount === 1 ? 'item has' : 'items have'} discrepancies between system and counted quantities.
                  </Alert>
                )}

                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Code</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell align="right">System Qty</TableCell>
                        <TableCell align="right">Counted Qty</TableCell>
                        <TableCell align="right">Variance</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            {isLoadingInventory ? (
                              <CircularProgress size={20} />
                            ) : (
                              "No items to display. Add items to your count."
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => {
                          const variance = item.counted_quantity !== '' && item.counted_quantity !== null
                            ? Number(item.counted_quantity) - Number(item.system_quantity)
                            : null;
                          
                          return (
                            <TableRow key={item.product_id} hover>
                              <TableCell>{item.product_code}</TableCell>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell align="right">{item.system_quantity}</TableCell>
                              <TableCell align="right">
                                <TextField
                                  type="number"
                                  value={item.counted_quantity}
                                  onChange={(e) => handleUpdateItem(item.product_id, e.target.value)}
                                  InputProps={{
                                    inputProps: { min: 0, step: 1 }
                                  }}
                                  disabled={isSubmitting}
                                  size="small"
                                  sx={{ width: 100 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                {variance !== null ? (
                                  <Chip 
                                    label={variance === 0 ? "Match" : variance > 0 ? `+${variance}` : variance}
                                    color={variance === 0 ? "success" : "error"}
                                    size="small"
                                  />
                                ) : "-"}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={item.notes || ''}
                                  onChange={(e) => {
                                    const updatedItems = countItems.map(i => 
                                      i.product_id === item.product_id 
                                        ? { ...i, notes: e.target.value } 
                                        : i
                                    );
                                    setCountItems(updatedItems);
                                  }}
                                  disabled={isSubmitting}
                                  size="small"
                                  fullWidth
                                  placeholder="Add notes..."
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="Remove from count">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleRemoveItem(item.product_id)}
                                    disabled={isSubmitting}
                                  >
                                    <DeleteOutlined />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ReloadOutlined />}
                  onClick={refetchInventory}
                  disabled={isSubmitting}
                >
                  Refresh Data
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveOutlined />}
                  onClick={handleSaveCount}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : activeCountId ? 'Update Count' : 'Save Count'}
                </Button>
                {activeCountId && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckOutlined />}
                    onClick={() => setConfirmDialogOpen(true)}
                    disabled={isSubmitting}
                  >
                    Finalize & Apply Changes
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right column - Previous counts */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Inventory Counts
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<PlusOutlined />}
                  onClick={handleStartNewCount}
                  disabled={isSubmitting}
                >
                  New Count
                </Button>
              </Box>

              {isLoadingCounts ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : inventoryCounts.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography color="text.secondary">
                    No previous inventory counts found.
                  </Typography>
                </Box>
              ) : (
                inventoryCounts.map((count) => (
                  <Box
                    key={count.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: '1px solid',
                      borderColor: activeCountId === count.id ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => handleSelectCount(count.id)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">
                        {count.name}
                      </Typography>
                      <Chip 
                        label={count.status} 
                        color={count.status === 'finalized' ? 'success' : 'primary'} 
                        size="small" 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(count.created_at).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      {count.item_count} items | {count.discrepancy_count} discrepancies
                    </Typography>
                  </Box>
                ))
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Confirm Finalize Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Finalize Inventory Count
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action will update your inventory based on the counted quantities and cannot be undone.
          </Alert>
          <Typography variant="body1" paragraph>
            You are about to finalize this inventory count and apply all discrepancies to the system. This will:
          </Typography>
          <ul>
            <li>Update inventory quantities to match counted quantities</li>
            <li>Create adjustment records for each discrepancy</li>
            <li>Mark this count as finalized</li>
          </ul>
          <Typography variant="body1">
            Are you sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialogOpen(false)} 
            color="inherit"
            startIcon={<CloseOutlined />}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFinalizeCount} 
            color="success"
            variant="contained"
            startIcon={<CheckOutlined />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Confirm & Apply Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InventoryCountPage;