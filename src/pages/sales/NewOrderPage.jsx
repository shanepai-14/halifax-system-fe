import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid, Paper, Backdrop, CircularProgress, Snackbar, Alert, Typography, Box,
  Dialog, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { selectCustomers } from '@/store/slices/customerSlice';
import { selectCategories } from '@/store/slices/productsSlice';
import { useSales } from '@/hooks/useSales';
import ProductList from './ProductList';
import DeliveryReport from './DeliveryReport';
import { CloseOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const NewOrderPage = () => {
  // Redux selectors
  const customers = useSelector(selectCustomers); 
  const categories = useSelector(selectCategories);
  
  // Custom hooks
  const { 
    inventory, 
    getAllInventory, 
    isInventoryLoading,
    createSale,
    isSalesLoading
  } = useSales();

  // Core state
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  
  // UI state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductListMinimized, setIsProductListMinimized] = useState(true);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', type: 'info' });
  
  const deliveryReportRef = useRef();
  const navigate = useNavigate();

  // Memoized utility functions (moved before usage)
  const calculateBracketPrice = useCallback((item, quantity) => {
    if (!item.price_bracket || !item.use_bracket_pricing) return null;
    
    const priceType = item.price_type || 'regular';
    const bracketItem = item.price_bracket.items.find(bracket => 
      bracket.price_type === priceType &&
      bracket.is_active &&
      bracket.min_quantity <= quantity &&
      (bracket.max_quantity === null || bracket.max_quantity >= quantity)
    );
    
    return bracketItem ? bracketItem.price : null;
  }, []);

  const getPriceByPriceType = useCallback((item) => {
    // Check for bracket pricing first if enabled for this specific item
    if (item.use_bracket_pricing && item.price_bracket) {
      const bracketPrice = calculateBracketPrice(item, item.quantity);
      if (bracketPrice !== null) {
        return bracketPrice;
      }
    }
    
    // Fall back to regular pricing
    switch(item.price_type || 'regular') {
      case 'walkin':
        return item.walk_in_price || item.regular_price;
      case 'wholesale':
        return item.wholesale_price || item.regular_price;
      case 'regular':
      default:
        return item.regular_price;
    }
  }, [calculateBracketPrice]);

  // Memoized total price calculation
  const totalPrice = useMemo(() => {
    return orderItems.reduce((sum, item) => {
      let price;
      
      // Check for bracket pricing first if enabled for this specific item
      if (item.use_bracket_pricing && item.price_bracket) {
        const bracketPrice = calculateBracketPrice(item, item.quantity);
        if (bracketPrice !== null) {
          price = bracketPrice;
        }
      }
      
      // Fall back to regular pricing if no bracket price found
      if (!price) {
        switch(item.price_type || 'regular') {
          case 'walkin':
            price = item.walk_in_price || item.regular_price;
            break;
          case 'wholesale':
            price = item.wholesale_price || item.regular_price;
            break;
          case 'regular':
          default:
            price = item.regular_price;
        }
      }
      
      const subtotal = Number(price) * item.quantity;
      const discountPercentage = parseFloat(item.discount) || 0;
      const discountAmount = subtotal * (discountPercentage / 100);
      return sum + (subtotal - discountAmount);
    }, 0);
  }, [orderItems, calculateBracketPrice]);

  // Memoized event handlers
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
            use_bracket_pricing: false
          }];
        }
      });
      
      setProducts(prev => prev.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
      ));
    } else {
      setSelectedProduct(product);
      setDialogOpen(true);
    }
  }, []);

  const handleRemoveProduct = useCallback((productId) => {
    const removedItem = orderItems.find(item => item.id === productId);
    if (removedItem) {
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
      const updatedQuantity = newQuantity !== null ? newQuantity : Math.max(0, item.quantity + change);
      
      // Update the product quantity in the product list
      setProducts(prevProducts => prevProducts.map(p =>
        p.id === productId ? { ...p, quantity: p.quantity + (oldQuantity - updatedQuantity) } : p
      ));
      
      return { ...item, quantity: updatedQuantity };
    }
    return item;
  })); // Removed .filter(item => item.quantity > 0) to keep zero-quantity items
}, []);



  const handleDiscountChange = useCallback((productId, discountValue) => {
    const discount = discountValue === '' ? 0 : Math.min(Math.max(0, parseFloat(discountValue) || 0), 100);
    setOrderItems(prev => prev.map(item =>
      item.id === productId ? { ...item, discount } : item
    ));
  }, []);

  const handlePriceTypeChange = useCallback((productId, priceType) => {
    setOrderItems(prev => prev.map(item =>
      item.id === productId ? { ...item, price_type: priceType } : item
    ));
  }, []);

  const handleBracketPricingChange = useCallback((productId, useBracket) => {
    setOrderItems(prev => prev.map(item =>
      item.id === productId ? { ...item, use_bracket_pricing: useBracket } : item
    ));
  }, []);

  const handleUpdateItemComposition = useCallback((productId, compositionText) => {
    setOrderItems(prev => prev.map(item =>
      item.id === productId ? { ...item, composition: compositionText } : item
    ));
  }, []);

  // UI handlers
  const handleToggleMinimize = useCallback(() => {
    setIsProductListMinimized(prev => !prev);
  }, []);

  const handleOpenProductModal = useCallback(() => {
    setProductModalOpen(true);
  }, []);

  const handleCloseProductModal = useCallback(() => {
    setProductModalOpen(false);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertInfo(prev => ({ ...prev, open: false }));
  }, []);

  // Submit order handler
  const handleSubmitOrder = useCallback(async (formData) => {
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
      const saleData = {
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
        order_date: formData.orderDate,
        delivery_date: formData.deliveryDate,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        amount_received: 0, 
        term_days: formData.term_days,
        items: orderItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          distribution_price: item.distribution_price || item.cost_price || 0,
          sold_price: getPriceByPriceType(item),
          discount: item.discount || 0,
          price_type: item.price_type || 'regular',
          composition: item.composition
        }))
      };

      const result = await createSale(saleData);
      
      if (result) {
        setAlertInfo({
          open: true,
          message: 'Sale created successfully!',
          type: 'success'
        });
        
        setOrderItems([]);
        getAllInventory();

        navigate(`/app/delivery-report/${result.id}`, { 
          state: { reportData: result }
        });
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      setAlertInfo({
        open: true,
        message: error.message || 'Failed to create sale',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [orderItems, getPriceByPriceType, createSale, getAllInventory, navigate]);

  // Effects
  useEffect(() => {
    getAllInventory();
  }, []);

  useEffect(() => {
    if (inventory && inventory.length > 0) {
      setProducts(inventory);
    }
  }, [inventory]);

  // Memoized ProductList props to prevent unnecessary re-renders
  const productListProps = useMemo(() => ({
    products,
    categories,
    onAddProduct: handleAddProduct,
    dialogOpen,
    selectedProduct,
    onCloseDialog: handleCloseDialog,
    onMinimize: handleToggleMinimize,
  }), [products, categories, handleAddProduct, dialogOpen, selectedProduct, handleCloseDialog, handleToggleMinimize]);

  return (
    <>
      <Grid container spacing={2} sx={{ position: 'relative' }}>
        {!isProductListMinimized && (
          <Grid item xs={12} md={7} sx={{ transition: 'all 0.3s ease' }}>
            <ProductList 
              {...productListProps}
              isMinimized={false}
            />
          </Grid>
        )}
        
        <Grid 
          item 
          xs={12} 
          md={isProductListMinimized ? 12 : 5}
          sx={{ 
            transition: 'all 0.3s ease',
            zIndex: 1
          }}
        >
          <Paper sx={{ p: 2 }}>
            <DeliveryReport 
              ref={deliveryReportRef}
              orderItems={orderItems} 
              totalPrice={totalPrice} 
              customers={customers}
              onSubmit={handleSubmitOrder}
              onRemoveProduct={handleRemoveProduct}
              onQuantityChange={handleQuantityChange}
              onDiscountChange={handleDiscountChange}
              onPriceTypeChange={handlePriceTypeChange}
              onBracketPricingChange={handleBracketPricingChange}
              onUpdateItemComposition={handleUpdateItemComposition} 
              isSubmitting={isSubmitting}
              onOpenProductModal={handleOpenProductModal}
            />
          </Paper>
        </Grid>
        
        {/* Minimized ProductList */}
        {isProductListMinimized && (
          <ProductList 
            {...productListProps}
            isMinimized={true}
          />
        )}
      </Grid>

      {/* Product List Modal */}
      <Dialog
        open={productModalOpen}
        onClose={handleCloseProductModal}
        maxWidth="md"
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
            {...productListProps}
            isMinimized={false}
            isInModal={true}
            onMinimize={null}
          />
        </DialogContent>
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

export default NewOrderPage;