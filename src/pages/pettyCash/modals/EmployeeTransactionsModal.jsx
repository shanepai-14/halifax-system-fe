import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
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
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { 
  CloseOutlined, 
  SearchOutlined, 
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined
} from '@ant-design/icons';
import { usePettyCash } from '@/hooks/usePettyCash';
import SettleTransactionModal from './SettleTransactionModal';
import { formatDate } from '@/utils/formatUtils';
import { formatCurrency } from '@/utils/formatUtils';

const EmployeeTransactionsModal = ({ open, onClose, employee }) => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0] // First day of previous month
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0] // Today
  );
  const [statusFilter, setStatusFilter] = useState('all');
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const { 
    transactions, 
    getEmployeeTransactions, 
    approveTransaction, 
    cancelTransaction,
    loading 
  } = usePettyCash();

  useEffect(() => {
    if (open && employee) {
      loadTransactions();
    }
  }, [open, employee]);

  const loadTransactions = async () => {
    if (!employee) return;
    
    try {
      const filters = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        startDate,
        endDate
      };
      await getEmployeeTransactions(employee.id, filters);
    } catch (error) {
      console.error('Error loading employee transactions:', error);
    }
  };

  const handleFilter = () => {
    loadTransactions();
  };

  const handleApprove = async (id) => {
    try {
      await approveTransaction(id);
      loadTransactions();
    } catch (error) {
      console.error('Error approving transaction:', error);
    }
  };

  const handleCancel = async (id) => {
    try {
      const reason = prompt('Please enter a reason for cancellation:');
      if (reason) {
        await cancelTransaction(id, reason);
        loadTransactions();
      }
    } catch (error) {
      console.error('Error cancelling transaction:', error);
    }
  };

  const handleSettleTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setSettleModalOpen(true);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'settled':
        return <Chip label="Settled" color="info" size="small" />;
      case 'issued':
        return <Chip label="Issued" color="primary" size="small" />;
      case 'cancelled':
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Calculate total statistics
  const getTotalIssued = () => {
    return transactions.reduce((sum, tx) => sum + parseFloat(tx.amount_issued || 0), 0);
  };

  const getTotalSpent = () => {
    return transactions.reduce((sum, tx) => sum + parseFloat(tx.amount_spent || 0), 0);
  };

  const getTotalReturned = () => {
    return transactions.reduce((sum, tx) => sum + parseFloat(tx.amount_returned || 0), 0);
  };

  if (!employee) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">{employee.full_name}'s Transactions</Typography>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseOutlined />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  inputProps={{ min: startDate }}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="issued">Issued</MenuItem>
                    <MenuItem value="settled">Settled</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleFilter}
                  startIcon={<FilterOutlined />}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Summary Stats */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="textSecondary">Total Issued</Typography>
                  <Typography variant="h5">{formatCurrency(getTotalIssued())}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="textSecondary">Total Spent</Typography>
                  <Typography variant="h5">{formatCurrency(getTotalSpent())}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="textSecondary">Total Returned</Typography>
                  <Typography variant="h5">{formatCurrency(getTotalReturned())}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Transactions Table */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell align="right">Issued</TableCell>
                  <TableCell align="right">Spent</TableCell>
                  <TableCell align="right">Returned</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No transactions found for this period
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.transaction_reference}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.purpose}</TableCell>
                      <TableCell align="right">{formatCurrency(transaction.amount_issued)}</TableCell>
                      <TableCell align="right">{formatCurrency(transaction.amount_spent || 0)}</TableCell>
                      <TableCell align="right">{formatCurrency(transaction.amount_returned || 0)}</TableCell>
                      <TableCell>{getStatusChip(transaction.status)}</TableCell>
                      <TableCell>
                        {transaction.status === 'issued' && (
                          <Tooltip title="Settle">
                            <IconButton 
                              color="primary" 
                              size="small" 
                              onClick={() => handleSettleTransaction(transaction)}
                            >
                              <EditOutlined />
                            </IconButton>
                          </Tooltip>
                        )}
                        {transaction.status === 'settled' && (
                          <Tooltip title="Approve">
                            <IconButton 
                              color="success" 
                              size="small" 
                              onClick={() => handleApprove(transaction.id)}
                            >
                              <CheckCircleOutlined />
                            </IconButton>
                          </Tooltip>
                        )}
                        {(transaction.status === 'issued' || transaction.status === 'settled') && (
                          <Tooltip title="Cancel">
                            <IconButton 
                              color="error" 
                              size="small" 
                              onClick={() => handleCancel(transaction.id)}
                            >
                              <CloseCircleOutlined />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settle Transaction Modal */}
      <SettleTransactionModal
        open={settleModalOpen}
        onClose={() => {
          setSettleModalOpen(false);
          setSelectedTransaction(null);
        }}
        onSuccess={() => {
          setSettleModalOpen(false);
          setSelectedTransaction(null);
          loadTransactions();
        }}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default EmployeeTransactionsModal;