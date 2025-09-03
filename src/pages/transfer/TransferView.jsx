import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Typography, Box, Paper, Grid, Divider, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button ,  Breadcrumbs, Link
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PrinterOutlined, RollbackOutlined, HomeOutlined, DownloadOutlined  } from '@ant-design/icons';
import {
  Home as HomeIcon,
  SwapHoriz as TransferIcon,
Edit as EditIcon,
} from "@mui/icons-material";
import { formatDate } from '@/utils/formatUtils';
import api from '@/lib/axios';


const TransferView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef();
  const [transfer, setTransfer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  
  const [itemsFontSize, setItemsFontSize] = useState(() => {
    const saved = localStorage.getItem('transferView_fontSize');
    return saved ? parseInt(saved) : 12;
  });

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
    onBeforePrint: async () => {
      document.body.style.zoom = "1";
      document.body.style.transform = "scale(1)";
    },
    onAfterPrint: () => {
      document.body.style.zoom = "";
      document.body.style.transform = "";
    }
  });


 

  useEffect(() => {
    localStorage.setItem('transferView_fontSize', itemsFontSize.toString());
  }, [itemsFontSize]);

  // Load transfer data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if transfer data was passed via navigation state
        if (location.state?.transferData) {
          setTransfer(location.state.transferData);
          setIsLoading(false);
          return;
        }
        
        // Otherwise fetch the data using the ID
        if (id) {
          const response = await api.get(`/transfers/${id}`);
        if (response.data.success) {
          setTransfer(response.data.data);
        }

        }
      } catch (error) {
        console.error('Error loading transfer data:', error);
        // Handle error - maybe show error message or redirect
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, location.state]);

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Loading transfer data...</Typography>
      </Box>
    );
  }

  const courierTheme = createTheme({
    typography: {
      fontFamily: '"Courier New", "Courier", "Liberation Mono", monospace',
      fontSize: 12,
      fontWeightRegular: 400,
      fontWeightMedium: 400,
      fontWeightBold: 400,
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

  // Currency formatting for consistent alignment
  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
    if (!transfer) return '';

    // Build the text content
    let content = '';
    
    // Header
    content += '                                  TRANSFER REPORT\n';
    content += `                                   ${transfer.transfer_number}\n\n`;
    
    // Company info and transfer details
    content += 'Halifax Glass & Aluminum Supply          ';
    content += `            Transfer Date: ${formatDate(transfer.created_at)}\n`;
    content += 'Malagamot Road, Panacan                 ';
    content += `             Delivery Date: ${transfer.delivery_date ? formatDate(transfer.delivery_date) : 'Not set'}\n`;
    content += 'glasshalifax@gmail.com                   ';
    content += `               \n`;
    content += '0939 924 3876                            ';
    content += `\n\n`;
    
    // Transfer info
    content += `Destination Warehouse: ${transfer.warehouse?.name}\n`;
    content += `Location: ${transfer.warehouse?.location || 'Not specified'}\n`;
    content += `Created By: ${transfer.creator?.name}\n`;
    
    content += '_____________________________________________________________________________________\n';
    content += ' Qty Unit Product                                     Cost                Total Cost\n';
    content += '_____________________________________________________________________________________\n';
    
    // Add transfer items
    transfer.items?.forEach((item) => {
      const qty = padLeft(item.quantity.toString(), 4);
      const unit = padRight(item.product?.attribute?.unit_of_measurement || '', 5);
      const productName = padRight(item.product?.product_name || '', 40);
      const unitCost = padLeft(formatCurrency(parseFloat(item.unit_cost)), 10);
      const totalCost = padLeft(formatCurrency(parseFloat(item.total_cost)), 10);
      
      content += `${qty} ${unit} ${productName} ${unitCost}            ${totalCost}\n`;
      
      // Add notes if exists
      if (item.notes && item.notes !== 'No notes') {
        content += `    Notes: ${item.notes}\n`;
      }
    });
    
    content += '_____________________________________________________________________________________\n\n';
    
    // Total and notes section
    const createdByText = `Created By: ${transfer.creator?.name}`;
    const createdByLength = createdByText.length;
    
    const totalLine = `${padLeft('Total Value:', 57)} ${padLeft(formatCurrency(transfer.total_value), 5)}`;
    const spacingNeeded = 85 - createdByLength;
    const rightAlignedTotal = padLeft(totalLine, spacingNeeded);

    content += `${createdByText}${rightAlignedTotal}\n`;
    content += '\n';
    
    // Notes
    if (transfer.notes) {
      content += `Notes: ${transfer.notes}\n\n`;
    }

    const contentLines = content.split('\n').length;
    const targetPageLines = 66;
    const signatureLines = 12;
    const footerLines = 2;
    const totalFooterLines = signatureLines + footerLines;
    const availableLines = targetPageLines - totalFooterLines;

    // Add blank lines to push signatures to bottom
    const linesToAdd = Math.max(0, availableLines - contentLines);
    content += '\n'.repeat(linesToAdd);
    
    // Signature section
    content += '\n\n\n';
    content += '     _________________            _________________            _________________\n';
    content += '        Prepared By                   Checked By                  Released By\n\n\n\n';
    content += '                   _________________             _________________ \n';
    content += '                     Delivered By                  Received By\n\n';
    
    return content;
  };

  const handleEdit = (id) => {
   if(id){
     navigate(`/app/transfers/edit/${id}`)
   }
  }

  // Download text file function
  const handleDownloadText = () => {
    const textContent = generateTextContent();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transfer_report_${transfer.transfer_number}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print handler

  // Status chip renderer
  const renderStatusChip = (status) => {
    const statusColors = {
      'in_transit': { backgroundColor: '#fff3cd', color: '#856404' },
      'completed': { backgroundColor: '#d4edda', color: '#155724' },
      'cancelled': { backgroundColor: '#f8d7da', color: '#721c24' }
    };

    const colors = statusColors[status] || statusColors['in_transit'];

    return (
      <Box
        sx={{
          display: 'inline-block',
          px: 2,
          py: 0.5,
          borderRadius: 1,
          fontSize: '0.875rem',
          fontWeight: 'medium',
          ...colors
        }}
      >
        {status.replace('_', ' ').toUpperCase()}
      </Box>
    );
  };

  if (!transfer) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">No transfer data available</Typography>
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

  return (
    <>
      <Breadcrumbs sx={{ mb: 2 }}>
            <Link
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => navigate("/app/dashboard")}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
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
          </Breadcrumbs>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Transfer Report Details</Typography>

          <Box className="no-print">
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
              startIcon={<DownloadOutlined />}
              onClick={handleDownloadText}
              sx={{ mr: 1 }}
            >
              Download Text
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<EditIcon />}
              onClick={ ()=> handleEdit(id)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RollbackOutlined />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
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
            {/* Company Header */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={12}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h4" sx={{ fontSize: `${itemsFontSize + 6}px!important` }}>TRANSFER REPORT</Typography>
                  <Typography variant="h6" sx={{ fontSize: `${itemsFontSize + 2}px!important` }}>{transfer.transfer_number}</Typography>
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
                      Transfer Date:
                    </Typography>{' '}
                    {formatDate(transfer.created_at)}
                  </Typography>
                  <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                    <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline!important' }}>
                      Delivery Date:
                    </Typography>{' '}
                    {transfer.delivery_date ? formatDate(transfer.delivery_date) : 'Not set'}
                  </Typography>



                </Box>
              </Grid>
            </Grid>

            {/* Transfer Info */}
            <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
              <Grid item xs={12} md={12}>
                <Box sx={{ mb: 0.5 }}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0', verticalAlign: 'bottom', width: '25%'}}>
                          <Typography lineHeight={1} sx={{ fontSize: `${itemsFontSize + 6}px!important` , fontWeight: '600!important' , marginBottom:'0!important'}}>
                            Destination Warehouse:
                          </Typography>
                        </TableCell>
                        <TableCell colSpan={3} sx={{ border: 'none', padding: '8px 16px 8px 0', verticalAlign: 'bottom' }}>
                          <Typography
                            component="span" lineHeight={1}
                            sx={{ textDecoration: 'underline!important' ,fontSize: `${itemsFontSize + 6}px!important` , display: 'inline!important', }}
                          >
                            {transfer.warehouse?.name}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0', width: '25%' ,verticalAlign: 'top' }}>
                          <Typography lineHeight={1} sx={{ fontSize: `${itemsFontSize + 6}px!important` ,fontWeight: '600!important' }}>
                            Location:
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 'none', padding: '8px 8px 8px 0', verticalAlign: 'top' }}>
                          <Typography
                            component="span" lineHeight={1}
                            sx={{ textDecoration: 'underline!important' ,fontSize: `${itemsFontSize + 6}px!important` , display: 'inline!important', }}
                          >
                            {transfer.warehouse?.location || 'Not specified'}
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
              <Typography variant="subtitle1" gutterBottom sx={{fontSize: `${itemsFontSize}px!important`}}>Transfer Items</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right" sx={{fontSize: `${itemsFontSize}px!important`}}>Qty</TableCell>
                      <TableCell align="left" width={'15px'} sx={{fontSize: `${itemsFontSize}px!important`}}>Unit</TableCell>
                      <TableCell align="left" sx={{fontSize: `${itemsFontSize}px!important`}}>Product</TableCell>
                      <TableCell align="right" sx={{ fontSize: `${itemsFontSize}px!important`}}>Unit Cost</TableCell>
                      <TableCell align="right" sx={{fontSize: `${itemsFontSize}px!important`}}>Total Cost</TableCell>
                      <TableCell align="left" sx={{fontSize: `${itemsFontSize}px!important`}}>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transfer.items?.map((item) => (
                      <TableRow key={item.id} sx={{py:0.5 , border:'none' }}>
                        <TableCell align="right" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>
                          {parseInt(item.quantity)}
                        </TableCell>
                        <TableCell align="left" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>
                          {item.product?.attribute?.unit_of_measurement || ''}
                        </TableCell>
                        <TableCell align="left" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>
                          <Typography variant="body2" fontWeight="medium" sx={{ fontSize: `${itemsFontSize}px!important` }}>
                            {item.product?.product_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ fontSize: `${itemsFontSize - 2}px!important` }}>
                            {item.product?.product_code}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>
                          {formatCurrency(parseFloat(item.unit_cost))}
                        </TableCell>
                        <TableCell align="right" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>
                          {formatCurrency(parseFloat(item.total_cost))}
                        </TableCell>
                        <TableCell align="left" sx={{py:0.5 , border:'none', fontSize: `${itemsFontSize}px!important`}}>
                          <Typography variant="caption" color="textSecondary" sx={{ fontSize: `${itemsFontSize - 1}px!important` }}>
                            {item.notes || 'No notes'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection:'column', justifyContent: 'flex-start' }}>
                  {/* <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                    <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline' }}>
                      Total Items: 
                    </Typography>
                    {transfer.items?.length || 0} items
                  </Typography>
                  <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                    <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline' }}>
                      Total Quantity: 
                    </Typography>
                    {transfer.items?.reduce((sum, item) => sum + parseInt(item.quantity), 0) || 0}
                  </Typography> */}
                  <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                    <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline' }}>
                      Created By: 
                    </Typography>
                    {transfer.creator?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Grid container spacing={0} sx={{ maxWidth: '400px' }}>
                    <Grid item xs={6}>
                      <Typography fontWeight="bold" align="right" sx={{ fontSize: `${itemsFontSize + 4}px!important` }}>
                        Total:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography fontWeight="bold" align="right" sx={{ fontSize: `${itemsFontSize + 4}px!important` }}>
                        {formatCurrency(transfer.total_value)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              {/* Additional Information */}
              {transfer.notes && (
                <Box sx={{ mt: 3 }}>
                  <Typography sx={{ fontSize: `${itemsFontSize}px!important` }}>
                    <Typography component="strong" sx={{ fontSize: `${itemsFontSize}px!important` ,fontWeight: 'bold!important', display: 'inline' }}>
                      Notes:
                    </Typography>
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: `${itemsFontSize}px!important`, mt: 1 }}>
                    {transfer.notes}
                  </Typography>
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
            </Box>
          </Box>
        </ThemeProvider>
      </Paper>
    </>
  );
};

export default TransferView;