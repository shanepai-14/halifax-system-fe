import React, { useState, useEffect, useRef } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { 
  usePurchaseOrders, 
  useCancelPurchaseOrder 
} from '@/hooks/usePurchaseOrders';
import PrintablePO from './PrintablePO';
import { useReactToPrint } from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import {
  selectSuppliers,
} from '@/store/slices/productsSlice';
import {  useSelector } from 'react-redux';

const statusColors = {
  pending: 'warning',
  partially_received: 'info',
  completed: 'success',
  cancelled: 'error',
};

// Skeleton loader component
const TableRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" /></TableCell>
    <TableCell><Skeleton animation="wave" width={80} /></TableCell>
    <TableCell align="right">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
        <Skeleton animation="wave" variant="circular" width={32} height={32} />
      </Box>
    </TableCell>
  </TableRow>
);

const PurchaseOrderPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('All Suppliers');
  const [filters, setFilters] = useState({});
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const contentRef = useRef();
  const supply =  useSelector(selectSuppliers);

  const { data: purchaseOrders = [], isLoading } = usePurchaseOrders(filters);


  const handlePrint = useReactToPrint({
    contentRef
  });

  // Get unique suppliers from purchase orders
  const suppliers = ['All Suppliers', ...new Set(supply.map(po => po?.supplier_name))]
    .filter(Boolean);

  // Updated filter logic
  const filteredData = purchaseOrders.filter(po => {
    const matchesSearch = po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier?.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSupplier = selectedSupplier === 'All Suppliers' || 
      po.supplier?.supplier_name === selectedSupplier;
  
    const matchesStatus = selectedStatus === 'All Status' ||
      po.status === selectedStatus.toLowerCase().replace(' ', '_');
  
    return matchesSearch && matchesSupplier && matchesStatus;
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
    setFilters({});
  };

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, px: '0!important' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
          <TextField
            placeholder="Search PO number"
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
            sx={{ minWidth: 200 }}
          />
              <TextField
            select
            size="small"
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            label="Filter by Supplier"
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
            label="Filter by Status"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Partially Received">Partially Received</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
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
            color="error" 
            startIcon={<PlusOutlined />}
            onClick={() => navigate('/app/purchase/create')}
          >
            Create PO
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PO Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                .map((po) => (
                  <TableRow key={po.po_id}>
                    <TableCell onClick={() => navigate(`${po.po_number}/edit`)} color='primary'>
                      <Typography color='primary'>
                        {po.po_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {format(new Date(po.po_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>{po.supplier?.supplier_name}</TableCell>
                    <TableCell>
                      ₱{Number(po.total_amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={po.status.replace('_', ' ')} 
                        color={statusColors[po.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => navigate(`${po.po_number}/edit`)}>
                        <EyeOutlined style={{ fontSize: 20 }} />
                      </IconButton>
                      <Tooltip title="Print Purchase Order">
                        <IconButton 
                          onClick={() => {
                            setPurchaseOrder(po);
                            setTimeout(handlePrint, 100);
                          }}
                        >
                          <PrintIcon style={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
  
      <PrintablePO purchaseOrder={purchaseOrder} contentRef={contentRef}/>
    </Container>
  );
};

export default PurchaseOrderPage;