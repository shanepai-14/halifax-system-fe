import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Typography, Box, Paper, Grid, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PrinterOutlined, RollbackOutlined, HomeOutlined , DownOutlined , UpOutlined , CheckCircleOutlined  } from '@ant-design/icons';
import { useSales } from '@/hooks/useSales';
import { formatDate } from '@/utils/dateUtils';
import CreditMemoModal from './CreditMemoModal';
import CreditMemoReportModal from './CreditMemoReportModal';
import PaymentButton from './PaymentButton';
import PaymentHistory from './PaymentHistory';
import PaymentReceipt from './PaymentReceipt';
import SaleKebabMenu from './SaleKebabMenu';

const DeliveryReportView = ({ refresh , report }) => {
  const [createMemoOpen, setCreateMemoOpen] = useState(false);
  const [creditMemoReportOpen, setCreditMemoReportOpen] = useState(false);
  const [returnItems, setReturnItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');
  const navigate = useNavigate();
  const contentRef = useRef();
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const { createCreditMemo , markAsDelivered } = useSales();

  // Enhanced theme for dot matrix printing
  const courierTheme = createTheme({
    typography: {
      fontFamily: '"Courier New", "Courier", "Liberation Mono", monospace',
      fontSize: 12,
      fontWeightRegular: 400,
      fontWeightMedium: 400, // Avoid bold weights for dot matrix
      fontWeightBold: 400,
      // Override all Typography variants
      h1: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      h2: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      h3: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      h4: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      h5: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      h6: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      subtitle1: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      subtitle2: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      body1: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      body2: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      button: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      caption: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
      overline: { fontFamily: '"Courier New", "Courier", monospace', fontWeight: 400 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@media print': {
            '*': {
              fontFamily: '"Courier New", "Courier", monospace !important',
              fontSize: '12px !important',
              fontWeight: 'normal !important',
              WebkitFontSmoothing: 'none !important',
              MozOsxFontSmoothing: 'unset !important',
              fontSmooth: 'never !important',
              textRendering: 'optimizeSpeed !important',
              letterSpacing: '0 !important',
              wordSpacing: '0 !important',
            },
            '@page': {
              size: 'A4',
              margin: '0.5in',
            },
            'html, body': {
              zoom: '1 !important',
              transform: 'scale(1) !important',
              WebkitTransform: 'scale(1) !important',
            }
          }
        }
      },
      MuiTable: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-root': {
              fontFamily: '"Courier New", "Courier", monospace',
              fontSize: 12,
              fontWeight: 'normal',
              padding: '2px 4px',
            }
          }
        }
      }
    }
  });

  // Initialize return items from report items
  React.useEffect(() => {
    if (report && report.items) {
      setReturnItems(
        report.items.map(item => ({
          ...item,
          return_quantity: 0,
          max_quantity: item.quantity,
        }))
      );
    }
  }, [report]);

  // Enhanced print handler with dot matrix optimizations
