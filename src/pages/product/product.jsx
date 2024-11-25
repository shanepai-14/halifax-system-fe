import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Container, TablePagination, Button, TextField,
  InputAdornment, Box, CircularProgress
} from '@mui/material';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import AddCategoryModal from './addCategoryModal';
import AddProductModal from './addProductModal';
import AddAttributeModal from './AddAttributeModal';
import { useProducts, useCategories } from '@/hooks/useProducts';

const ProductPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [openAddAttributeModal ,setOpenAddAttributeModal] = useState(false);

  // Fetch data using React Query
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  // Filter products based on search term
  const filteredData = products?.filter(item => 
    item.product_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoadingProducts || isLoadingCategories) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, p: "0!important" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search products..."
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
            variant="contained" 
            onClick={() => setOpenAddProductModal(true)} 
            startIcon={<PlusOutlined />}
            color="error"
          >
            Add Product
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setOpenAddCategoryModal(true)} 
            startIcon={<PlusOutlined />}
            sx={{ ml: 1 }}
            color="info"
          >
            Add Category
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setOpenAddAttributeModal(true)} 
            startIcon={<PlusOutlined />}
            sx={{ ml: 1 }}
            color="success"
          >
            Add Attribute
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Reorder Level</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.product_code}</TableCell>
                  <TableCell>{row.product_name}</TableCell>
                  <TableCell>{row.category?.name}</TableCell>
                  <TableCell>{row.reorder_level}</TableCell>
                  <TableCell>
                    {/* Add actions buttons here */}
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

      <AddCategoryModal
        open={openAddCategoryModal}
        handleClose={() => setOpenAddCategoryModal(false)}
      />
      <AddProductModal
        open={openAddProductModal}
        handleClose={() => setOpenAddProductModal(false)}
        categories={categories || []}
      />
        <AddAttributeModal
        open={openAddAttributeModal}
        handleClose={() => setOpenAddAttributeModal(false)}
      />
    </Container>
  );
};

export default ProductPage;