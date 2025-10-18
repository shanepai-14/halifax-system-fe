import React, { useRef, useState , useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Typography, Box, Paper, Grid, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PlusOutlined ,PrinterOutlined, RollbackOutlined, HomeOutlined , DownOutlined , UpOutlined , CheckCircleOutlined, DownloadOutlined , SendOutlined ,LoadingOutlined , TruckOutlined  } from '@ant-design/icons';
import { useSales } from '@/hooks/useSales';
import { formatDate } from '@/utils/formatUtils';
import CreditMemoModal from './CreditMemoModal';
import CreditMemoReportModal from './CreditMemoReportModal';
import PaymentButton from './PaymentButton';
import PaymentHistory from './PaymentHistory';
import PaymentReceipt from './PaymentReceipt';
import SaleKebabMenu from './SaleKebabMenu';
import qz from 'qz-tray';
import { Alert, Snackbar } from '@mui/material';

const DeliveryReportView = ({ refresh , report }) => {
  const [createMemoOpen, setCreateMemoOpen] = useState(false);
  const [creditMemoReportOpen, setCreditMemoReportOpen] = useState(false);
  const [returnItems, setReturnItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');
  const navigate = useNavigate();
  const contentRef = useRef();
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loadingPrint , setLoadingPrint] = useState(false);
  const [itemsFontSize, setItemsFontSize] = useState(() => {
  const saved = localStorage.getItem('deliveryReport_fontSize');
  return saved ? parseInt(saved) : 12;
});

const [qzConnected, setQzConnected] = useState(false);
const [printerName, setPrinterName] = useState(() => {
  return localStorage.getItem('selectedPrinter') || '';
});
const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { createCreditMemo , markAsDelivered , sendToPrinter } = useSales();

  useEffect(() => {
  connectQZ();
  return () => {
    if (qz.websocket.isActive()) {
      qz.websocket.disconnect();
    }
  };
}, []);

const connectQZ = async () => {
  try {
    if (!qz.websocket.isActive()) {
      await qz.websocket.connect();
      setQzConnected(true);
      setSnackbar({ open: true, message: 'QZ Tray connected successfully', severity: 'success' });
      
      if (!printerName) {
        const defaultPrinter = await qz.printers.getDefault();
        setPrinterName(defaultPrinter);
        localStorage.setItem('selectedPrinter', defaultPrinter);
      }
    }
  } catch (error) {
    console.error('Failed to connect to QZ Tray:', error);
    setQzConnected(false);
    setSnackbar({ open: true, message: 'Failed to connect to QZ Tray. Please ensure QZ Tray is running.', severity: 'error' });
  }
};
  
  useEffect(() => {
  localStorage.setItem('deliveryReport_fontSize', itemsFontSize.toString());
}, [itemsFontSize]);

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

  // Currency formatting for consistent alignment
  const formatCurrency = (amount , dotMatrix = false) => {
    return `${ dotMatrix ? '' : '₱'}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Function to strip HTML tags and format composition text
  const formatComposition = (html) => {
    if (!html) return '';
    
    // Remove HTML tags and decode entities
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Format the text with proper indentation
    return text.split('\n').map(line => `    ${line.trim()}`).join('\n');
  };

  // Function to pad text for alignment
  const padRight = (text, length) => {
    return String(text).padEnd(length, ' ');
  };

  const padLeft = (text, length) => {
    return String(text).padStart(length, ' ');
  };

  // Generate plain text version for dot matrix printing
  const generateTextContent = () => {
    if (!report) return '';

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

    const totalCreditMemoAmount = report?.returns?.reduce((total, returnItem) => {
      const returnTotal = returnItem.items?.reduce((sum, item) => {
        return sum + parseFloat(item.quantity || 0) * parseFloat(item.price || 0);
      }, 0) || 0;
    
      return total + returnTotal;
    }, 0) || 0;

    // Build the text content
    let content = '';
    
    // Header
   
    content += '                                  DELIVERY  REPORT\n';
    content += `                                   ${report.invoice_number}\n\n`;
    
    
    // Company info and order details
    content += 'Halifax Glass & Aluminum Supply          ';
    content += `               Order Date: ${formatDate(report.order_date)}\n`;
    content += 'Malagamot Road, Panacan                 ';
    content += `                Delivery Date: ${formatDate(report.delivery_date)}\n`;
    content += 'glasshalifax@gmail.com                   ';
    content += `               Payment Method: ${report.payment_method.toUpperCase()}\n`;
    content += '0939 924 3876                            ';
    content += `               Status: ${report.status.toUpperCase()}\n\n`;
    
    // Customer info
    content += `Delivered to: ${report.customer?.business_name || report.customer?.customer_name}\n`;
    content += `Address: ${report.customer?.business_address || report.address}\n`;
    content += `Phone: ${report.phone}`;

  
    
    if (report.term_days !== 0 && report.term_days) {
      content += `${padLeft(`Term: ${report.term_days}`, 65)}\n`;
    } else {
      content += '\n';
    }
    content += '_____________________________________________________________________________________\n';
    content += ' Qty Unit Item                                        Price               Net Price\n';
    content += '_____________________________________________________________________________________\n';
    
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
    
    // Add items by category
    sortedCategories.forEach((categoryName) => {
      content += `${categoryName}\n`;
      
      groupedItems[categoryName].forEach((item) => {
        const itemSubtotal = parseFloat(item.sold_price) * item.quantity;
        const discountAmount = itemSubtotal * (parseFloat(item.discount) / 100);
        const finalAmount = itemSubtotal - discountAmount;
        
        const qty = padLeft(item.quantity.toString(), 4);
        const unit = padRight(item.product.attribute?.unit_of_measurement || '', 5);
        const itemName = padRight(item.product?.product_name || '', 40);
        const price = padLeft(formatCurrency(parseFloat(item.sold_price) ,true), 10);
        const netPrice = padLeft(formatCurrency(finalAmount,true), 10);
        
        content += `${qty} ${unit} ${itemName} ${price}            ${netPrice}\n`;
        
        // Add composition if exists
        if (item.composition) {
          content += '    Composition:\n';
          const compositionText = formatComposition(item.composition);
          content += `${compositionText}\n`;
        }
      });
      content += '\n';
    });
    
    content += '_____________________________________________________________________________________\n\n';
    
    // Status and totals section
    // content += `Delivery Status: ${report.is_delivered ? 'Delivered' : 'Pending'}\n`;
  const encodedByText = `Encoded By: ${report.user?.name}`;
  const encodedByLength = encodedByText.length;
  
  // Totals (right aligned)
  const totalsSection = [
    ['Subtotal:', formatCurrency(subtotal, true)],
    ['Delivery Fee:', formatCurrency(deliveryFee,true)],
    ['Cutting Charges:', formatCurrency(cuttingCharges,true)],
    ['Discount:', formatCurrency(totalDiscount,true)]
  ];
  
  if (report.returns && report.returns.length > 0) {
    totalsSection.push(['Credit Memo Total:', formatCurrency(totalCreditMemoAmount,true)]);
  }
  
  totalsSection.push(['Total Amount:', formatCurrency(totalAmount,true)]);
  
  if (report.amount_received !== '0.00' && report.amount_received) {
    totalsSection.push(['Amount Received:', formatCurrency(parseFloat(report.amount_received),true)]);
  }
  
  if (report.change !== '0.00' && report.change) {
    totalsSection.push(['Change:', formatCurrency(parseFloat(report.change),true)]);
  }
  
  // Add the first total on the same line as Encoded By
if (totalsSection.length > 0) {
    const [firstLabel, firstAmount] = totalsSection[0];
    const firstTotalLine = `${padLeft(firstLabel, encodedByLength >= 20 ? 37 : 47)} ${padLeft(firstAmount, 15)}`;
    
    // Calculate spacing: total line width (85) minus encoded by length
    const spacingNeeded = 85 - encodedByLength;
    const rightAlignedTotal = padLeft(firstTotalLine, spacingNeeded);

    content += `${encodedByText}${rightAlignedTotal}\n`;
    
    // Add remaining totals
    totalsSection.slice(1).forEach(([label, amount]) => {
      const line = `${padLeft(label, 57)} ${padLeft(amount, 15)}`;
      content += `${padLeft(line, 85)}\n`;
    });
  }

    
    content += '\n';
    
    // Remarks
    if (report.remarks) {
      content += `Remarks: ${report.remarks}\n\n`;
    }

      const contentLines = content.split('\n').length;
      const targetPageLines = 66; // Standard for 11" paper at 6 lines per inch
      const signatureLines = 16; // Space needed for signature section
      const footerLines = 4; // Space needed for the note
      const totalFooterLines = signatureLines + footerLines;
      const availableLines = targetPageLines - totalFooterLines;
  
  // Add blank lines to push signatures and note to bottom
  const linesToAdd = Math.max(0, availableLines - contentLines);
  console.log('availableLines ', availableLines);
  console.log('contentLines ',contentLines)
  console.log(availableLines - contentLines);
  content += '\n'.repeat(linesToAdd);
    
    // Signature section
    content += '\n\n\n';
    content += '     _________________            _________________            _________________\n';
    content += '        Prepared By                   Checked By                  Released By\n\n\n\n';
    content += '                   _________________             _________________ \n';
    content += '                     Delivered By                  Received By\n\n\n';

      content += '\n';
      content += 'Note: This Office will not entertain any claim of shortage after receipt has been\n';
      content += '                                 duly acknowledged\n';
      
      return content;
  };

  // Download text file function
  const handleDownloadText = () => {
    const textContent = generateTextContent();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `delivery_report_${report.invoice_number}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Enhanced print handler with dot matrix optimizations
  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        html, body {
          zoom: 1 !important;
          transform: scale(1) !important;
          -webkit-transform: scale(1) !important;
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


//   const handleSendToBackend = async () => {
//   try {
//     setLoadingPrint(true);
//     const textContent = generateTextContent();
    
//     await sendToPrinter({
//       content: textContent,
//       invoice_number: report.invoice_number,
//       sale_id: report.id,
//       filename: `delivery_report_${report.invoice_number}.txt`
//     });
    

    
//   } catch (error) {
//     console.error('Error sending to backend:', error);
   
//   } finally {

//     setLoadingPrint(false);
//   }
// };

  const handleSendToBackend = async () => {
  try {
    setLoadingPrint(true);
    
    if (!qz.websocket.isActive()) {
      await connectQZ();
    }

    if (!printerName) {
      setSnackbar({ open: true, message: 'No printer selected. Please select a printer first.', severity: 'warning' });
      return;
    }

    const textContent = generateTextContent();
    
    const config = qz.configs.create(printerName, {
      encoding: 'UTF-8',
      margins: { top: 0, right: 0, bottom: 0, left: 0 },
      size: { width: 8.5, height: 11 },
      units: 'in'
    });

    const data = [{
      type: 'raw',
      format: 'plain',
      data: textContent
    }];

    await qz.print(config, data);
    
    setSnackbar({ open: true, message: `Delivery report sent to printer: ${printerName}`, severity: 'success' });
    
  } catch (error) {
    console.error('Error printing with QZ Tray:', error);
    setSnackbar({ open: true, message: `Print error: ${error.message}`, severity: 'error' });
  } finally {
    setLoadingPrint(false);
  }
};

const handleSelectPrinter = async () => {
  try {
    if (!qz.websocket.isActive()) {
      await connectQZ();
    }

    const printers = await qz.printers.find();
    
    const selectedPrinter = window.prompt(
      `Available printers:\n${printers.join('\n')}\n\nEnter printer name:`,
      printerName || printers[0]
    );

    if (selectedPrinter) {
      setPrinterName(selectedPrinter);
      localStorage.setItem('selectedPrinter', selectedPrinter);
      setSnackbar({ open: true, message: `Printer set to: ${selectedPrinter}`, severity: 'success' });
    }
  } catch (error) {
    console.error('Error getting printers:', error);
    setSnackbar({ open: true, message: 'Failed to get printer list', severity: 'error' });
  }
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

    const handleCreateSale = () => {
    navigate('/app/sales');
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

  const totalAmount = ((subtotal + deliveryFee + cuttingCharges) - totalDiscount) - totalCreditMemoAmount;

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
                startIcon={<TruckOutlined />}
                onClick={handleMarkAsDelivered}
                sx={{ mr: 1 }}
              >
                Mark Delivered
              </Button>
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePrint}
              sx={{ mr: 1, py: 1 }}
            >
             <PrinterOutlined />
            </Button>
            <Button
            variant="outlined"
            color={qzConnected ? "success" : "error"}
            onClick={handleSendToBackend}
            size="medium"
            sx={{ mr: 1 ,py: 1  }}
          >
           {loadingPrint ? <LoadingOutlined/> : <SendOutlined /> }  
          </Button>

          <Button
      variant="outlined"
      color="secondary"
      onClick={handleSelectPrinter}
      size="medium"
      sx={{ mr: 1, py: 1 }}
      title="Select Printer"
    >
      Select Printer
          </Button>
            <Button
            variant="outlined"
            color="info"
            size="medium"
            onClick={handleDownloadText}
            sx={{ mr: 1, py: 1 }}
          >
            <DownloadOutlined />
          </Button>
            {/* <Button
              variant="outlined"
              color="info"
              onClick={handleAlternativePrint}
              sx={{ mr: 1 }}
            >
              Alt Print
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={testPrintQuality}
              sx={{ mr: 1 }}
            >
              Test Print
            </Button> */}

      {report.status === 'cancelled' ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlusOutlined />}
          onClick={handleCreateSale}
        >
          Create New Sale
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RollbackOutlined />}
          onClick={handleOpenCreateMemo}
        >
          Credit Memo
        </Button>
      )}


            <SaleKebabMenu 
              refresh={refresh}
              sale={report}
              itemsFontSize={itemsFontSize}
              setItemsFontSize={setItemsFontSize}
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
                  <Typography variant="h4" sx={{ fontSize: `${itemsFontSize + 6}px!important` }}>DELIVERY REPORT</Typography>
                  <Typography variant="h6" sx={{ fontSize: `${itemsFontSize + 2}px!important` }}>{report.invoice_number}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent:'space-between'}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="h5" sx={{ fontSize: `${itemsFontSize + 4}px!important` }}>Halifax Glass & Aluminum Supply</Typography>
                  <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>Malagamot Road, Panacan</Typography>
                  <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>glasshalifax@gmail.com</Typography>
                  <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>0939 924 3876</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                 <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline' }}>
                  Order Date:
                </Typography>{' '}
                {formatDate(report.order_date)}
              </Typography>
              <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline!important' }}>
                  Delivery Date:
                </Typography>{' '}
                {formatDate(report.delivery_date)}
              </Typography>

              <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline!important' }}>
                  Payment Method:
                </Typography>{' '}
                {report.payment_method.toUpperCase()}
              </Typography>

              <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline!important' }}>
                  Status:
                </Typography>{' '}
                {report.status.toUpperCase()}
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
                      <TableRow >
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0',  verticalAlign: 'bottom'  , width: '20%'}}>
                          <Typography lineHeight={1} sx={{ fontSize: `${itemsFontSize + 6}px!important` , fontWeight: '600!important' , marginBottom:'0!important'}}>
                            Delivered to:
                          </Typography>
                        </TableCell>
                        <TableCell colSpan={3} sx={{ border: 'none', padding: '8px 16px 8px 0',  verticalAlign: 'bottom' }}>
                        <Typography
                          component="span" lineHeight={1}
                          sx={{ textDecoration: 'underline!important' ,fontSize: `${itemsFontSize + 6}px!important` , display: 'inline!important', }}
                        >
                          {report.customer?.business_name || report.customer?.customer_name}
                        </Typography>

                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0', width: '20%' ,verticalAlign: 'top' }}>
                          <Typography  lineHeight={1} sx={{ fontSize: `${itemsFontSize + 6}px!important` ,fontWeight: '600!important' }}>
                            Address:
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0',  verticalAlign: 'top' }}>
                           <Typography
                          component="span" lineHeight={1}
                          sx={{ textDecoration: 'underline!important' ,fontSize: `${itemsFontSize + 6}px!important` , display: 'inline!important', }}
                        >
                    
                              {report.customer?.business_address || report.address}
                            
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0',  verticalAlign: 'top' , width: '0.5%'  }}>
                          <Typography lineHeight={1} sx={{ fontSize: `${itemsFontSize + 6}px!important` , fontWeight: '600!important' , marginBottom:'0!important'}}>
                           Phone:
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', padding: '8px 0',  verticalAlign: 'top' }}>
                           <Typography
                          component="span" lineHeight={1}
                          sx={{ textDecoration: 'underline!important' ,fontSize: `${itemsFontSize + 6}px!important` , display: 'inline!important', }}
                        >
                    
                       
                              {report.phone}
                          
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
                <Typography variant="subtitle1" gutterBottom sx={{fontSize: `${itemsFontSize}px!important`}}>Order Items</Typography>
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
                      <TableCell align="right" sx={{fontSize: `${itemsFontSize}px!important`}}>Qty</TableCell>
                      <TableCell align="left" width={'15px'} sx={{fontSize: `${itemsFontSize}px!important`}}>Unit</TableCell>
                      <TableCell align="left" sx={{fontSize: `${itemsFontSize}px!important`}}>Item</TableCell>
                      <TableCell align="right" sx={{ fontSize: `${itemsFontSize}px!important`}}>Price</TableCell>
                      <TableCell align="right" sx={{fontSize: `${itemsFontSize}px!important`}}>Net Price</TableCell>
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
                                fontSize: `${itemsFontSize - 1.5}px!important`,
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
                                <TableRow sx={{py:0.5 , border:'none' }}>
                                  <TableCell align="right" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>{item.quantity}</TableCell>
                                  <TableCell align="left" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>{item.product.attribute?.unit_of_measurement ?? " "}</TableCell>
                                  <TableCell align="left" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>{item.product?.product_name}</TableCell>
                                  <TableCell align="right" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>{formatCurrency(parseFloat(item.sold_price))}</TableCell>
                                  <TableCell align="right" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>{formatCurrency(finalAmount)}</TableCell>
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
                                        <Typography variant="subtitle2" color="primary" sx={{ fontSize: `${itemsFontSize - 1}px!important` }}>
                                          Composition:
                                        </Typography>
                                        <div 
                                          className="composition-content"
                                          dangerouslySetInnerHTML={{ __html: item.composition }}
                                          style={{ 
                                            paddingLeft: '16px',
                                            margin: 0,
                                            fontSize: `${itemsFontSize - 1}px!important`
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
                  <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                   <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline' }}>
                    Delivery Status: 
                    </Typography>
                    {report.is_delivered ? 'Delivered' : 'Pending'}
                  </Typography>
                  <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                    <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline' }}>
                      Encoded By: 
                      </Typography>
                       {report.user?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Grid container spacing={0} sx={{ maxWidth: '400px' }}>
                    <Grid item xs={6}>
                      <Typography align="right" sx={{ fontSize: `${itemsFontSize }px!important` }}>Subtotal:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right" sx={{ fontSize: `${itemsFontSize }px!important` }}>{formatCurrency(subtotal)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right" sx={{ fontSize: `${itemsFontSize }px!important` }}>Delivery Fee:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right" sx={{ fontSize: `${itemsFontSize }px!important` }}>{formatCurrency(deliveryFee)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right" sx={{ fontSize: `${itemsFontSize }px!important` }}>Cutting Charges:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right" sx={{ fontSize: `${itemsFontSize }px!important` }}>{formatCurrency(cuttingCharges)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right" sx={{ fontSize: `${itemsFontSize }px!important` }}>Discount:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right" sx={{ fontSize: `${itemsFontSize }px!important` }}>{formatCurrency(totalDiscount)}</Typography>
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
            <Typography fontWeight="bold" align="right"  sx={{ fontSize: `${itemsFontSize + 4}px!important` }}>
              Total Amount:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography fontWeight="bold" align="right" sx={{ fontSize: `${itemsFontSize + 4}px!important` }}>
              ₱{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Grid>
                  {report.amount_received !== '0.00' && report.amount_received && (
                  <>
                    <Grid item xs={6}>
                      <Typography  align="right" sx={{ fontSize: `${itemsFontSize + 4}px!important` }}>Amount Received:</Typography>
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
                    <Typography  align="right" sx={{ fontSize: `${itemsFontSize + 4}px!important` }}>Change:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography  align="right" sx={{ fontSize: `${itemsFontSize + 4}px!important` }}>₱{parseFloat(report.change).toFixed(2)} {typeof(report.change)}</Typography>
                  </Grid>
               
                </>
            
            )}
             </Grid>
          </Box>
        </Box>

            {/* Additional Information */}
            {report.remarks && (
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>Remarks:</Typography>
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

          <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
  }

export default DeliveryReportView;