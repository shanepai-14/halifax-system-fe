import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  IconButton,
  Button,
  Paper,
  Chip,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  CircularProgress,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBackOutlined,
  Edit as EditIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  MoneyOff as MoneyOffIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useReactToPrint } from 'react-to-print';
import { 
  useReceivingReport, 
  useUpdatePaymentStatus,
  usePrintReceivingReport 
} from './useReceivingReports';
import PrintableReceivingReport from './PrintableReceivingReport';

// Skeleton loader component
const LoadingSkeleton = () => (
  <Box>
    <Skeleton variant="rectangular" width={40} height={40} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={60} sx={{ mb: 4 }} />
    <Skeleton variant="text" sx={{ fontSize: "2rem", mb: 2 }} />
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Skeleton variant="text" sx={{ fontSize: "1.2rem", mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: "1.2rem", mb: 2 }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton variant="text" sx={{ fontSize: "1.2rem", mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: "1.2rem", mb: 2 }} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={300} />
      </Grid>
    </Grid>
  </Box>
);

const ReceivingReportDetail = () => {
  const { batchNumber } = useParams();
  const navigate = useNavigate();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const contentRef = useRef();

  // Fetch receiving report data
  const { data: receivingReport, isLoading, refetch } = useReceivingReport(batchNumber);
  
  // Mutations
  const updatePaymentStatus = useUpdatePaymentStatus();
  const printReport = usePrintReceivingReport();

  // Handle print
  const handlePrint = useReactToPrint({
    contentRef,
  });

  // Calculate totals
  const calculateItemsTotal = (items = []) => {
    return items.reduce((sum, item) => 
      sum + (item.cost_price * item.received_quantity), 0
    );
  };

  const calculateCostsTotal = (costs = []) => {
    return costs.reduce((sum, cost) => 
      sum + (Number(cost.amount) || 0), 0
    );
  };

  const calculateGrandTotal = () => {
    if (!receivingReport) return 0;
    const itemsTotal = calculateItemsTotal(receivingReport.received_items);
    const costsTotal = calculateCostsTotal(receivingReport.additional_costs);
    return itemsTotal + costsTotal;
  };

  // Handle payment status toggle
  const togglePaymentStatus = () => {
    const newStatus = receivingReport.status === 'paid' ? 'unpaid' : 'paid';
    setConfirmDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    try {
      await updatePaymentStatus.mutateAsync({
        rrID: receivingReport.rr_id,
        isPaid: receivingReport.status !== 'paid'
      });
      setConfirmDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating payment status:', error);
      setConfirmDialogOpen(false);
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (!receivingReport) return <Alert severity="error">Receiving report not found</Alert>;

  const statusColors = {
    paid: 'success',
    unpaid: 'warning'
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 0, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/app/receiving-reports')}>
            <ArrowBackOutlined />
          </IconButton>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon />
            Receiving Report: {receivingReport.batch_number}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color={receivingReport.status === 'paid' ? 'error' : 'success'}
            startIcon={receivingReport.status === 'paid' ? <MoneyOffIcon /> : <AttachMoneyIcon />}
            onClick={togglePaymentStatus}
            disabled={updatePaymentStatus.isPending}
          >
            {updatePaymentStatus.isPending ? (
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
            ) : null}
            Mark as {receivingReport.status === 'paid' ? 'Unpaid' : 'Paid'}
          </Button>
          <Tooltip title="Print Receiving Report">
            <IconButton onClick={handlePrint} color="primary">
              <PrintIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main content */}
      <Grid container spacing={3}>
        {/* Top info cards */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Purchase Order</Typography>
                <Typography variant="h6">{receivingReport.po_number}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Date Received</Typography>
                <Typography variant="h6">{format(new Date(receivingReport.created_at), 'MMMM dd, yyyy')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Supplier</Typography>
                <Typography variant="h6">{receivingReport.supplier?.supplier_name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  icon={receivingReport.status === 'paid' ? <AttachMoneyIcon /> : <MoneyOffIcon />}
                  label={receivingReport.status.toUpperCase()} 
                  color={statusColors[receivingReport.status]}
                  size="small"
                />
              </Grid>
              {receivingReport.invoice && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Invoice</Typography>
                  <Typography variant="h6">{receivingReport.invoice}</Typography>
                </Grid>
              )}
              {receivingReport.term > 0 && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Payment Terms</Typography>
                  <Typography variant="h6">{receivingReport.term} days</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Summary card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Summary</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Items Total:</Typography>
              <Typography variant="body1">₱{calculateItemsTotal(receivingReport.received_items).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Additional Costs:</Typography>
              <Typography variant="body1">₱{calculateCostsTotal(receivingReport.additional_costs).toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Grand Total:</Typography>
              <Typography variant="h6">₱{calculateGrandTotal().toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Received Items Table */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ mb: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 2, backgroundColor: 'primary.light' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Received Items</Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Cost Price</TableCell>
                    <TableCell>Walk-in Price</TableCell>
                    <TableCell>Wholesale Price</TableCell>
                    <TableCell>Regular Price</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {receivingReport.received_items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product?.product_name}</TableCell>
                      <TableCell>{item.received_quantity}</TableCell>
                      <TableCell>{item.attribute?.unit_of_measurement}</TableCell>
                      <TableCell>₱{Number(item.cost_price).toFixed(2)}</TableCell>
                      <TableCell>₱{Number(item.walk_in_price).toFixed(2)}</TableCell>
                      <TableCell>₱{Number(item.wholesale_price).toFixed(2)}</TableCell>
                      <TableCell>₱{Number(item.regular_price).toFixed(2)}</TableCell>
                      <TableCell>
                        ₱{(item.cost_price * item.received_quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {receivingReport.received_items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          No items in this receiving report
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Additional Costs Table */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ mb: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 2, backgroundColor: 'primary.light' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>Additional Costs</Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cost Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {receivingReport.additional_costs.map((cost, index) => (
                    <TableRow key={index}>
                      <TableCell>{cost.cost_type?.name}</TableCell>
                      <TableCell>₱{Number(cost.amount).toFixed(2)}</TableCell>
                      <TableCell>{cost.remarks || '—'}</TableCell>
                    </TableRow>
                  ))}
                  {(!receivingReport.additional_costs || receivingReport.additional_costs.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          No additional costs for this receiving report
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Attachments section could be added here */}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>
          {receivingReport.status === 'paid' ? 'Mark as Unpaid?' : 'Mark as Paid?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {receivingReport.status === 'paid'
              ? 'Are you sure you want to mark this receiving report as unpaid?'
              : 'Are you sure you want to mark this receiving report as paid?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmToggleStatus} 
            color={receivingReport.status === 'paid' ? 'error' : 'success'}
            variant="contained"
            autoFocus
          >
            {updatePaymentStatus.isPending ? (
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
            ) : null}
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden print component */}
      <PrintableReceivingReport receivingReport={receivingReport} contentRef={contentRef} />
    </Container>
  );
};

export default ReceivingReportDetail;