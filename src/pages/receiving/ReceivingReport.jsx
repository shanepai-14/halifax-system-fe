import React, { useState, useRef, useEffect } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import {
  PlusOutlined,
  SearchOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useReactToPrint } from 'react-to-print';
import PrintableRR from './PrintableRR';
import { useSelector } from 'react-redux';
import { selectSuppliers } from '@/store/slices/productsSlice';
import { 
  useReceivingReports, 
  useUpdateReceivingReportPaymentStatus,
  useReceivingReportStats
} from '@/hooks/useReceivingReport';
import { toast } from 'sonner';

// Skeleton loader component
const TableRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell align="right">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
      </Box>
    </TableCell>
  </TableRow>
);

// Stats display component
const StatsDisplay = ({ stats }) => {
  if (!stats) return null;
  
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
      <Paper elevation={1} sx={{ p: 2, minWidth: '200px', flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Total Reports</Typography>
        <Typography variant="h4">{stats.total_reports}</Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, minWidth: '200px', flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Paid Reports</Typography>
        <Typography variant="h4" color="success.main">{stats.paid_reports}</Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, minWidth: '200px', flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Unpaid Reports</Typography>
        <Typography variant="h4" color="error.main">{stats.unpaid_reports}</Typography>
      </Paper>
      <Paper elevation={1} sx={{ p: 2, minWidth: '250px', flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Total Received Value</Typography>
        <Typography variant="h4">₱{Number(stats.total_received_value).toLocaleString(undefined, { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}</Typography>
      </Paper>
    </Box>
  );
};

const ReceivingReportPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedReport, setSelectedReport] = useState(null);
  // No longer tracking delete-related state
  const contentRef = useRef();
  
  const suppliers = useSelector(selectSuppliers);
  
  // Get reports with filters
  const { data, isLoading, refetch } = useReceivingReports({
    search: searchTerm,
    supplier_id: selectedSupplier || undefined,
    is_paid: selectedStatus === 'paid' ? true : (selectedStatus === 'unpaid' ? false : undefined),
    per_page: rowsPerPage,
    page: page + 1,
    ...filters
  });
  
  // Get stats
  const { data: stats } = useReceivingReportStats();
  
  // Mutations
  const updatePaymentStatus = useUpdateReceivingReportPaymentStatus();
  
  // Effect to update filters when search/filtering changes
  useEffect(() => {
    const newFilters = {};
    if (searchTerm) newFilters.search = searchTerm;
    if (selectedSupplier) newFilters.supplier_id = selectedSupplier;
    if (selectedStatus) {
      newFilters.is_paid = selectedStatus === 'paid' ? true : false;
    }
    
    setFilters(newFilters);
  }, [searchTerm, selectedSupplier, selectedStatus]);
  
  const handlePrint = useReactToPrint({
    contentRef
  });
  
  const handleStatusChange = async (id, currentStatus) => {
    try {
      await updatePaymentStatus.mutateAsync({
        id,
        isPaid: !currentStatus
      });
      refetch();
    } catch (error) {
      // Error is handled by the mutation
    }
  };
  
  // Delete functionality removed as requested
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleClearFilter = () => {
    setSearchTerm('');
    setSelectedSupplier('');
    setSelectedStatus('');
    setFilters({});
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, px: '0!important' }}>
      {/* Stats Section */}
      <StatsDisplay stats={stats} />
      
      {/* Filters Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
          <TextField
            placeholder="Search by Batch # or PO #"
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
            sx={{ minWidth: 250 }}
          />
          <TextField
            select
            size="small"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            label="Filter by Supplier"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Suppliers</MenuItem>
            {suppliers?.map((supplier) => (
              <MenuItem key={supplier.supplier_id} value={supplier.supplier_id}>
                {supplier.supplier_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Filter by Status"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
          </TextField>
        </Box>
        <Box>
          <Button 
            variant="text" 
            color="error" 
            sx={{mr: 1}} 
            onClick={handleClearFilter}
          >
            <ClearOutlined />
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<ReceiptIcon />}
            onClick={() => navigate('/app/purchase')}
          >
            Purchase Orders
          </Button>
        </Box>
      </Box>

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Batch Number</TableCell>
              <TableCell>PO #</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Show skeleton loader while loading
              [...Array(rowsPerPage)].map((_, index) => (
                <TableRowSkeleton key={index} />
              ))
            ) : !data?.data || data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No receiving reports found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.data.map((report) => (
                <TableRow key={report.rr_id}>
                  <TableCell>
                    <Typography>
                      {report.batch_number}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(report.created_at), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="primary" sx={{ cursor: 'pointer' }} 
                      onClick={() => navigate(`/app/purchase/${report.po_number}/edit`)}>
                      {report.po_number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {report.supplier?.supplier_name}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={report.is_paid ? 'PAID' : 'UNPAID'} 
                      color={report.is_paid ? 'success' : 'error'}
                      size="small"
                      onClick={() => handleStatusChange(report.rr_id, report.is_paid)}
                      sx={{ cursor: 'pointer' }}
                    />
                    {report.invoice && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        Invoice: {report.invoice}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    ₱{Number(report.total_amount).toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Report">
                      <IconButton onClick={() => navigate(`/app/purchase/${report.po_number}/edit`, { state: { reportId: report.rr_id } })}>
                        <EditIcon style={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Receiving Report">
                      <IconButton 
                        onClick={() => {
                          setSelectedReport(report);
                          setTimeout(handlePrint, 100);
                        }}
                      >
                        <PrintIcon style={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {data && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={data.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
  
      {/* Print Component */}
      <PrintableRR receivingReport={selectedReport} contentRef={contentRef}/>
      
      {/* Delete dialog removed as requested */}
    </Container>
  );
};

export default ReceivingReportPage;