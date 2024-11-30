import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Container, TablePagination, Button, TextField,
  InputAdornment, Box, CircularProgress, Card, CardContent, 
  CardMedia, Grid, ToggleButton, ToggleButtonGroup, Tooltip, IconButton
} from '@mui/material';
import { SearchOutlined, PlusOutlined ,DeleteOutlined, EditOutlined, } from '@ant-design/icons';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ImageIcon from '@mui/icons-material/Image';
import AddCategoryModal from './addCategoryModal';
import AddProductModal from './addProductModal';
import AddAttributeModal from './AddAttributeModal';
import EditProductModal from './editProductModal';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { getFileUrl } from '@/utils/fileHelper';



const ProductPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [openAddAttributeModal, setOpenAddAttributeModal] = useState(false);
  const [openEditProductModal, setOpenEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenEditProductModal = (product) => {
    setSelectedProduct(product);
    setOpenEditProductModal(true);
  }
  const handleCloseEditProductModal = () => {
    setSelectedProduct(null);
    setOpenEditProductModal(false);
  }

  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const filteredData = products?.filter(item => 
    item.product_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (row) => {
 
  };

  const TableView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Reorder Level</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.product_image ? (
                    <img 
                    src={getFileUrl(row.product_image)} 
                      alt={row.product_name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <Paper 
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: 'grey.100'
                      }}
                    >
                      <ImageIcon color="disabled" />
                    </Paper>
                  )}
                </TableCell>
                <TableCell>{row.product_code}</TableCell>
                <TableCell>{row.product_name}</TableCell>
                <TableCell>{row.category?.name}</TableCell>
                <TableCell align="right">{row.reorder_level}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={ () => handleOpenEditProductModal(row)}>
                      <EditOutlined style={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row)}>
                      <DeleteOutlined style={{ fontSize: 20 }} />
                    </IconButton>
                  </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const CardView = () => (
    <Grid container spacing={2}>
      {filteredData
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {product.product_image ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={getFileUrl(product.product_image)} 
                  alt={product.product_name}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100'
                  }}
                >
                  <ImageIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" noWrap>{product.product_name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Code: {product.product_code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {product.category?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reorder Level: {product.reorder_level}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );

  if (isLoadingProducts || isLoadingCategories) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="xxl" sx={{ mt: 0, p: "0!important" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
          >
            <ToggleButton value="table">
              <Tooltip title="Table View">
                <ViewListIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="card">
              <Tooltip title="Card View">
                <ViewModuleIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
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

      {viewMode === 'table' ? <TableView /> : <CardView />}

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
    <EditProductModal
        open={openEditProductModal}
        handleClose={() => handleCloseEditProductModal()}
        categories={categories || []}
        product={selectedProduct}
      />
    </Container>
  );
};

export default ProductPage;