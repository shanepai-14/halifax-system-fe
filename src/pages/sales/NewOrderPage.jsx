import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid, Paper, 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { selectCustomers } from '@/store/slices/customerSlice';
import { selectCategories } from '@/store/slices/productsSlice';
import { selectInventory } from '@/store/slices/inventorySlice';
import ProductList from './ProductList';
import DeliveryReport from './DeliveryReport';
import PrintableDR from './PrintableDR';





const NewOrderPage = () => {
  const customers = useSelector(selectCustomers); 
  const categories = useSelector(selectCategories);
  const inventory = useSelector(selectInventory);

  const [products, setProducts] = useState(inventory);
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentDR, setCurrentDR] = useState(null);
  const [isProductListMinimized, setIsProductListMinimized] = useState(false);
  const deliveryReportRef = useRef();
  const printContentRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate total price whenever orderItems changes
    const newTotal = orderItems.reduce((sum, item) => {
      const subtotal = Number(item.regular_price) * item.quantity;
      const discountPercentage = parseFloat(item.discount) || 0;
      const discountAmount = subtotal * (discountPercentage / 100);
      return sum + (subtotal - discountAmount);
    }, 0);
    setTotalPrice(newTotal);
  }, [orderItems]);

  useEffect(() => {
    if (inventory && inventory.length > 0) {
      setProducts(inventory);
    }
  }, [inventory]);

  const handleToggleMinimize = () => {
    setIsProductListMinimized(!isProductListMinimized);
  };

  const handlePrint = useReactToPrint({
    content: () => printContentRef.current,
    documentTitle: "Delivery-Report",
    removeAfterPrint: true,
    onAfterPrint: () => console.log('Print completed')
  });

  const handleAddProduct = (product) => {
    if (product.quantity > 0) {
      const existingItem = orderItems.find(item => item.id === product.id);
      if (existingItem) {
        setOrderItems(orderItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setOrderItems([...orderItems, { ...product, quantity: 1, discount: 0 }]);
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

  const handleSubmitOrder = (formData) => {
    if (orderItems.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }

    const drData = {
      customer: formData.customer,
      orderDate: formData.orderDate,
      deliveryDate: formData.deliveryDate,
      paymentMethod: formData.paymentMethod,
      orderItems,
      totalPrice,
      invoiceNumber: "DR-" + Math.floor(100000 + Math.random() * 900000), // Generate a random DR number
    };

    setCurrentDR(drData);

    console.log(drData);
    // navigate('/app/sales/invoice-preview', { state: { invoiceData: drData } });
  };

  // Function to prepare and trigger printing
  const handlePrintDR = (formData) => {
    // Create temporary DR data for printing
    const drData = {
      customer: formData.customer,
      orderDate: formData.orderDate,
      deliveryDate: formData.deliveryDate,
      paymentMethod: formData.paymentMethod,
      orderItems,
      totalPrice,
      invoiceNumber: "DR-" + Math.floor(100000 + Math.random() * 900000),
    };
    
    setCurrentDR(drData);
    // Delay slightly to ensure the state is updated
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  return (
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
          onPrint={handlePrintDR}
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
  );
};

export default NewOrderPage;