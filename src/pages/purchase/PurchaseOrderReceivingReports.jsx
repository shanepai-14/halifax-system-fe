import React, { useState, useRef} from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Switch,
  Tooltip,
  FormControlLabel 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import PurchaseOrderReceivedItems from './PurchaseOrderReceivedItems';
import PurchaseOrderAdditionalCosts from './PurchaseOrderAdditionalCosts';
import MultipleFileUploader from './MultipleFileUploader';
import PrintIcon from '@mui/icons-material/Print';
import PrintableRR from '../receiving/PrintableRR';
import { useReactToPrint } from 'react-to-print';
/**
 * Component to display a list of receiving reports for a purchase order
 * @param {Object} props
 * @param {Array} props.receivingReports - Array of receiving report objects
 * @param {Array} props.products - Array of product objects
 * @param {Array} props.attributes - Array of attribute objects
 * @param {String} props.status - Current status of the purchase order
 * @param {String} props.poId - Purchase order ID
 * @param {String} props.poNumber - Purchase order number
 * @param {Function} props.onCreateReceivingReport - Callback when a new receiving report is created
 * @param {Function} props.onUpdateReceivingReport - Callback when a receiving report is updated
 */
const PurchaseOrderReceivingReports = ({ 
  receivingReports = [], 
  products = [],
  attributes = [],
  costTypes =[],
  status,
  poId,
  poNumber,
  onCreateReceivingReport,
  onUpdateReceivingReport
}) => {
  const contentRef = useRef();
  const [expanded, setExpanded] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [errors, setErrors] = useState({});
  const [reportData, setReportData] = useState({
    invoice: '',
    term: 0,
    is_paid: false,
    received_items: [
      {
        product_id: '',
        attribute_id: '',
        received_quantity: 0,
        cost_price: 0,
        distribution_price:0,
        walk_in_price: 0,
        term_price: 0,
        wholesale_price: 0,
        regular_price: 0,
        remarks: '',
      }
    ],
    additional_costs: [],
    attachments: []
  });
  

    const handlePrint = useReactToPrint({
      contentRef
    });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const openNewReportDialog = () => {
    setReportData({
      invoice: '',
      term: 0,
      is_paid: false,
      received_items: [
        {
          product_id: '',
          attribute_id: '',
          received_quantity: 0,
          cost_price: 0,
          distribution_price:0,
          walk_in_price: 0,
          term_price: 0,
          wholesale_price: 0,
          regular_price: 0,
          remarks: ''
        }
      ],
      additional_costs: [],
      attachments: []
    });
    setErrors({});
    setIsEditing(false);
    setSelectedReportId(null);
    setReportDialog(true);
  };

  const openEditReportDialog = (report) => {
    setReportData({
      invoice: report.invoice || '',
      term: report.term || 0,
      is_paid: report.is_paid || false,
      received_items: report.received_items ? [...report.received_items] : [],
      additional_costs: report.additional_costs ? [...report.additional_costs] : [],
      attachments: report.attachments || []
    });
    setErrors({});
    setIsEditing(true);
    setSelectedReportId(report.rr_id);
    setReportDialog(true);
  };

  const handleCostChange = (index, field, value) => {
    const updatedCosts = [...reportData.additional_costs];
    updatedCosts[index] = {
      ...updatedCosts[index],
      [field]: value
    };

    setReportData(prev => ({
      ...prev,
      additional_costs: updatedCosts
    }));
    
    // Clear error for this field if it exists
    if (errors[`additional_costs.${index}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`additional_costs.${index}.${field}`];
        return newErrors;
      });
    }
  };

  const handleFilesChange = (files, reportId, action = 'append') => {
    if (isEditing) {
      // If we're editing, update the reportData attachments
      if (action === 'append') {
        setReportData(prev => {
          // Filter out any duplicates before appending
          const newFiles = files.filter(newFile => 
            !prev.attachments.some(prevFile => prevFile.id === newFile.id)
          );
          return {
            ...prev,
            attachments: [...(prev.attachments || []), ...newFiles]
          };
        });
      } else {
        setReportData(prev => ({
          ...prev,
          attachments: files
        }));
      }
    } else {
      // For new reports, just store the files in reportData
      setReportData(prev => ({
        ...prev,
        attachments: action === 'append' 
          ? [...(prev.attachments || []), ...files] 
          : files
      }));
    }
  };

  const calculateAdditionalCosts = () => {
    return reportData.additional_costs.reduce((sum, cost) => 
      sum + (Number(cost.amount) || 0), 0
    );
  };
  
  const handleAddCost = () => {
    const newCost = {
      cost_type_id: '',
      amount: 0,
      remarks: ''
    };
    
    setReportData(prev => ({
      ...prev,
      additional_costs: [...prev.additional_costs, newCost]
    }));
  };
  
  const handleRemoveCost = (index) => {
    const updatedCosts = reportData.additional_costs.filter((_, i) => i !== index);
    setReportData(prev => ({
      ...prev,
      additional_costs: updatedCosts
    }));
  };
  
  const handleCloseDialog = () => {
    setReportDialog(false);
  };
  
  const handleReportDataChange = (field, value) => {
    setReportData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleItemChange = (index, field, value) => {

    if(field == 'distribution_price'){
      console.log('distribution_price' , value);
    }
    const updatedItems = [...reportData.received_items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    setReportData(prev => ({
      ...prev,
      received_items: updatedItems
    }));
    
    // Clear error for this field if it exists
    if (errors[`received_items.${index}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`received_items.${index}.${field}`];
        return newErrors;
      });
    }
  };
  
  const handleAddItem = () => {
    const newItem = {
      product_id: '',
      attribute_id: '',
      received_quantity: 0,
      cost_price: 0,
      distribution_price :0,
      walk_in_price: 0,
      term_price: 0,
      wholesale_price: 0,
      regular_price: 0,
      remarks: ''
    };
    
    setReportData(prev => ({
      ...prev,
      received_items: [...prev.received_items, newItem]
    }));
  };
  
  const handleRemoveItem = (index) => {
    if (reportData.received_items.length > 1) {
      const updatedItems = reportData.received_items.filter((_, i) => i !== index);
      setReportData(prev => ({
        ...prev,
        received_items: updatedItems
      }));
    }
  };
  
  const validateReport = () => {
    const newErrors = {};
    
    // Validate received items
    reportData.received_items.forEach((item, index) => {
      if (!item.product_id) {
        newErrors[`received_items.${index}.product_id`] = 'Product is required';
      }
      
      if (!item.received_quantity || Number(item.received_quantity) <= 0) {
        newErrors[`received_items.${index}.received_quantity`] = 'Received quantity must be greater than 0';
      }
      
      // Validate all price fields
      const priceFields = {
        cost_price: 'Cost price',
        walk_in_price: 'Walk-in price',
        wholesale_price: 'Wholesale price',
        regular_price: 'Regular price'
      };
      
      Object.entries(priceFields).forEach(([field, label]) => {
        if (!item[field] || Number(item[field]) <= 0) {
          newErrors[`received_items.${index}.${field}`] = `${label} must be greater than 0`;
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveReceivingReport = async () => {
    if (!validateReport()) {
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Prepare data for API
      const dataToSave = {
        po_id: poId,
        invoice: reportData.invoice,
        term: reportData.term,
        is_paid: reportData.is_paid,
        received_items: reportData.received_items,
        additional_costs: reportData.additional_costs,
      };
      
      if (isEditing) {
        await onUpdateReceivingReport(selectedReportId, dataToSave);
      } else {
        // Create new report
        await onCreateReceivingReport(dataToSave);
      }
      
      setReportDialog(false);
      setIsProcessing(false);
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} receiving report:`, error);
      setIsProcessing(false);
      
      // Handle API errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  // Calculate total of received items for a receiving report
  const calculateReceivedTotal = (receivedItems) => {
    return receivedItems.reduce((sum, item) => 
      sum + (item.cost_price * item.received_quantity), 0);
  };

  // Calculate total of additional costs for a receiving report
  const calculateAdditionalCostsTotal = (additionalCosts) => {
    return additionalCosts.reduce((sum, cost) => 
      sum + (Number(cost.amount) || 0), 0);
  };

  // Calculate grand total for a receiving report
  const calculateGrandTotal = (receivingReport) => {
    const itemsTotal = calculateReceivedTotal(receivingReport.received_items || []);
    const costsTotal = calculateAdditionalCostsTotal(receivingReport.additional_costs || []);
    return itemsTotal + costsTotal;
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Check if creating or updating receiving reports is allowed
  const canCreateNewReport = status === 'partially_received' && onCreateReceivingReport;
  const canUpdateReport = (status === 'partially_received' || status === 'completed') && onUpdateReceivingReport;
  
  // Render the receiving report dialog (for both create and edit)
  const renderReportDialog = () => (
    <Dialog
      open={reportDialog}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        {isEditing ? `Edit Receiving Report for ${poNumber}` : `Create New Receiving Report for PO ${poNumber}`}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Invoice Number"
                fullWidth
                value={reportData.invoice}
                onChange={(e) =>
                  handleReportDataChange("invoice", e.target.value)
                }
                helperText={"Optional"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Payment Terms (days)"
                type="number"
                fullWidth
                value={reportData.term}
                onChange={(e) => handleReportDataChange("term", e.target.value)}
                inputProps={{
                  min: 0,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={reportData.is_paid}
                    onChange={(e) => handleReportDataChange("is_paid", e.target.checked)}
                    color="primary"
                  />
                }
                label="Mark as Paid"
              />
            </Grid>
            <Grid item xs={12}>
              <MultipleFileUploader
                referenceNumber={selectedReportId || "temp"}
                uploadedFiles={reportData.attachments || []}
                onFilesChange={(files, action) => handleFilesChange(files, selectedReportId, action)}
                modelType="receiving-reports"
              />
            </Grid>
          </Grid>
        </Box>

        <PurchaseOrderReceivedItems
          products={products}
          attributes={attributes}
          receivedItems={reportData.received_items}
          onItemChange={handleItemChange}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          errors={errors}
          disabled={false}
          status={status}
          totalAdditonalCost={calculateAdditionalCosts()} 
        />
        <PurchaseOrderAdditionalCosts
          costTypes={costTypes}
          additionalCosts={reportData.additional_costs}
          onCostChange={handleCostChange}
          onAddCost={handleAddCost}
          onRemoveCost={handleRemoveCost}
          errors={errors}
          disabled={false}
          status="partially_received"
          showTotals={true}
          calculateTotalCosts={calculateAdditionalCosts}
          onAddCostType={() => setOpenCostTypeModal(true)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          onClick={handleSaveReceivingReport}
          variant="contained"
          color="primary"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEditing ? "Update Receiving Report" : "Create Receiving Report"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (!receivingReports || receivingReports.length === 0) {
    return (
      <Box sx={{ mt: 4, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Receiving Reports</Typography>
          {canCreateNewReport && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddCircleOutlineIcon />}
              onClick={openNewReportDialog}
            >
              New Receiving Report
            </Button>
          )}
        </Box>
        <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No receiving reports available
          </Typography>
        </Paper>
        
        {/* Receiving Report Dialog */}
        {reportDialog && renderReportDialog()}
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Receiving Reports ({receivingReports.length})
        </Typography>
        {canCreateNewReport && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddCircleOutlineIcon />}
            onClick={openNewReportDialog}
          >
            New Receiving Report
          </Button>
        )}
      </Box>
      
      {receivingReports.map((report, index) => (
        <Accordion 
          key={report.rr_id || index}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.06)' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ mr: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Batch #{report.batch_number}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {report.invoice && (
                  <Chip 
                    label={`Invoice: ${report.invoice}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                )}
                <Chip 
                  label={`Received: ${formatDate(report.created_at)}`} 
                  size="small" 
                  sx={{ backgroundColor: 'primary.light', color: 'white' }}
                />
                  {report.is_paid ? (
                  <Chip 
                    label="PAID" 
                    size="small" 
                    color="success"
                  />
                ) : (
                  <Chip 
                    label="UNPAID" 
                    size="small" 
                    color="error"
                  />
                )}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  ₱{calculateGrandTotal(report).toFixed(2)}
                </Typography>
                
                {canUpdateReport && (
                  <IconButton 
                    color="primary" 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditReportDialog(report);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                 <Tooltip title="Print Receiving Report">
                      <IconButton 
                      size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                          setTimeout(handlePrint, 100);
                        }}
                      >
                        <PrintIcon  />
                      </IconButton>
                    </Tooltip>
              </Box>
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: 0 }}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                    Report Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Batch Number:</strong> {report.batch_number}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Invoice:</strong> {report.invoice || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Payment Terms:</strong> {report.term || 0} days
                    </Typography>
                    <Typography variant="body2">
                      <strong>Received Date:</strong> {formatDate(report.created_at)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Payment Status:</strong> {report.is_paid ? 'Paid' : 'Unpaid'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* FileUploader for viewing existing attachments */}
                  <MultipleFileUploader
                    referenceNumber={report.rr_id}
                    uploadedFiles={report.attachments || []}
                    onFilesChange={(files, action) => {
                      // This is for display only in the expanded view, changes here won't affect the report until saved
                      // We'll handle this in the backend
                    }}
                    modelType="receiving-reports"
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* Use the existing PurchaseOrderReceivedItems component */}
                  <PurchaseOrderReceivedItems
                    products={products}
                    attributes={attributes}
                    receivedItems={report.received_items || []}
                    onItemChange={() => {}} // Read-only, so empty function
                    onAddItem={() => {}}    // Read-only, so empty function
                    onRemoveItem={() => {}} // Read-only, so empty function
                    errors={{}}
                    disabled={true}        // Always disabled in view mode
                    status="completed"
                      // Force read-only view
                  />

                  <PurchaseOrderAdditionalCosts 
                    costTypes={costTypes}
                    additionalCosts={report.additional_costs || []} // Use the data from the report
                    onCostChange={() => {}} // Empty function since it's read-only
                    onAddCost={() => {}}    // Empty function since it's read-only
                    onRemoveCost={() => {}} // Empty function since it's read-only
                    errors={{}}             // No errors in read-only mode
                    disabled={true}         // Set to true to make it read-only
                    status="completed"      // Force read-only status
                    showTotals={true}
                    calculateTotalCosts={() => 
                        (report.additional_costs || []).reduce((sum, cost) => 
                        sum + (Number(cost.amount) || 0), 0)
                    }
                    // No onAddCostType since it's read-only
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                    <Box>
                      {canUpdateReport && (
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => openEditReportDialog(report)}
                        >
                          Edit Report
                        </Button>
                      )}
                    </Box>
                    <Typography variant="h6">
                      Grand Total: ₱{calculateGrandTotal(report).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      
      {/* Receiving Report Dialog (used for both create and edit) */}
      {reportDialog && renderReportDialog()}
      <PrintableRR receivingReport={selectedReport} contentRef={contentRef}/>
    </Box>
  );
};

export default PurchaseOrderReceivingReports;