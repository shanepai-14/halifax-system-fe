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
  Menu,
  MenuItem,
} from '@mui/material';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  ClearOutlined,
  MoreOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { 
  usePurchaseOrders, 
  useCancelPurchaseOrder 
} from '@/hooks/usePurchaseOrders';

const statusColors = {
  pending: 'warning',
  partially_received: 'info',
  completed: 'success',
  cancelled: 'error',
};

const PurchaseOrderPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);

  // Queries and Mutations
  const { data: purchaseOrders = [], isLoading } = usePurchaseOrders(filters);
  const cancelPOMutation = useCancelPurchaseOrder();

  // Filter purchase orders based on search term
  const filteredData = purchaseOrders.filter(po => 
    po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier?.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, po) => {
    setAnchorEl(event.currentTarget);
    setSelectedPO(po);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPO(null);
  };

  const handleCancelPO = async () => {
    try {
      await cancelPOMutation.mutateAsync(selectedPO.po_id);
      handleMenuClose();
    } catch (error) {
      console.error('Error cancelling PO:', error);
    }
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setFilters({});
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, px: '0!important' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
        />
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
              <TableCell>Invoice</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((po) => (
                <TableRow key={po.po_id}>
                  <TableCell onClick={ () => navigate(`${po.po_number}/edit`)} color='primary'><Typography color='primary'>
                  {po.po_number}
                    </Typography></TableCell>
                  <TableCell>
                    {format(new Date(po.po_date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{po.supplier?.supplier_name}</TableCell>
                  <TableCell>{po.invoice}</TableCell>
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
                    <IconButton onClick={() => {/* Handle view */}}>
                      <EyeOutlined style={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton 
                      onClick={(e) => handleMenuOpen(e, po)}
                      disabled={po.status === 'cancelled' || po.status === 'completed'}
                    >
                      <MoreOutlined style={{ fontSize: 20 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {/* Handle edit */}}>
          <EditOutlined style={{ marginRight: 8 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleCancelPO}>
          <CloseCircleOutlined style={{ marginRight: 8 }} /> Cancel
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default PurchaseOrderPage;