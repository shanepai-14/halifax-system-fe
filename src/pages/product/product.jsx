import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Container, TablePagination, Button, TextField,
  InputAdornment, Box, CircularProgress, Card, CardContent, 
  CardMedia, Grid, ToggleButton, ToggleButtonGroup, Tooltip, IconButton,
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  TableSortLabel,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog
} from '@mui/material';
import { 
  SearchOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  HistoryOutlined,
  MoreOutlined,
  DollarOutlined
} from '@ant-design/icons';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ImageIcon from '@mui/icons-material/Image';
import AddCategoryModal from './addCategoryModal';
import AddProductModal from './addProductModal';
import AddAttributeModal from './AddAttributeModal';
import EditProductModal from './editProductModal';
import { useProducts, useCategories ,useDeleteProduct } from '@/hooks/useProducts';
import { getFileUrl } from '@/utils/formatUtils';
import CardSkeleton from '@/components/CardSkeleton';
import TableRowSkeleton from '@/components/loader/TableRowSkeleton';
import CategoryChip from '@/components/CategoryChip';
import BracketPricingManagement from '../bracket/BracketPricingManagement';
import ProductHistoryModal from './ProductHistoryModal';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';


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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProductId, setMenuProductId] = useState(null);
  const [bracketPricingOpen, setBracketPricingOpen] = useState(false);
  const [bracketProduct, setBracketProduct] = useState(null);

  const currentUser = useSelector(selectCurrentUser);
  const canManageBracket = currentUser?.role === 'admin' || currentUser?.role === 'cashier';

  const [sortConfig, setSortConfig] = useState({
    field: 'product_name',
    direction: 'asc'
  });

  // Kebab menu handlers
  const handleMenuOpen = (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.currentTarget;
    setAnchorEl(target);
    setMenuProductId(productId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProductId(null);
  };

  // Bracket pricing handlers
  const handleOpenBracketPricing = (product) => {
    setBracketProduct(product);
    setBracketPricingOpen(true);
    handleMenuClose();
  };

  const handleCloseBracketPricing = () => {
    setBracketPricingOpen(false);
    setBracketProduct(null);
  };

  const handleViewHistory = (product) => {
    handleMenuClose();
    setSelectedProduct(product);
    setHistoryModalOpen(true);
  };

  const handleCloseHistory = () => {
    setHistoryModalOpen(false);
    setSelectedProduct(null);
  }

  const handleOpenEditProductModal = (product) => {
    handleMenuClose();
    setSelectedProduct(product);
    setOpenEditProductModal(true);
  }
  
  const handleCloseEditProductModal = () => {
    setSelectedProduct(null);
    setOpenEditProductModal(false);
  }

  const { data: products, isLoading: isLoadingProducts , refetch : refetchProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const deleteProduct = useDeleteProduct();

  const filteredData = products?.filter(item => {
    const matchesSearch = 
      item.product_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.attributes?.some(attr => 
        attr.attribute_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attr.pivot?.value?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      item.category?.id === selectedCategory;
  
    return matchesSearch && matchesCategory;
  }) || [];
  
  
  const handleSort = (field) => {
    setSortConfig({
      field,
      direction: 
        sortConfig.field === field && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.field === 'attributes') {
      const aValue = a.attributes?.[0]?.pivot?.value || '';
      const bValue = b.attributes?.[0]?.pivot?.value || '';
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];
  
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const renderAttributes = (attribute) => {
    if (!attribute) return 'No attribute';
    return `${attribute.attribute_name} (${attribute.unit_of_measurement})`;
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleDelete = async (productId) => {
    handleMenuClose();
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this product!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
      });
  
      if (result.isConfirmed) {
        await deleteProduct.mutateAsync(productId);
        await Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        refetchProducts();
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to delete product.',
        icon: 'error'
      });
      console.error('Failed to delete product:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get product by ID for menu actions
  const getProductById = (id) => products?.find(p => p.id === id);

  const CardView = () => (
    <Grid container spacing={2}>
      {isLoadingProducts ? (
        Array(rowsPerPage).fill(0).map((_, index) => (
          <CardSkeleton key={index} />
        ))
      ) : (
        sortedData
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
                  <Typography variant="body2" color="text.secondary">
                    Attributes: {renderAttributes(product.attributes)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
      )}
    </Grid>
  );

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
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

      <div style={{ display: viewMode === 'table' ? 'block' : 'none' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.field === 'product_code'}
                    direction={sortConfig.field === 'product_code' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('product_code')}
                  >
                    Code
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.field === 'product_name'}
                    direction={sortConfig.field === 'product_name' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('product_name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Attribute</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortConfig.field === 'quantity'}
                    direction={sortConfig.field === 'quantity' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('quantity')}
                  >
                    Qty
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortConfig.field === 'reorder_level'}
                    direction={sortConfig.field === 'reorder_level' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('reorder_level')}
                  >
                    Reorder
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingProducts ? (
                Array(rowsPerPage).fill(0).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : (
                sortedData
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
                      <TableCell>{<CategoryChip category={row.category} />}</TableCell>
                      <TableCell>{renderAttributes(row.attribute)}</TableCell> 
                      <TableCell align="right">{Number(row.inventory_quantity)}</TableCell>
                      <TableCell align="right">{row.reorder_level}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          onClick={(e) => handleMenuOpen(e, row.id)}
                          size="small"
                          aria-label="more actions"
                        >
                          <MoreOutlined style={{ fontSize: 20, pointerEvents: 'none' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          keepMounted={false}
        >
          <MenuItem 
            onClick={() => handleOpenBracketPricing(getProductById(menuProductId))}
            disabled={!canManageBracket}
             sx={{
            color: getProductById(menuProductId)?.use_bracket_pricing ? 'success.main' : 'inherit',
            '& .MuiListItemIcon-root': {
              color: getProductById(menuProductId)?.use_bracket_pricing ? 'success.main' : 'inherit'
            }
          }}
          >
            <ListItemIcon>
              <DollarOutlined style={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText>Bracket Pricing</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleViewHistory(getProductById(menuProductId))}>
            <ListItemIcon>
              <HistoryOutlined style={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText>View History</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleOpenEditProductModal(getProductById(menuProductId))}>
            <ListItemIcon>
              <EditOutlined style={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleDelete(menuProductId)}>
            <ListItemIcon>
              <DeleteOutlined style={{ fontSize: 18, color: '#d32f2f' }} />
            </ListItemIcon>
            <ListItemText sx={{ color: '#d32f2f' }}>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </div>
      
      <div style={{ display: viewMode === 'card' ? 'block' : 'none' }}>
        <CardView />
      </div>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Bracket Pricing Dialog */}
      <Dialog
        open={bracketPricingOpen}
        onClose={handleCloseBracketPricing}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh'
          }
        }}
      >
        <BracketPricingManagement
          product={bracketProduct}
          onClose={handleCloseBracketPricing}
        />
      </Dialog>

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
      <ProductHistoryModal
        open={historyModalOpen}
        onClose={handleCloseHistory}
        product={selectedProduct}
      />
    </Container>
  );
};

export default ProductPage;