const handlePrint = useReactToPrint({
  contentRef, // This is preferred over `contentRef` directly
  pageStyle: `
    @page {
      size: A4;
      margin: 0.5in;
    }

    body {
      font-family: "Courier New", Courier, monospace !important;
      font-size: 12px !important;
      font-weight: normal !important;
      -webkit-font-smoothing: none !important;
      -moz-osx-font-smoothing: auto !important;
      color-adjust: exact !important;
      -webkit-print-color-adjust: exact !important;
      text-rendering: optimizeSpeed !important;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 2px 4px;
      white-space: nowrap;
      border: none;
    }

    .no-print {
      display: none !important;
    }
  `,
  onBeforePrint: async ()  => {
    document.body.style.zoom = "1";
    document.body.style.transform = "scale(1)";
  },
  onAfterPrint: () => {
    document.body.style.zoom = "";
    document.body.style.transform = "";
  }
});


  // Alternative print method for better dot matrix compatibility
 const handleAlternativePrint = () => {
    const printWindow = window.open('', '_blank');
  
    // Create a clean HTML structure
    const cleanHTML = `
      <html>
        <head>
          <title>Delivery Report - ${report.invoice_number}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 0.5in;
              }
              
              * {
                font-family: "Courier New", "Courier", monospace !important;
                font-size: 12px !important;
                font-weight: normal !important;
                -webkit-font-smoothing: none !important;
                -moz-osx-font-smoothing: unset !important;
                font-smooth: never !important;
                text-rendering: optimizeSpeed !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                letter-spacing: 0 !important;
                word-spacing: 0 !important;
                line-height: 1.2 !important;
              }
              
              body {
                margin: 0;
                padding: 20px;
                background: white;
              }
              
              table {
                border-collapse: collapse;
                width: 100%;
              }
              
              td, th {
                padding: 2px 4px;
                border: none;
                white-space: nowrap;
              }
              
              .no-print {
                display: none !important;
              }
            }
            
            body {
              font-family: "Courier New", "Courier", monospace;
              font-size: 12px;
              line-height: 1.2;
              margin: 0;
              padding: 20px;
            }
            
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .underline { text-decoration: underline; }
            .signature-line {
              border-top: 1px solid #000;
              padding-top: 10px;
              text-align: center;
              min-height: 60px;
              display: inline-block;
              width: 200px;
              margin-right: 50px;
            }
            .totals-table {
              float: right;
              width: 400px;
            }
            .totals-table td {
              padding: 2px 8px;
            }
            .content-area {
              min-height: calc(100vh - 50px);
              display: flex;
              flex-direction: column;
            }
            .footer-section {
              margin-top: auto;
              padding-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="content-area">
            <div class="center">
              <h2>DELIVERY REPORT</h2>
              <h3>${report.invoice_number}</h3>
            </div>
            
            <table width="100%" style="margin-bottom: 20px;">
              <tr>
                <td width="50%">
                  <strong>Halifax Glass & Aluminum Supply</strong><br>
                  Malagamot Road, Panacan<br>
                  glasshalifax@gmail.com<br>
                  0939 924 3876
                </td>
                <td width="50%" class="right">
                  <strong>Order Date:</strong> ${formatDate(report.order_date)}<br>
                  <strong>Delivery Date:</strong> ${formatDate(report.delivery_date)}<br>
                  <strong>Payment Method:</strong> ${report.payment_method.toUpperCase()}<br>
                  <strong>Status:</strong> ${report.status.toUpperCase()}
                </td>
              </tr>
            </table>
            
            <table width="100%" style="margin-bottom: 20px;">
              <tr>
                <td><strong>Delivered to:</strong></td>
                <td class="underline">${report.customer?.business_name || report.customer?.customer_name}</td>
              </tr>
              <tr>
                <td><strong>Address:</strong></td>
                <td class="underline">${report.customer?.business_address || report.address}</td>
                <td><strong>Phone:</strong></td>
                <td class="underline">${report.phone}</td>
              </tr>
            </table>
            
            <hr>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span><strong>Order Items</strong></span>
              ${report.term_days !== 0 && report.term_days ? `<span><strong>Term: ${report.term_days}</strong></span>` : ''}
            </div>
            
            <table width="100%" border="1" style="border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr>
                  <th style="text-align: right; width: 50px;">Qty</th>
                  <th style="text-align: left; width: 50px;">Unit</th>
                  <th style="text-align: left;">Item</th>
                  <th style="text-align: right; width: 100px;">Price</th>
                  <th style="text-align: right; width: 100px;">Net Price</th>
                </tr>
              </thead>
              <tbody>
                ${(() => {
                  // Group items by category
                  const groupedItems = report.items.reduce((acc, item) => {
                    const categoryName = item.product?.category?.name || 'Uncategorized';
                    if (!acc[categoryName]) {
                      acc[categoryName] = [];
                    }
                    acc[categoryName].push(item);
                    return acc;
                  }, {});

                  const sortedCategories = Object.keys(groupedItems).sort();
                  
                  return sortedCategories.map((categoryName) => {
                    let categoryHTML = `<tr><td colspan="5" style="font-weight: bold; font-style: italic;">${categoryName}</td></tr>`;
                    
                    groupedItems[categoryName].forEach((item) => {
                      const itemSubtotal = parseFloat(item.sold_price) * item.quantity;
                      const discountAmount = itemSubtotal * (parseFloat(item.discount) / 100);
                      const finalAmount = itemSubtotal - discountAmount;
                      
                      categoryHTML += `
                        <tr>
                          <td style="text-align: right;">${item.quantity}</td>
                          <td style="text-align: left;">${item.product.attribute?.unit_of_measurement || ''}</td>
                          <td style="text-align: left;">${item.product?.product_name}</td>
                          <td style="text-align: right;">${formatCurrency(parseFloat(item.sold_price))}</td>
                          <td style="text-align: right;">${formatCurrency(finalAmount)}</td>
                        </tr>
                      `;
                      
                      if (item.composition) {
                        categoryHTML += `
                          <tr>
                            <td colspan="5" style="padding-left: 40px;">
                              <strong>Composition:</strong><br>
                              <div style="padding-left: 16px;">${item.composition}</div>
                            </td>
                          </tr>
                        `;
                      }
                    });
                    
                    return categoryHTML;
                  }).join('');
                })()}
              </tbody>
            </table>
            
            <table width="100%" style="margin-bottom: 20px;">
              <tr>
                <td width="50%" style="vertical-align: top;">
                  <strong>Delivery Status:</strong> ${report.is_delivered ? 'Delivered' : 'Pending Delivery'}<br>
                  <strong>Encoded By:</strong> ${report.user?.name}
                </td>
                <td width="50%">
                  <table class="totals-table">
                    <tr>
                      <td style="text-align: right;">Subtotal:</td>
                      <td style="text-align: right;">${formatCurrency(subtotal)}</td>
                    </tr>
                    <tr>
                      <td style="text-align: right;">Delivery Fee:</td>
                      <td style="text-align: right;">${formatCurrency(deliveryFee)}</td>
                    </tr>
                    <tr>
                      <td style="text-align: right;">Cutting Charges:</td>
                      <td style="text-align: right;">${formatCurrency(cuttingCharges)}</td>
                    </tr>
                    <tr>
                      <td style="text-align: right;">Discount:</td>
                      <td style="text-align: right;">${formatCurrency(totalDiscount)}</td>
                    </tr>
                    ${report.returns && report.returns.length > 0 ? `
                    <tr>
                      <td style="text-align: right;">Credit Memo Total:</td>
                      <td style="text-align: right;">${formatCurrency(totalCreditMemoAmount)}</td>
                    </tr>
                    ` : ''}
                    <tr style="font-weight: bold; font-size: 14px;">
                      <td style="text-align: right;">Total Amount:</td>
                      <td style="text-align: right;">${formatCurrency(totalAmount)}</td>
                    </tr>
                    ${report.amount_received !== '0.00' && report.amount_received ? `
                    <tr>
                      <td style="text-align: right;">Amount Received:</td>
                      <td style="text-align: right;">${formatCurrency(parseFloat(report.amount_received))}</td>
                    </tr>
                    ` : ''}
                    ${report.change !== '0.00' && report.change ? `
                    <tr>
                      <td style="text-align: right;">Change:</td>
                      <td style="text-align: right;">${formatCurrency(parseFloat(report.change))}</td>
                    </tr>
                    ` : ''}
                  </table>
                </td>
              </tr>
            </table>
            
            ${report.remarks ? `
            <div style="margin-bottom: 20px;">
              <strong>Remarks:</strong><br>
              ${report.remarks}
            </div>
            ` : ''}
            
            <!-- Footer Section - Always at bottom -->
            <div class="footer-section">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div class="signature-line">Prepared By</div>
                <div class="signature-line">Checked By</div>
                <div class="signature-line">Released By</div>
              </div>
              
              <div style="display: flex; justify-content: center; gap: 100px; margin-bottom: 10px;">
                <div class="signature-line">Delivered By</div>
                <div class="signature-line">Received By</div>
              </div>
              
              <div style="text-align: center; border-top: 1px solid #ccc; padding-top: 20px;">
                <strong>Note: This Office will not entertain any claim of shortage after receipt has been duly acknowledged</strong>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(cleanHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };


  // Test print quality function
  const testPrintQuality = () => {
    const testWindow = window.open('', '_blank');
    testWindow.document.write(`
      <html>
        <head>
          <title>Print Quality Test</title>
          <style>
            @media print {
              * { 
                -webkit-font-smoothing: none !important;
                font-smooth: never !important;
                text-rendering: optimizeSpeed !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
            }
            body { 
              font-family: "Courier New", "Courier", monospace; 
              font-size: 12px;
              line-height: 1.2;
              margin: 20px;
            }
          </style>
        </head>
        <body>
          <pre>
DOT MATRIX PRINT QUALITY TEST
==============================

Font: Courier New, 12px
Characters: ABCDEFGHIJKLMNOPQRSTUVWXYZ
Numbers:    0123456789
Symbols:    !@#$%^&*()_+-=[]{}|;:,.<>?

Alignment Test:
Item                     Price      Total
------------------------+----------+----------
Sample Item 1            ₱1,234.56  ₱1,234.56
Another Sample Item      ₱2,345.67  ₱4,691.34
Long Item Name Here      ₱3,456.78  ₱6,913.56
------------------------+----------+----------
TOTAL                              ₱12,839.46

If this prints clearly without blur, 
your dot matrix printer setup is working correctly.
          </pre>
        </body>
      </html>
    `);
    testWindow.document.close();
    testWindow.print();
  };

  const handleOpenCreateMemo = () => {
    setCreateMemoOpen(true);
  };

  const handleCloseCreateMemo = () => {
    setCreateMemoOpen(false);
  };

  const handleOpenCreditMemoReport = () => {
    setCreditMemoReportOpen(true);
  };

  const handleCloseCreditMemoReport = () => {
    setCreditMemoReportOpen(false);
  };

  const handleReturnQuantityChange = (itemId, value,returned_quantity) => {
    const quantity = Math.max(0, parseInt(value) || 0);
  
    setReturnItems(
      returnItems.map(item => {
        if (item.id === itemId) {
          const availableQuantity = item.max_quantity - (returned_quantity || 0); // Correct available quantity
          
          return {
            ...item,
            return_quantity: Math.min(quantity, availableQuantity) // Restrict to available stock
          };
        }
        return item;
      })
    );
  };

  const handleSubmitCreditMemo = async () => {
    // Filter items that have return quantity > 0
    const itemsToReturn = returnItems.filter(item => item.return_quantity > 0);
    
    if (itemsToReturn.length === 0) {
      alert('Please specify at least one item to return');
      return;
    }

    const refund_amount = itemsToReturn.reduce((total, item) => {
      return total + item.return_quantity * item.sold_price;
    }, 0);

    try {
      const memoData = {
        sale_id: report.id,
        remarks: returnReason,
        refund_method:'cash',
        refund_amount: refund_amount,
        items: itemsToReturn.map(item => ({
          sale_item_id : item.id,
          product_id: item.product_id,
          quantity: item.return_quantity,
          price: item.sold_price
        }))
      };

      // Call API to create credit memo
      const result = await createCreditMemo(memoData);
      
      if (result) {
        handleCloseCreateMemo();
        refresh(report.id);
      }
    } catch (error) {
      // Error handling
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      await markAsDelivered(report.id);
      // Refresh the report data after marking as delivered
      refresh(report.id, true);
    } catch (error) {
      console.error("Error marking report as delivered:", error);
    }
  };

  // Calculate total credit memo amount
  const totalCreditMemoAmount = report?.returns?.reduce((total, returnItem) => {
    const returnTotal = returnItem.items?.reduce((sum, item) => {
      return sum + parseFloat(item.quantity || 0) * parseFloat(item.price || 0);
    }, 0) || 0;
  
    return total + returnTotal;
  }, 0) || 0;

  const handlePaymentUpdate = async (result) => {
    refresh(report.id , true);
    const combinedData = {
      ...report,
      ...result.sale, 
    };

    setSelectedReceipt({ payment: { ...result },  sale: { ...combinedData } });
  };
  
  // Add togglePaymentHistory function
  const togglePaymentHistory = () => {
    setShowPaymentHistory(!showPaymentHistory);
  };
  
  // Currency formatting for consistent alignment
  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!report) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">No delivery report data available</Typography>
        <Button 
          variant="contained" 
          startIcon={<HomeOutlined />} 
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  // Calculate totals
  const subtotal = report.items.reduce((sum, item) => {
    return sum + (parseFloat(item.sold_price) * item.quantity);
  }, 0);

  const deliveryFee = parseFloat(report.delivery_fee) || 0;
  const cuttingCharges = parseFloat(report.cutting_charges) || 0;

  const totalDiscount = report.items.reduce((sum, item) => {
    const itemSubtotal = parseFloat(item.sold_price) * item.quantity;
    const discountAmount = itemSubtotal * (parseFloat(item.discount) / 100);
    return sum + discountAmount;
  }, 0);

  const totalAmount = (subtotal + deliveryFee + cuttingCharges) - totalDiscount;

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Delivery Report Details</Typography>

          <Box className="no-print">
            <PaymentButton 
              sale={report}
              onPaymentSuccess={handlePaymentUpdate}
              disabled={report.status == 'cancelled' || report.status == 'completed'}
            />
            {!report.is_delivered && report.status !== 'cancelled' && (
              <Button
                variant="outlined"
                color="success"
                startIcon={<CheckCircleOutlined />}
                onClick={handleMarkAsDelivered}
                sx={{ mr: 1 }}
              >
                Mark Delivered
              </Button>
            )}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PrinterOutlined />}
              onClick={handlePrint}
              sx={{ mr: 1 }}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={handleAlternativePrint}
              sx={{ mr: 1 }}
            >
              Alt Print
            </Button>
            {/* <Button
              variant="outlined"
              color="warning"
              onClick={testPrintQuality}
              sx={{ mr: 1 }}
            >
              Test Print
            </Button> */}
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RollbackOutlined />}
              onClick={handleOpenCreateMemo}
              disabled={false}
            >
              Create Credit Memo
            </Button>

            <SaleKebabMenu 
              refresh={refresh}
              sale={report}
            />
          </Box>
        </Box>

        <ThemeProvider theme={courierTheme}>
          <Box 
            ref={contentRef} 
            sx={{ 
              p: 2, 
              minHeight: '100vh', 
              display: 'flex', 
              flexDirection: 'column',
              fontFamily: '"Courier New", "Courier", monospace',
              fontSize: 12,
              lineHeight: 1.2,
              letterSpacing: 0,
              wordSpacing: 0,
            }}
          >
            {/* Company Header with Logo */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={12}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h4">DELIVERY REPORT</Typography>
                  <Typography variant="h6">{report.invoice_number}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent:'space-between'}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="h5">Halifax Glass & Aluminum Supply</Typography>
                  <Typography>Malagamot Road, Panacan</Typography>
                  <Typography>glasshalifax@gmail.com</Typography>
                  <Typography>0939 924 3876</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography>
                    <strong>Order Date:</strong> {formatDate(report.order_date)}
                  </Typography>
                  <Typography>
                    <strong>Delivery Date:</strong> {formatDate(report.delivery_date)}
                  </Typography>
                  <Typography>
                    <strong>Payment Method:</strong> {report.payment_method.toUpperCase()}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {report.status.toUpperCase()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Customer & Order Info */}
            <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
              <Grid item xs={12} md={12}>
                <Box sx={{ mb: 0.5 }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0', width: '2.5%', verticalAlign: 'top' }}>
                          <Typography fontSize={18} lineHeight={1}>
                            <strong>Delivered to:</strong>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', padding: '8px 16px 8px 0', width: '10.5%', verticalAlign: 'top' }}>
                          <Typography fontSize={18} lineHeight={1}>
                            <span style={{ textDecoration: 'underline' }}>
                              {report.customer?.business_name || report.customer?.customer_name}
                            </span>
                          </Typography>
                        </TableCell>
                        {/* <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0', width: '0.5%', verticalAlign: 'top' }}>
                          <Typography fontSize={18} lineHeight={1}>
                            <strong>City:</strong>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0', width: '12.5%', verticalAlign: 'top' }}>
                          <Typography fontSize={18} lineHeight={1}>
                            <span style={{ textDecoration: 'underline' }}>
                              {report.city}
                            </span>
                          </Typography>
                        </TableCell> */}
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0', width: '2.5%', verticalAlign: 'top' }}>
                          <Typography fontSize={18} lineHeight={1}>
                            <strong>Address:</strong>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0', width: '10.5%', verticalAlign: 'top' }}>
                          <Typography fontSize={18} lineHeight={1}>
                            <span style={{ textDecoration: 'underline' }}>
                              {report.customer?.business_address || report.address}
                            </span>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0', width: '0.5%', verticalAlign: 'top' }}>
                          <Typography fontSize={18} lineHeight={1}>
                            <strong>Phone:</strong>
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', padding: '8px 0', width: '12.5%', verticalAlign: 'top' }}>
                          <Typography fontSize={18} lineHeight={1}>
                            <span style={{ textDecoration: 'underline' }}>
                              {report.phone}
                            </span>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 1 }} />

            {/* Content Area - grows to fill available space */}
            <Box sx={{ flex: 1 }}>
              {/* Items Table */}
              <Box display='flex' justifyContent="space-between">
                <Typography variant="subtitle1" gutterBottom>Order Items</Typography>
                {report.term_days !== 0 && report.term_days && (
                  <Typography variant="h6">
                    <strong>Term :</strong> {report.term_days}
                  </Typography>
                )}
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="left" width={'15px'}>Unit</TableCell>
                      <TableCell align="left">Item</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Net Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(() => {
                      // Group items by category
                      const groupedItems = report.items.reduce((acc, item) => {
                        const categoryName = item.product?.category?.name || 'Uncategorized';
                        if (!acc[categoryName]) {
                          acc[categoryName] = [];
                        }
                        acc[categoryName].push(item);
                        return acc;
                      }, {});

                      // Sort categories alphabetically (optional)
                      const sortedCategories = Object.keys(groupedItems).sort();

                      return sortedCategories.map((categoryName) => (
                        <React.Fragment key={categoryName}>
                          {/* Category Header Row */}
                          <TableRow sx={{border:'none'}}>
                            <TableCell 
                              colSpan={4} 
                              sx={{ 
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                fontStyle:"italic",
                                py:0,
                                border:'none'
                              }}
                            >
                              {categoryName}
                            </TableCell>
                          </TableRow>
                          
                          {/* Items under this category */}
                          {groupedItems[categoryName].map((item) => {
                            const itemSubtotal = parseFloat(item.sold_price) * item.quantity;
                            const discountAmount = itemSubtotal * (parseFloat(item.discount) / 100);
                            const finalAmount = itemSubtotal - discountAmount;
                            
                            return (
                              <React.Fragment key={item.id}>
                                {/* Regular item row */}
                                <TableRow sx={{py:0.5 , border:'none'}}>
                                  <TableCell align="right" sx={{py:0.5 , border:'none'}}>{item.quantity}</TableCell>
                                  <TableCell align="left" sx={{py:0.5 , border:'none'}}>{item.product.attribute?.unit_of_measurement ?? " "}</TableCell>
                                  <TableCell align="left" sx={{py:0.5 , border:'none'}}>{item.product?.product_name}</TableCell>
                                  <TableCell align="right" sx={{py:0.5 , border:'none'}}>{formatCurrency(parseFloat(item.sold_price))}</TableCell>
                                  <TableCell align="right" sx={{py:0.5 , border:'none'}}>{formatCurrency(finalAmount)}</TableCell>
                                </TableRow>
                                
                                {/* Composition row - only shown when composition exists */}
                                {item.composition && (
                                  <TableRow>
                                    <TableCell colSpan={4} sx={{ pt: 0, pb: 2 }}>
                                      <Box 
                                        sx={{ 
                                          pl: 4, // Extra indentation for composition under categorized items
                                          pr: 2,
                                          pt: 1,
                                          pb: 1,
                                        }}
                                      >
                                        <Typography variant="subtitle2" color="primary">
                                          Composition:
                                        </Typography>
                                        <div 
                                          className="composition-content"
                                          dangerouslySetInnerHTML={{ __html: item.composition }}
                                          style={{ 
                                            paddingLeft: '16px',
                                            margin: 0
                                          }}
                                        />
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </React.Fragment>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex',justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection:'column',justifyContent: 'flex-start' }}>
                  <Typography>
                    <strong>Delivery Status:</strong> {report.is_delivered ? 'Delivered' : 'Pending Delivery'}
                  </Typography>
                  <Typography>
                    <strong>Encoded By:</strong> {report.user?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Grid container spacing={0} sx={{ maxWidth: '400px' }}>
                    <Grid item xs={6}>
                      <Typography align="right">Subtotal:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{formatCurrency(subtotal)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">Delivery Fee:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{formatCurrency(deliveryFee)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">Cutting Charges:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{formatCurrency(cuttingCharges)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">Discount:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">{formatCurrency(totalDiscount)}</Typography>
                    </Grid>

                    {/* Credit Memo Total - Only show when returns exist */}
                    {report.returns && report.returns.length > 0 && (
                      <>
                        <Grid item xs={6}>
                          <Typography 
                            variant="body2" 
                            align="right"
                            onClick={handleOpenCreditMemoReport}
                            sx={{ 
                              cursor: 'pointer', 
                              color: 'primary.main',
                              '&:hover': { textDecoration: 'underline' } 
                            }}
                          >
                            Credit Memo Total:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography 
                            variant="body2" 
                            align="right"
                            onClick={handleOpenCreditMemoReport}
                            sx={{ 
                              cursor: 'pointer', 
                              color: 'primary.main',
                              '&:hover': { textDecoration: 'underline' } 
                            }}
                          >
                            {formatCurrency(totalCreditMemoAmount)}
                          </Typography>
                        </Grid>
                      </>
                  )}

          <Grid item xs={6}>
            <Typography fontWeight="bold" align="right" fontSize="1.2rem">
              Total Amount:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography fontWeight="bold" align="right" fontSize="1.2rem">
              ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Grid>
                  {report.amount_received !== '0.00' && report.amount_received && (
                  <>
                    <Grid item xs={6}>
                      <Typography  align="right">Amount Received:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography  align="right">
                        ₱{parseFloat(report.amount_received).toFixed(2)}
                      </Typography>
                    </Grid>
                  </>
                )}
             {report.change !== '0.00' && report.change && (
               <>
                  <Grid item xs={6}>
                    <Typography  align="right">Change:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography  align="right">₱{parseFloat(report.change).toFixed(2)} {typeof(report.change)}</Typography>
                  </Grid>
               
                </>
            
            )}
             </Grid>
          </Box>
        </Box>

            {/* Additional Information */}
            {report.remarks && (
              <Box sx={{ mt: 3 }}>
                <Typography >Remarks:</Typography>
                <Typography variant="body2">{report.remarks}</Typography>
              </Box>
            )}
          </Box>

          {/* Footer Section - Always at bottom */}
          <Box sx={{ mt: 'auto', pt: 3 }}>
            {/* Signature Lines */}
            <Grid container spacing={2} sx={{ px: 2, display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Grid item xs={2.4}>
                <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center', minHeight: '60px' }}>
                  <Typography variant="body2">Prepared By</Typography>
                </Box>
              </Grid>
              <Grid item xs={2.4}>
                <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center', minHeight: '60px' }}>
                  <Typography variant="body2">Checked By</Typography>
                </Box>
              </Grid>
              <Grid item xs={2.4}>
                <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center', minHeight: '60px' }}>
                  <Typography variant="body2">Released By</Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Grid container spacing={2} sx={{ px: 2, display: 'flex', justifyContent: 'center', gap: 15, mb: 4 }}>
              <Grid item xs={2.4}>
                <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center', minHeight: '60px' }}>
                  <Typography variant="body2">Delivered By</Typography>
                </Box>
              </Grid>
              <Grid item xs={2.4}>
                <Box sx={{ borderTop: '1px solid #000', pt: 1, textAlign: 'center', minHeight: '60px' }}>
                  <Typography variant="body2">Received By</Typography>
                </Box>
              </Grid>
            </Grid>
            
            {/* Note at bottom */}
            <Box sx={{ textAlign: 'center', mt: 2, borderTop: '1px solid #e0e0e0', pt: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                Note: This Office will not entertain any claim of shortage after receipt has been duly acknowledged
              </Typography>
            </Box>
          </Box>
        </Box>
        </ThemeProvider>
      </Paper>

      <Box sx={{ mt: 3, mb: 2 }}>
  <Button 
    variant="text" 
    color="primary"
    onClick={togglePaymentHistory}
    startIcon={showPaymentHistory ? <UpOutlined /> : <DownOutlined />}
  >
    {showPaymentHistory ? 'Hide Payment History' : 'Show Payment History'}
  </Button>
</Box>


    {showPaymentHistory && (
      <Box sx={{ mt: 2 }}>
        <PaymentHistory 
          sale={report} 
          onPaymentUpdate={handlePaymentUpdate}
          setSelectedReceipt={setSelectedReceipt}
        />
      </Box>
    )}
    {selectedReceipt && (

      <Dialog 
        open={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        maxWidth="md"
        fullWidth
      >
        <PaymentReceipt 
          paymentRecord={selectedReceipt} 
          onClose={() => setSelectedReceipt(null)}
        />
      </Dialog>
       )}
    

      {/* Credit Memo Modal Component */}
      <CreditMemoModal 
        open={createMemoOpen}
        onClose={handleCloseCreateMemo}
        returnItems={returnItems}
        handleReturnQuantityChange={handleReturnQuantityChange}
        returnReason={returnReason}
        setReturnReason={setReturnReason}
        handleSubmitCreditMemo={handleSubmitCreditMemo}
        returns={report.returns}
      />

      {/* Credit Memo Report Modal - Only rendered when returns exist */}
      {report.returns && report.returns.length > 0 && (
        <CreditMemoReportModal
          open={creditMemoReportOpen}
          onClose={handleCloseCreditMemoReport}
          returns={report.returns}
          report={report}
        />
      )}
    </>
  );
  }

export default DeliveryReportView;