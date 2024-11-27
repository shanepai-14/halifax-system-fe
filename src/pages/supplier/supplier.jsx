import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Container, TablePagination, IconButton, Button, TextField,
  InputAdornment, Box
} from '@mui/material';
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import AddSupplierModal from './addSupplierModal';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '@/hooks/useSuppliers';

const HalifaxSupplierPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);

  // Query hooks
  const { data: suppliers , isLoading, error } = useSuppliers();
  const createSupplierMutation = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();

  // Filter suppliers based on search term
  const filteredData = suppliers?.filter(supplier => 
    supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSupplierMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting supplier:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handleEdit = (id) => {
    console.log('Edit supplier', id);
    // Implement edit functionality with updateSupplierMutation
  };

  const handleView = (id) => {
    console.log('View supplier', id);
    // Implement view functionality
  };

  const handleOpenAddSupplierModal = () => {
    setOpenAddSupplierModal(true);
  };

  const handleCloseAddSupplierModal = () => {
    setOpenAddSupplierModal(false);
  };

  const handleAddSupplier = async (newSupplier) => {
    try {
      await createSupplierMutation.mutateAsync(newSupplier);
      handleCloseAddSupplierModal();
    } catch (error) {
      console.error('Error creating supplier:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handleClearFilter = () => {
    setSearchTerm('');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, px: '0!important' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search suppliers..."
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
            onClick={handleOpenAddSupplierModal}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((supplier) => (
                <TableRow key={supplier.supplier_id}>
                  <TableCell>{supplier.supplier_name}</TableCell>
                  <TableCell>{supplier.contact_person}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleView(supplier.supplier_id)}>
                      <EyeOutlined style={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(supplier.supplier_id)}>
                      <EditOutlined style={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(supplier.supplier_id)}>
                      <DeleteOutlined style={{ fontSize: 20 }} />
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
      <AddSupplierModal
        open={openAddSupplierModal}
        handleClose={handleCloseAddSupplierModal}
        handleAddSupplier={handleAddSupplier}
      />
    </Container>
  );
};

export default HalifaxSupplierPage;