import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  Skeleton
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Warehouse as WarehouseIcon,
  Home as HomeIcon,
  SwapHoriz as TransferIcon,
  CloseOutlined,
  ShoppingCartOutlined
} from "@mui/icons-material";
import ProductList from "../sales/ProductList";
import { useSales } from "@/hooks/useSales";
import { selectCategories } from "@/store/slices/productsSlice";
import api from "@/lib/axios";



const TransferFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { inventory, getAllInventory, isInventoryLoading } = useSales();

  const categories = useSelector(selectCategories);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [productModalOpen, setProductModalOpen] = useState(false);

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    to_warehouse_id: "",
    delivery_date: "",
    notes: "",
  });

  // Selected products for transfer
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productListMinimized, setProductListMinimized] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});


  // Show notification
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Load initial data
  useEffect(() => {
    loadInitialData();
    if (isEditing) {
      loadTransferForEdit();
    }
  }, [id]);


  useEffect(() => {
  if (inventory && inventory.length > 0) {
    setProducts(inventory);
    
    // Update original_quantity for selected products when inventory changes
    setSelectedProducts(prev => 
      prev.map(selectedProduct => {
        const inventoryProduct = inventory.find(p => p.id === selectedProduct.id);
        if (inventoryProduct) {
          return {
            ...selectedProduct,
            original_quantity: inventoryProduct.quantity
          };
        }
        return selectedProduct;
      })
    );
  }
}, [inventory]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Fetch warehouses
      const warehousesRes = await api.get("/transfers/warehouses/list");
      if (warehousesRes.data.success) {
        setWarehouses(warehousesRes.data.data);
      }

      // Just run getAllInventory (no need to set state here if it already does inside)
      await getAllInventory();
    } catch (error) {
      console.error("Error loading initial data:", error);
      showNotification("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

const loadTransferForEdit = async () => {
  try {
    const response = await api.get(`/transfers/${id}`);
    if (response.data.success) {
      const transfer = response.data.data;

      setTransferForm({
        to_warehouse_id: transfer.warehouse?.id || "",
        delivery_date: transfer.delivery_date 
              ? transfer.delivery_date.split("T")[0] 
              : "",
        notes: transfer.notes || "",
      });

      if (transfer.items) {
        const transferProducts = transfer.items.map((item) => {
          // Find current inventory for this product
          const inventoryProduct = inventory.find(p => p.id === item.product.id);
          const currentInventoryQty = inventoryProduct ? inventoryProduct.quantity : item.product.quantity;
          
          return {
            ...item.product,
            transfer_quantity: parseInt(item.quantity),
            transfer_notes: item.notes || "",
            original_quantity: currentInventoryQty, // Use current inventory, not the product's stored quantity
          };
        });
        setSelectedProducts(transferProducts);
      }
    }
  } catch (error) {
    console.error("Error loading transfer for edit:", error);
    showNotification("Failed to load transfer details", "error");
  }
};

  const handleOpenProductModal = () => {
    setProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setProductModalOpen(false);
  };

  // Handle product addition from ProductList
const handleAddProduct = (product) => {
  const existingProduct = selectedProducts.find((p) => p.id === product.id);

  if (existingProduct) {
    handleUpdateProductQuantity(
      product.id,
      existingProduct.transfer_quantity + 1
    );
    showNotification(`Increased ${product.name} quantity`, "info");
  } else {
    // Get the current inventory quantity from the inventory array
    const inventoryProduct = inventory.find(p => p.id === product.id);
    const currentInventoryQty = inventoryProduct ? inventoryProduct.quantity : product.quantity;
    
    // Update products list to reduce available quantity
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        if (prod.id === product.id) {
          return {
            ...prod,
            quantity: Math.max(0, prod.quantity - 1)
          };
        }
        return prod;
      })
    );

    const newProduct = {
      ...product,
      transfer_quantity: 1,
      transfer_notes: "",
      original_quantity: currentInventoryQty,
    };
    setSelectedProducts((prev) => [...prev, newProduct]);
    showNotification(`Added ${product.name} to transfer`, "success");
  }
};

  // Handle product quantity update
