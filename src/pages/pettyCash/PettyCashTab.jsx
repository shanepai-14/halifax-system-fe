import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment
} from '@mui/material';
import {
  WalletOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  FilterOutlined,
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { usePettyCash } from '@/hooks/usePettyCash';
import { useEmployees } from '@/hooks/useEmployees';
import AddFundModal from './modals/AddFundModal';
import AddTransactionModal from './modals/AddTransactionModal';
import SettleTransactionModal from './modals/SettleTransactionModal';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', { 
    style: 'currency', 
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const PettyCashTab = () => {
  const [subTab, setSubTab] = useState(0);
  const [addFundModalOpen, setAddFundModalOpen] = useState(false);
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [settleTransactionModalOpen, setSettleTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0] // First day of current month
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0] // Today
  );

  // Custom hooks
  const { 
    funds, 
    transactions, 
    balance, 
    getBalance,
    getAllFunds, 
    getAllTransactions, 
    approveFund,
    approveTransaction,
    cancelTransaction,
    loading: pettyCashLoading 
  } = usePettyCash();
  
  const { employees, getAllEmployees, loading: employeesLoading } = useEmployees();

  useEffect(() => {
    loadData();
    getAllEmployees();
  }, [subTab]);

  const loadData = async () => {
    try {
      const filters = {
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        startDate: startDate,
        endDate: endDate,
        employeeId: selectedEmployeeId || undefined
      };

      if (subTab === 0) {
        await getAllTransactions(filters);
      } else {
        await getAllFunds(filters);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const handleChangeSubTab = (event, newValue) => {
    setSubTab(newValue);
  };

  const handleApprove = async (id, type) => {
    try {
      if (type === 'fund') {
        await approveFund(id);
      } else {
        await approveTransaction(id);
      }
      loadData();
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };

  const handleCancel = async (id) => {
    try {
      const reason = prompt('Please enter a reason for cancellation:');
      if (reason) {
        await cancelTransaction(id, reason);
        loadData();
      }
    } catch (error) {
      console.error('Error cancelling transaction:', error);
    }
  };

  const handleSettleTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setSettleTransactionModalOpen(true);
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
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const exportToExcel = () => {
    try {
      const dataToExport = subTab === 0 ? transactions : funds;
      
      // Prepare the data based on which tab is active
      let sheetData = [];
      
      if (subTab === 0) { // Transactions
        // Header row
        sheetData.push([
          'Reference',
          'Date',
          'Employee',
          'Purpose',
          'Issued Amount',
          'Spent Amount',
          'Returned Amount',
          'Status',
        ]);
        
        // Data rows
        dataToExport.forEach(item => {
          sheetData.push([
            item.transaction_reference || '',
            formatDate(item.date) || '',
            item.employee?.full_name || '',
            item.purpose || '',
            item.amount_issued || 0,
            item.amount_spent || 0,
            item.amount_returned || 0,
            item.status || '',
          ]);
        });
      } else { // Funds
        // Header row
        sheetData.push([
          'Reference',
          'Date',
          'Description',
          'Amount',
          'Status',
        ]);
        
        // Data rows
        dataToExport.forEach(item => {
          sheetData.push([
            item.transaction_reference || '',
            formatDate(item.date) || '',
            item.description || '',
            item.amount || 0,
            item.status || '',
          ]);
        });
      }
      
      // Create a worksheet
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      
      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, subTab === 0 ? 'Transactions' : 'Funds');
      
      // Generate filename
      const fileName = `PettyCash_${subTab === 0 ? 'Transactions' : 'Funds'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Write the file and download
      XLSX.writeFile(wb, fileName);
      
      // Show success notification
      toast.success(`${subTab === 0 ? 'Transactions' : 'Funds'} exported successfully`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <Box>
      {/* Summary Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Current Balance
              </Typography>
              <Typography variant="h4">
                {formatCurrency(balance || 0)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlusOutlined />}
                  onClick={() => setAddFundModalOpen(true)}
                  sx={{ mr: 2 }}
                >
                  Add Funds
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PlusOutlined />}
                  onClick={() => setAddTransactionModalOpen(true)}
                >
                  New Transaction
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={subTab} 
            onChange={handleChangeSubTab} 
            aria-label="petty cash sub-tabs"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Transactions" id="petty-cash-subtab-0" />
            <Tab label="Funds" id="petty-cash-subtab-1" />
          </Tabs>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DownloadOutlined />}
          onClick={exportToExcel}
          disabled={pettyCashLoading || (subTab === 0 ? transactions.length === 0 : funds.length === 0)}
        >
          Export to Excel
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
            
              {subTab === 0 && [
                <MenuItem key="issued" value="issued">Issued</MenuItem>,
                <MenuItem key="settled" value="settled">Settled</MenuItem>,
                <MenuItem key="cancelled" value="cancelled">Cancelled</MenuItem>,
              ]}
                {subTab === 1 && (
                  <MenuItem value="rejected">Rejected</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          
          {subTab === 0 && (
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Employee</InputLabel>
            <Select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              label="Employee"
            >
              <MenuItem value="">All Employees</MenuItem>
              {[
                ...employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.full_name}
                  </MenuItem>
                ))
              ]}
            </Select>
          </FormControl>
        </Grid>
      )}
          
          <Grid item xs={6} md={2}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              inputProps={{ min: startDate }}
            />
          </Grid>
          
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSearch}
              startIcon={<FilterOutlined />}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Tables */}
      {subTab === 1 ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pettyCashLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading...</TableCell>
                </TableRow>
              ) : funds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No funds found</TableCell>
                </TableRow>
              ) : (
                funds.map((fund) => (
                  <TableRow key={fund.id}>
                    <TableCell>{fund.transaction_reference}</TableCell>
                    <TableCell>{formatDate(fund.date)}</TableCell>
                    <TableCell>{fund.description}</TableCell>
                    <TableCell align="right">{formatCurrency(fund.amount)}</TableCell>
                    <TableCell>{getStatusChip(fund.status)}</TableCell>
                    <TableCell>{fund.creator?.name || '-'}</TableCell>
                    <TableCell>
                      {fund.status === 'pending' && (
                        <Tooltip title="Approve">
                          <IconButton 
                            color="success" 
                            size="small" 
                            onClick={() => handleApprove(fund.id, 'fund')}
                          >
                            <CheckCircleOutlined />
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
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell align="right">Issued</TableCell>
                <TableCell align="right">Spent</TableCell>
                <TableCell align="right">Returned</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pettyCashLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">Loading...</TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">No transactions found</TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.transaction_reference}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.employee?.full_name || '-'}</TableCell>
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
                            onClick={() => handleApprove(transaction.id, 'transaction')}
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
      )}

      {/* Modals */}
      <AddFundModal
        open={addFundModalOpen}
        onClose={() => setAddFundModalOpen(false)}
        onSuccess={() => {
          setAddFundModalOpen(false);
          loadData();
        }}
      />

      <AddTransactionModal
        open={addTransactionModalOpen}
        onClose={() => setAddTransactionModalOpen(false)}
        onSuccess={() => {
          setAddTransactionModalOpen(false);
          loadData();
          getBalance();
        }}
        employees={employees}
        balance={balance || 0}
      />

      <SettleTransactionModal
        open={settleTransactionModalOpen}
        onClose={() => {
          setSettleTransactionModalOpen(false);
          setSelectedTransaction(null);
        }}
        onSuccess={() => {
          setSettleTransactionModalOpen(false);
          setSelectedTransaction(null);
          loadData();
          getBalance();
        }}
        transaction={selectedTransaction}
      />
    </Box>
  );
};

export default PettyCashTab;