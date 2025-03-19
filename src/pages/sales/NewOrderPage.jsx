import React, { useState, useEffect, useRef } from 'react';
import {
  Grid, Paper, Button, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import ProductList from './ProductList';
import DeliveryReport from './DeliveryReport';
import PrintableDR from './PrintableDR';

// Mock data for products and customers
const allProducts = [
  { id: 1, code: 'P001', name: 'Tempered Glass', price: 100, quantity: 30, category: 'Glass' },
  { id: 2, code: 'P002', name: 'Aluminum Frame', price: 50, quantity: 100, category: 'Aluminum' },
  { id: 3, code: 'P003', name: 'Wooden Door', price: 200, quantity: 25, category: 'Accessories' },
  { id: 4, code: 'P004', name: 'Steel Reinforcement', price: 150, quantity: 40, category: 'Accessories' },
  { id: 5, code: 'P005', name: 'Plastic Moldings', price: 20, quantity: 150, category: 'Accessories' },
  { id: 6, code: 'P006', name: 'Glass Fiber', price: 80, quantity: 75, category: 'Glass' },
  { id: 7, code: 'P007', name: 'Cement', price: 120, quantity: 200, category: 'Accessories' },
  { id: 8, code: 'P008', name: 'Iron Rods', price: 300, quantity: 35, category: 'Accessories' },
  { id: 9, code: 'P009', name: 'PVC Pipes', price: 15, quantity: 250, category: 'Accessories' },
  { id: 10, code: 'P010', name: 'Roofing Sheets', price: 500, quantity: 60, category: 'Accessories' },
  { id: 11, code: 'P011', name: 'Glass Panels', price: 180, quantity: 45, category: 'Glass' },
  { id: 12, code: 'P012', name: 'Sliding Windows', price: 220, quantity: 30, category: 'Aluminum' },
  { id: 13, code: 'P013', name: 'Acrylic Sheets', price: 90, quantity: 120, category: 'Accessories' },
  { id: 14, code: 'P014', name: 'Glass Adhesive', price: 12, quantity: 500, category: 'Accessories' },
  { id: 15, code: 'P015', name: 'Aluminum Cladding', price: 250, quantity: 40, category: 'Aluminum' },
  { id: 16, code: 'P016', name: 'Glass Reinforced Plastic (GRP)', price: 60, quantity: 80, category: 'Glass' },
  { id: 17, code: 'P017', name: 'Aluminum Bars', price: 45, quantity: 150, category: 'Aluminum' },
  { id: 18, code: 'P018', name: 'Silicone Sealant', price: 10, quantity: 500, category: 'Accessories' },
  { id: 19, code: 'P019', name: 'Mirror Glass', price: 200, quantity: 55, category: 'Glass' },
  { id: 20, code: 'P020', name: 'Partition Glass', price: 160, quantity: 70, category: 'Glass' },
  { id: 21, code: 'P021', name: 'Skylight Glass', price: 320, quantity: 20, category: 'Glass' },
  { id: 22, code: 'P022', name: 'Door Handles', price: 30, quantity: 500, category: 'Accessories' },
  { id: 23, code: 'P023', name: 'Glass Hinges', price: 25, quantity: 300, category: 'Accessories' },
  { id: 24, code: 'P024', name: 'Aluminum Sheets', price: 120, quantity: 90, category: 'Aluminum' },
  { id: 25, code: 'P025', name: 'Aluminum Windows', price: 400, quantity: 25, category: 'Aluminum' },
  { id: 26, code: 'P026', name: 'Tempered Laminated Glass', price: 350, quantity: 40, category: 'Glass' },
  { id: 27, code: 'P027', name: 'Glass Shelves', price: 70, quantity: 200, category: 'Glass' },
  { id: 28, code: 'P028', name: 'Aluminum Shutters', price: 300, quantity: 60, category: 'Aluminum' },
  { id: 29, code: 'P029', name: 'Polycarbonate Sheets', price: 150, quantity: 85, category: 'Accessories' },
  { id: 30, code: 'P030', name: 'Glass Cleaner', price: 8, quantity: 600, category: 'Accessories' },
  { id: 31, code: 'P031', name: 'Soundproof Glass', price: 420, quantity: 15, category: 'Glass' },
  { id: 32, code: 'P032', name: 'Double Glazing Units', price: 500, quantity: 50, category: 'Glass' },
  { id: 33, code: 'P033', name: 'Window Seals', price: 5, quantity: 800, category: 'Accessories' },
  { id: 34, code: 'P034', name: 'Curtain Walling Systems', price: 600, quantity: 10, category: 'Aluminum' },
  { id: 35, code: 'P035', name: 'Frameless Glass', price: 350, quantity: 35, category: 'Glass' },
  { id: 36, code: 'P036', name: 'Bulletproof Glass', price: 1000, quantity: 5, category: 'Glass' },
  { id: 37, code: 'P037', name: 'Decorative Glass Film', price: 50, quantity: 120, category: 'Glass' },
  { id: 38, code: 'P038', name: 'Sandblasted Glass', price: 180, quantity: 40, category: 'Glass' },
  { id: 39, code: 'P039', name: 'Tempered Insulating Glass', price: 280, quantity: 30, category: 'Glass' },
  { id: 40, code: 'P040', name: 'Fire-Resistant Glass', price: 450, quantity: 25, category: 'Glass' }
];

const customers = [
  { id: 1, name: 'John Doe', phone: '1234567890', address: '123 Main St, Anytown', city: 'Anytown' },
  { id: 2, name: 'Jane Smith', phone: '9876543210', address: '456 Elm St, Othertown', city: 'Othertown' },
  { id: 3, name: 'Alice Johnson', phone: '1122334455', address: '789 Oak St, Sometown', city: 'Sometown' },
  { id: 4, name: 'Bob Williams', phone: '2233445566', address: '321 Pine St, Newtown', city: 'Newtown' },
  { id: 5, name: 'Charlie Brown', phone: '3344556677', address: '654 Cedar St, Oldtown', city: 'Oldtown' },
  { id: 6, name: 'Eve Davis', phone: '4455667788', address: '987 Birch St, Hilltown', city: 'Hilltown' },
  { id: 7, name: 'Frank Miller', phone: '5566778899', address: '159 Maple St, Rivertown', city: 'Rivertown' },
  { id: 8, name: 'Grace Lee', phone: '6677889900', address: '753 Walnut St, Villagetown', city: 'Villagetown' },
  { id: 9, name: 'Hank Green', phone: '7788990011', address: '951 Spruce St, Foresttown', city: 'Foresttown' },
  { id: 10, name: 'Ivy White', phone: '8899001122', address: '357 Redwood St, Seaview', city: 'Seaview' },
];

const NewOrderPage = () => {
  const [products, setProducts] = useState(allProducts);
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentDR, setCurrentDR] = useState(null);
  const deliveryReportRef = useRef();
  const printContentRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    // Calculate total price whenever orderItems changes
    const newTotal = orderItems.reduce((sum, item) => {
      const subtotal = item.price * item.quantity;
      const discountPercentage = parseFloat(item.discount) || 0;
      const discountAmount = subtotal * (discountPercentage / 100);
      return sum + (subtotal - discountAmount);
    }, 0);
    setTotalPrice(newTotal);
  }, [orderItems]);

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

    // Navigate to invoice preview or handle the data as needed
    navigate('/app/sales/invoice-preview', { state: { invoiceData: drData } });
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
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <ProductList 
          products={products} 
          onAddProduct={handleAddProduct} 
          dialogOpen={dialogOpen}
          selectedProduct={selectedProduct}
          onCloseDialog={() => setDialogOpen(false)}
        />
      </Grid>
      <Grid item xs={12} md={6}>
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
      
      {/* Hidden printable component */}
      <PrintableDR deliveryReportData={currentDR} contentRef={printContentRef} />
    </Grid>
  );
};

export default NewOrderPage;