const handleUpdateProductQuantity = (productId, quantity) => {
  const numericQuantity = Math.max(0, parseFloat(quantity) || 0);

  // Update selected products
  setSelectedProducts((prev) =>
    prev.map((product) => {
      if (product.id === productId) {
        // Get the current inventory quantity for this product
        const inventoryProduct = inventory.find(p => p.id === productId);
        const maxQuantity = inventoryProduct ? inventoryProduct.quantity : (product.original_quantity || product.quantity);
        const finalQuantity = Math.min(numericQuantity, maxQuantity);

        // Calculate the difference to update products list
        const previousQuantity = product.transfer_quantity;
        const quantityDifference = finalQuantity - previousQuantity;

        // Update the products list to reflect available quantities
        setProducts((prevProducts) =>
          prevProducts.map((prod) => {
            if (prod.id === productId) {
              return {
                ...prod,
                quantity: Math.max(0, prod.quantity - quantityDifference)
              };
            }
            return prod;
          })
        );

        return {
          ...product,
          transfer_quantity: finalQuantity,
          original_quantity: inventoryProduct ? inventoryProduct.quantity : product.original_quantity,
        };
      }
      return product;
    })
  );
};


  // Handle product removal
 const handleRemoveProduct = (productId) => {
  const product = selectedProducts.find((p) => p.id === productId);
  
  if (product) {
    // Restore the quantity back to products list
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            quantity: prod.quantity + product.transfer_quantity
          };
        }
        return prod;
      })
    );

    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
    showNotification(`Removed ${product.name || product.product_name} from transfer`, "warning");
  }
};

  // Handle product notes update
  const handleUpdateProductNotes = (productId, notes) => {
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, transfer_notes: notes }
          : product
      )
    );
  };

  // Calculate transfer totals
  const transferTotals = useMemo(() => {
    let totalItems = selectedProducts.length;
    let totalQuantity = 0;
    let totalValue = 0;

    selectedProducts.forEach((product) => {
      const quantity = parseFloat(product.transfer_quantity) || 0;
      const unitCost = parseFloat(product.distribution_price) || 0;

      totalQuantity += quantity;
      totalValue += quantity * unitCost;
    });

    return {
      totalItems,
      totalQuantity,
      totalValue,
    };
  }, [selectedProducts]);

  // Validate form
    const validateForm = () => {
    const errors = {};

    if (!transferForm.to_warehouse_id) {
        errors.to_warehouse_id = "Destination warehouse is required";
    }

    if (selectedProducts.length === 0) {
        errors.products = "At least one product is required";
    }

    // Validate product quantities
    const invalidProducts = selectedProducts.filter(
        (product) => !product.transfer_quantity || product.transfer_quantity <= 0
    );

    if (invalidProducts.length > 0) {
        errors.quantities = "All products must have valid quantities";
    }

    // Validate inventory availability using current inventory data
    const overQuantityProducts = selectedProducts.filter((product) => {
        const inventoryProduct = inventory.find(p => p.id === product.id);
        const availableQty = inventoryProduct ? inventoryProduct.quantity : product.original_quantity;
        return product.transfer_quantity > availableQty;
    });

    if (overQuantityProducts.length > 0) {
        errors.inventory = `Insufficient inventory for: ${overQuantityProducts
        .map((p) => p.name || p.product_name)
        .join(", ")}`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
    };

  // Handle form submission
  const handleSubmitTransfer = async () => {
    if (!validateForm()) {
      showNotification("Please fix the form errors", "error");
      return;
    }

    try {
      setSubmitLoading(true);

      // Prepare transfer data
      const transferData = {
        ...transferForm,
        items: selectedProducts.map((product) => ({
          product_id: product.id,
          quantity: product.transfer_quantity,
          notes: product.transfer_notes || "",
        })),
      };

      let response;
      if (isEditing) {
        response = await api.put(`/transfers/${id}`, transferData);
      } else {
        response = await api.post("/transfers", transferData);
      }

      if (response.data.success) {
        showNotification(
          isEditing
            ? "Transfer updated successfully!"
            : "Transfer created successfully! Inventory has been adjusted.",
          "success"
        );

        // Navigate back to transfers list after short delay
        setTimeout(() => {
          navigate("/app/transfers");
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to save transfer";
      showNotification(errorMessage, "error");

      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
    } finally {
      setSubmitLoading(false);
    }
  };


  // Check if form is valid for submission
  const isFormValid = () => {
    return (
      transferForm.to_warehouse_id &&
      selectedProducts.length > 0 &&
      selectedProducts.every((p) => p.transfer_quantity > 0)
    );
  };


const TransferFormSkeleton = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs Skeleton */}
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="text" width="300px" height={24} />
      </Box>

      {/* Header Skeleton */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="rectangular" width={140} height={36} />
          <Skeleton variant="text" width="250px" height={40} />
        </Box>
        <Skeleton variant="rectangular" width={160} height={44} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Transfer Information Card Skeleton */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Skeleton variant="text" width="180px" height={32} sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Skeleton variant="text" width="150px" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={56} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Skeleton variant="text" width="180px" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={56} />
              </Grid>
              <Grid item xs={12}>
                <Skeleton variant="text" width="120px" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={88} />
              </Grid>
            </Grid>
          </Paper>

          {/* Transfer Items Card Skeleton */}
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Skeleton variant="text" width="160px" height={32} />
              <Skeleton variant="rectangular" width={120} height={32} />
            </Box>

            {/* Conditionally show empty state or table skeleton based on editing mode */}
            {!isEditing ? (
              /* Empty State Skeleton for new transfers */
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Skeleton variant="rectangular" width={140} height={40} sx={{ mx: "auto", mb: 2 }} />
                <Skeleton variant="text" width="280px" height={28} sx={{ mx: "auto", mb: 1 }} />
                <Skeleton variant="text" width="320px" height={20} sx={{ mx: "auto" }} />
              </Box>
            ) : (
              /* Table Skeleton for editing transfers */
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><Skeleton variant="text" width="60px" /></TableCell>
                      <TableCell><Skeleton variant="text" width="100px" /></TableCell>
                      <TableCell align="center" sx={{display:'flex', justifyContent:'center'}}><Skeleton variant="text" width="90px" /></TableCell>
                      <TableCell align="center" ><Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}><Skeleton variant="text" width="50px" /> </Box></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[1, 2, 3].map((row) => (
                      <TableRow key={row}>
                        <TableCell><Skeleton variant="text" width="80px" /></TableCell>
                        <TableCell><Skeleton variant="text" width="150px" /></TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="rectangular" width={60} height={32} />
                            <Skeleton variant="circular" width={32} height={32} />
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{display:'flex', justifyContent:'center'}}>
                          <Skeleton variant="circular" width={32} height={32} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};



 if (loading) {
  return <TransferFormSkeleton />;
}

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Loading Backdrop */}
      <Backdrop
        open={submitLoading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/app/product")}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Product
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/app/transfers")}
        >
          <TransferIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Transfers
        </Link>
        <Typography color="text.primary">
          {isEditing ? "Edit Transfer" : "New Transfer"}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/app/transfers")}
          >
            Back to Transfers
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {isEditing ? "Edit Transfer" : "Create New Transfer"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmitTransfer}
          disabled={submitLoading || !isFormValid()}
          size="large"
        >
          {submitLoading ? (
            <CircularProgress size={20} />
          ) : isEditing ? (
            "Update Transfer"
          ) : (
            "Create Transfer"
          )}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Transfer Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Transfer Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!formErrors.to_warehouse_id}>
                  <InputLabel>Destination Warehouse *</InputLabel>
                  <Select
                    value={transferForm.to_warehouse_id}
                    onChange={(e) =>
                      setTransferForm({
                        ...transferForm,
                        to_warehouse_id: e.target.value,
                      })
                    }
                    label="Destination Warehouse *"
                    disabled={submitLoading}
                  >
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <WarehouseIcon fontSize="small" />
                          {warehouse.name} - {warehouse.location}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.to_warehouse_id && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5 }}
                    >
                      {formErrors.to_warehouse_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Expected Delivery Date"
                  value={transferForm.delivery_date}
                  onChange={(e) =>
                    setTransferForm({
                      ...transferForm,
                      delivery_date: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  disabled={submitLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Transfer Notes"
                  value={transferForm.notes}
                  onChange={(e) =>
                    setTransferForm({ ...transferForm, notes: e.target.value })
                  }
                  placeholder="Enter any additional notes for this transfer..."
                  disabled={submitLoading}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Transfer Summary */}
          {/* <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Transfer Summary
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {transferTotals.totalItems}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Items
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {transferTotals.totalQuantity}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Quantity
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {formatCurrency(transferTotals.totalValue)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Estimated Transfer Value
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper> */}

          {/* Selected Products List */}
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Transfer Items ({selectedProducts.length})
              </Typography>
              {selectedProducts.length > 0 && (
                <Chip
                  icon={<CartIcon />}
                  label={`Add Products`}
                  onClick={handleOpenProductModal}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>

            {/* Form Error Messages */}
            {formErrors.products && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formErrors.products}
              </Alert>
            )}
            {formErrors.quantities && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formErrors.quantities}
              </Alert>
            )}
            {formErrors.inventory && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formErrors.inventory}
              </Alert>
            )}

            {selectedProducts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                   <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<ShoppingCartOutlined />}
              onClick={handleOpenProductModal}
              sx={{ ml: 2, mb: 1 }}
            >
              Add Products
            </Button>
                
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No items selected for transfer
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Use the product list on the right to add items to this
                  transfer
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                          <TableCell>Code</TableCell>
                      <TableCell>Item</TableCell>
                      {/* <TableCell align="center">Available</TableCell> */}
                      <TableCell align="center">Transfer Qty</TableCell>
                      {/* <TableCell align="right">Unit Cost</TableCell>
                      <TableCell align="right">Total Cost</TableCell> */}
                      {/* <TableCell>Notes</TableCell> */}
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProducts.map((product) => (
                      <TableRow key={product.id}>
                                                <TableCell>

                            <Typography variant="caption" >
                             {product.product_code || product.code}
                            </Typography>

                        </TableCell>
                        <TableCell>

                            <Typography variant="body2" fontWeight="medium">
                              {product.product_name || product.name}
                            </Typography>


                        </TableCell>
                        {/* <TableCell align="center">
                          <Chip
                            label={
                              product.original_quantity || product.quantity
                            }
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        </TableCell> */}
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              justifyContent: "center",
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUpdateProductQuantity(
                                  product.id,
                                  product.transfer_quantity - 1
                                )
                              }
                              disabled={product.transfer_quantity <= 1}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <TextField
                              type="number"
                              value={product.transfer_quantity}
                              onChange={(e) =>
                                handleUpdateProductQuantity(
                                  product.id,
                                  e.target.value
                                )
                              }

                              inputProps={{
                                 style: { 
                                    textAlign: 'center', 
                                    width: '40px',
                                    
                                },
                                min: 1,
                                max:
                                  product.original_quantity || product.quantity,
                                step: 0.01,
                              }}
                              size="small"
                            />
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUpdateProductQuantity(
                                  product.id,
                                  product.transfer_quantity + 1
                                )
                              }
                              disabled={
                                product.transfer_quantity >=
                                (product.original_quantity || product.quantity)
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                        {/* <TableCell align="right">
                          {formatCurrency(product.distribution_price)}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(
                              product.transfer_quantity *
                                product.distribution_price
                            )}
                          </Typography>
                        </TableCell> */}
                        {/* <TableCell>
                          <TextField
                            placeholder="Item notes..."
                            value={product.transfer_notes}
                            onChange={(e) =>
                              handleUpdateProductNotes(
                                product.id,
                                e.target.value
                              )
                            }
                            size="small"
                            sx={{ width: 150 }}
                          />
                        </TableCell> */}
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={productModalOpen}
        onClose={handleCloseProductModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
            onMinimize={() => setProductListMinimized(true)}
            isMinimized={false}
            isInModal={false}
            showPrice={false}
          />
        </DialogContent>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TransferFormPage;
