import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Box,
  Chip,
  Tooltip,
  Skeleton,
  MenuItem,
} from '@mui/material';
import {
  EyeOutlined,
  SearchOutlined,
  ClearOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import PrintIcon from '@mui/icons-material/Print';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// Placeholder for actual API hooks
// In production, replace with actual API hooks
const useReceivingReports = (filters) => {
  // This is a mock implementation. Replace with actual API call.
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock data for demonstration
      const mockData = Array.from({ length: 25 }, (_, i) => ({
        rr_id: `RR${1000 + i}`,
        batch_number: `B${2000 + i}`,
        po_number: `PO${3000 + Math.floor(i / 3)}`,
        status: i % 3 === 0 ? 'paid' : 'unpaid',
        invoice: i % 2 === 0 ? `INV-${4000 + i}` : null,
        created_at: new Date(2025, 0, i + 1).toISOString(),
        total_amount: Math.round((5000 + i * 500 + Math.random() * 1000) * 100) / 100,
        supplier_name: `Supplier ${i % 5 + 1}`
      }));
      
      setData(mockData);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [filters]);

  return { data, isLoading };
};

// Skeleton loader component for table rows
const TableRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell align="right">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
      </Box>
    </TableCell>
  </TableRow>
);

const statusColors = {
  paid: 'success',
  unpaid: 'warning'
};

const ReceivingReportsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPO, setSelectedPO] = useState('All POs');
  const [dateFilter, setDateFilter] = useState('');
  const [filters, setFilters] = useState({});

  // Get receiving reports data
  const { data: receivingReports = [], isLoading } = useReceivingReports(filters);

  // Get unique suppliers and POs from receiving reports for filters
  const suppliers = ['All Suppliers', ...new Set(receivingReports.map(rr => rr.supplier_name))]
    .filter(Boolean);
  
  const purchaseOrders = ['All POs', ...new Set(receivingReports.map(rr => rr.po_number))]
    .filter(Boolean);

  // Filter the data based on search and selected filters
  const filteredData = receivingReports.filter(rr => {
    const matchesSearch = (rr.batch_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rr.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rr.invoice?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rr.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSupplier = selectedSupplier === 'All Suppliers' || 
      rr.supplier_name === selectedSupplier;
  
    const matchesStatus = selectedStatus === 'All Status' ||
      rr.status === selectedStatus.toLowerCase();
      
    const matchesPO = selectedPO === 'All POs' ||
      rr.po_number === selectedPO;
      
    const matchesDate = !dateFilter || 
      (rr.created_at && format(new Date(rr.created_at), 'yyyy-MM-dd') === dateFilter);
  
    return matchesSearch && matchesSupplier && matchesStatus && matchesPO && matchesDate;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setSelectedSupplier('All Suppliers');
    setSelectedStatus('All Status');
    setSelectedPO('All POs');
    setDateFilter('');
    setFilters({});
  };

  const handlePrint = (rr) => {
    // Implement print functionality for receiving report
    console.log('Print receiving report:', rr);
  };

  const handleViewDetails = (batchNumber) => {
    // Navigate to receiving report details page
    navigate(`/app/receiving-reports/${batchNumber}`);
  };

  const handleExportToExcel = () => {
    // Implement export to Excel functionality
    console.log('Export data to Excel');
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, px: '0!important' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon color="primary" />
          Receiving Reports
        </Typography>
        
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<FileExcelOutlined />}
          onClick={handleExportToExcel}
          sx={{ ml: 'auto' }}
        >
          Export to Excel
        </Button>
      </Box>

      {/* Filters section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Search batch #, PO #, invoice"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250, flexGrow: 1 }}
        />
        
        <TextField
          select
          size="small"
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          label="Supplier"
          sx={{ minWidth: 200 }}
        >
          {suppliers.map((supplier) => (
            <MenuItem key={supplier} value={supplier}>
              {supplier}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          select
          size="small"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          label="Payment Status"
          sx={{ minWidth: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterAltIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="All Status">All Status</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="unpaid">Unpaid</MenuItem>
        </TextField>
        
        <TextField
          select
          size="small"
          value={selectedPO}
          onChange={(e) => setSelectedPO(e.target.value)}
          label="Purchase Order"
          sx={{ minWidth: 150 }}
        >
          {purchaseOrders.map((po) => (
            <MenuItem key={po} value={po}>
              {po}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          type="date"
          size="small"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          label="Date"
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonthIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        
        <Button 
          variant="outlined" 
          color="error" 
          size="small"
          startIcon={<ClearOutlined />}
          onClick={handleClearFilter}
        >
          Clear Filters
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.light' }}>
            <TableRow>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Batch #</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>PO #</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Invoice</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell align="right" sx={{ color: 'common.white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Show skeleton loader while loading
              [...Array(rowsPerPage)].map((_, index) => (
                <TableRowSkeleton key={index} />
              ))
            ) : (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rr) => (
                  <TableRow key={rr.rr_id} hover>
                    <TableCell 
                      onClick={() => handleViewDetails(rr.batch_number)}
                      sx={{ cursor: 'pointer', fontWeight: 'medium', color: 'primary.main' }}
                    >
                      {rr.batch_number}
                    </TableCell>
                    <TableCell>{rr.po_number}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={rr.status === 'paid' ? <AttachMoneyIcon /> : <MoneyOffIcon />}
                        label={rr.status.toUpperCase()} 
                        color={statusColors[rr.status]}
                        size="small"
                        sx={{ minWidth: 100, textAlign: 'center' }}
                      />
                    </TableCell>
                    <TableCell>{rr.invoice || '—'}</TableCell>
                    <TableCell>
                      {format(new Date(rr.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      ₱{Number(rr.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            color="primary"
                            onClick={() => handleViewDetails(rr.batch_number)}
                          >
                            <EyeOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Print Receiving Report">
                          <IconButton 
                            color="secondary"
                            onClick={() => handlePrint(rr)}
                          >
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            )}
            
            {!isLoading && filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No receiving reports found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`}
      />
    </Container>
  );
};

export default ReceivingReportsPage;