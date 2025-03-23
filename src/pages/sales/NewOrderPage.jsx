import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid, Paper, Backdrop, CircularProgress, Snackbar, Alert, Typography, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { selectCustomers } from '@/store/slices/customerSlice';
import { selectCategories } from '@/store/slices/productsSlice';
import { useSales } from '@/hooks/useSales';
import ProductList from './ProductList';
import DeliveryReport from './DeliveryReport';


const NewOrderPage = () => {
  const customers = useSelector(selectCustomers); 
  const categories = useSelector(selectCategories);
  const { 
    inventory, 
    getAllInventory, 
    isInventoryLoading,
    createSale,
    isSalesLoading
  } = useSales();

  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductListMinimized, setIsProductListMinimized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, message: '', type: 'info' });
  
  const deliveryReportRef = useRef();
  const navigate = useNavigate();

  // Load inventory data on component mount
  useEffect(() => {
    getAllInventory();
  }, []);

  // Update products when inventory changes
  useEffect(() => {
    if (inventory && inventory.length > 0) {
      setProducts(inventory);
    }
  }, [inventory]);

  // Calculate total price whenever orderItems changes
  useEffect(() => {
    const newTotal = orderItems.reduce((sum, item) => {
      // Get price based on the item's price_type
      let price;
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
      
      const subtotal = Number(price) * item.quantity;
      const discountPercentage = parseFloat(item.discount) || 0;
      const discountAmount = subtotal * (discountPercentage / 100);
      return sum + (subtotal - discountAmount);
    }, 0);
    setTotalPrice(newTotal);
  }, [orderItems]);

  const handleToggleMinimize = () => {
    setIsProductListMinimized(!isProductListMinimized);
  };



  const handleAddProduct = (product) => {
    if (product.quantity > 0) {
      const existingItem = orderItems.find(item => item.id === product.id);
      if (existingItem) {
        setOrderItems(orderItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setOrderItems([...orderItems, { 
          ...product, 
          quantity: 1, 
          discount: 0,
          distribution_price: product.distribution_price || product.cost_price || 0,
          price_type: 'regular' // Default price type for each item
        }]);
      }
      // Update the product quantity in the product list
      setProducts(products.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
      ));
    } else {
      setSelectedProduct(product);
      setDialogOpen(true);
    }
  };

  const handleRemoveProduct = (productId) => {
    const removedItem = orderItems.find(item => item.id === productId);
    if (removedItem) {
      setOrderItems(orderItems.filter(item => item.id !== productId));
      // Update the product quantity in the product list
      setProducts(products.map(p =>
        p.id === productId ? { ...p, quantity: p.quantity + removedItem.quantity } : p
      ));
    }
  };

  const handleQuantityChange = (productId, change, newQuantity = null) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === productId) {
        const oldQuantity = item.quantity;
        const updatedQuantity = newQuantity !== null ? newQuantity : Math.max(0, item.quantity + change);
        // Update the product quantity in the product list
        setProducts(products.map(p =>
          p.id === productId ? { ...p, quantity: p.quantity + (oldQuantity - updatedQuantity) } : p
        ));
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleDiscountChange = (productId, discountValue) => {
    // Handle empty string or null by setting discount to 0
    const discount = discountValue === '' ? 0 : Math.min(Math.max(0, parseFloat(discountValue) || 0), 100);
    setOrderItems(orderItems.map(item =>
      item.id === productId ? { ...item, discount } : item
    ));
  };

  // New handler for price type change
  const handlePriceTypeChange = (productId, priceType) => {
    setOrderItems(orderItems.map(item =>
      item.id === productId ? { ...item, price_type: priceType } : item
    ));
  };

  // Get price based on item's price type
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

  const handleSubmitOrder = async (formData) => {
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
      // Prepare sale data for API
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
        term_days : formData.term_days,
        items: orderItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          distribution_price: item.distribution_price || item.cost_price || 0,
          sold_price: getPriceByPriceType(item),
          discount: item.discount || 0,
          price_type: item.price_type || 'regular' // Include price type for each item
        }))
      };

      // Create the sale
      const result = await createSale(saleData);
      
      if (result) {
   
  
        setAlertInfo({
          open: true,
          message: 'Sale created successfully!',
          type: 'success'
        });
        
        // Clear order items
        setOrderItems([]);
        
        // Reset products to reflect updated inventory
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
  };


  const handleCloseAlert = () => {
    setAlertInfo(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Grid container spacing={2} sx={{ position: 'relative' }}>
        {!isProductListMinimized && (
          <Grid item xs={12} md={7} sx={{ transition: 'all 0.3s ease' }}>
            <ProductList 
              products={products} 
              categories={categories}
              onAddProduct={handleAddProduct} 
              dialogOpen={dialogOpen}
              selectedProduct={selectedProduct}
              onCloseDialog={() => setDialogOpen(false)}
              onMinimize={handleToggleMinimize}
              isMinimized={isProductListMinimized}
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
              isSubmitting={isSubmitting}
            />
          </Paper>
        </Grid>
        
        {/* Only render the minimized ProductList component when minimized */}
        {isProductListMinimized && (
          <ProductList 
            products={products} 
            categories={categories}
            onAddProduct={handleAddProduct} 
            dialogOpen={dialogOpen}
            selectedProduct={selectedProduct}
            onCloseDialog={() => setDialogOpen(false)}
            onMinimize={handleToggleMinimize}
            isMinimized={isProductListMinimized}
          />
        )}
      </Grid>



      {/* Loading indicator */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isInventoryLoading || isSalesLoading || isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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