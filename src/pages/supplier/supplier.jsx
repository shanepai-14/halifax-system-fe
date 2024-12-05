import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Container, TablePagination, IconButton, Button, TextField,
  InputAdornment, Box
} from '@mui/material';
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined, SearchOutlined, ClearOutlined } from '@ant-design/icons';
import SupplierModal from './SupplierModal';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '@/hooks/useSuppliers';
import Swal from 'sweetalert2';
const HalifaxSupplierPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Query hooks
  const { data: suppliers , isLoading, error ,refetch : refetchSuppliers  } = useSuppliers();
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
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSupplierMutation.mutateAsync(id);
          Swal.fire(
            'Deleted!',
            'Supplier has been deleted.',
            'success'
          );
          refetchSuppliers();
        } catch (error) {
          Swal.fire(
            'Error!',
            'Failed to delete supplier. Please try again.',
            'error'
          );
          console.error('Error deleting supplier:', error);
        }
      }
    });
  };

  const handleView = (id) => {
    const supplier = suppliers.find(s => s.supplier_id === id);
    handleOpenModal('view', supplier);
  };
  
  const handleEdit = (id) => {
    const supplier = suppliers.find(s => s.supplier_id === id);
    handleOpenModal('edit', supplier);
  };

  const handleOpenModal = (mode, supplier = null) => {
    setModalMode(mode);
    setSelectedSupplier(supplier);
    setOpenAddSupplierModal(true);
  };
  
  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      await updateSupplierMutation.mutateAsync({
        id: updatedSupplier.supplier_id,  // Pass id separately
        data: {  // Pass data object with the updated fields
          supplier_name: updatedSupplier.supplier_name,
          contact_person: updatedSupplier.contact_person,
          email: updatedSupplier.email,
          phone: updatedSupplier.phone,
          address: updatedSupplier.address
        }
      });
      refetchSuppliers();
      handleCloseAddSupplierModal();
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const handleAddSupplier = async (newSupplier) => {
    try {
      await createSupplierMutation.mutateAsync(newSupplier);
      refetchSuppliers();
      handleCloseAddSupplierModal();
    } catch (error) {
      console.error('Error creating supplier:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handleOpenAddSupplierModal = () => {
    setOpenAddSupplierModal(true);
  };

  const handleCloseAddSupplierModal = () => {
    setOpenAddSupplierModal(false);
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
            onClick={() => handleOpenModal('create')}
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
      <SupplierModal
        open={openAddSupplierModal}
        handleClose={handleCloseAddSupplierModal}
        handleAddSupplier={handleAddSupplier}
        handleUpdateSupplier={handleUpdateSupplier}
        mode={modalMode}
        initialData={selectedSupplier}
      />
    </Container>
  );
};

export default HalifaxSupplierPage;