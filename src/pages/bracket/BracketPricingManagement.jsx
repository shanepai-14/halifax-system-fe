import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CloneIcon,
  PlayArrow as ActivateIcon,
  Pause as DeactivateIcon,
  TrendingUp as SuggestionsIcon,
  Upload as ImportIcon
} from '@mui/icons-material';
import { useBracketPricing } from '@/hooks/useBracketPricing';
import BracketForm from './BracketForm';
import PricingBreakdown from './PricingBreakdown';
import OptimalPricingSuggestions from './OptimalPricingSuggestions';
import { formatCurrency } from '@/utils/formatUtils';

const BracketPricingManagement = ({ product, onClose }) => {
  const {
    loading,
    brackets,
    activeBracket,
    getProductBrackets,
    getActiveBracket,
    deleteBracket,
    activateBracket,
    deactivateBracketPricing,
    cloneBracket
  } = useBracketPricing();

  const [currentTab, setCurrentTab] = useState(0);
  const [showBracketForm, setShowBracketForm] = useState(false);
  const [editingBracket, setEditingBracket] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bracketToDelete, setBracketToDelete] = useState(null);

  useEffect(() => {
    if (product?.id) {
      loadBrackets();
    }
  }, [product?.id]);

  const loadBrackets = async () => {
    if (product?.id) {
      await getProductBrackets(product.id);
      await getActiveBracket(product.id);
    }
  };

  const handleCreateBracket = () => {
    setEditingBracket(null);
    setShowBracketForm(true);
  };

  const handleEditBracket = (bracket) => {
    setEditingBracket(bracket);
    setShowBracketForm(true);
  };

  const handleDeleteBracket = (bracket) => {
    setBracketToDelete(bracket);
    setShowDeleteDialog(true);
  };

  const confirmDeleteBracket = async () => {
    if (bracketToDelete) {
      const success = await deleteBracket(bracketToDelete.id);
      if (success) {
        await loadBrackets();
      }
    }
    setShowDeleteDialog(false);
    setBracketToDelete(null);
  };

  const handleActivateBracket = async (bracket) => {
    try {
      await activateBracket(bracket.id);
      await loadBrackets();
    } catch (error) {
      console.error('Error activating bracket:', error);
    }
  };

  const handleDeactivateBracketPricing = async () => {
    const success = await deactivateBracketPricing(product.id);
    if (success) {
      await loadBrackets();
    }
  };

  const handleCloneBracket = async (bracket) => {
    try {
      await cloneBracket(bracket.id, {
        is_selected: false,
        effective_from: new Date().toISOString().split('T')[0]
      });
      await loadBrackets();
    } catch (error) {
      console.error('Error cloning bracket:', error);
    }
  };

  const handleBracketFormClose = async (refresh = false) => {
    setShowBracketForm(false);
    setEditingBracket(null);
    if (refresh) {
      await loadBrackets();
    }
  };

  const getStatusChip = (bracket) => {
    if (bracket.is_selected) {
      return <Chip label="Active" color="success" size="small" />;
    }
    return <Chip label="Inactive" color="default" size="small" />;
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`bracket-tabpanel-${index}`}
        aria-labelledby={`bracket-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  return (
    <Paper sx={{ width: '100%', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Bracket Pricing Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Product: {product?.product_name} ({product?.product_code})
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Brackets" />
            {/* <Tab label="Pricing Breakdown" /> */}
            <Tab label="Suggestions" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {/* Brackets Tab */}
          <TabPanel value={currentTab} index={0}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Price Brackets</Typography>
              <Box>
                {/* <Button
                  variant="outlined"
                  startIcon={<ImportIcon />}
                  sx={{ mr: 1 }}
                  onClick={() => {}}
                >
                  Import CSV
                </Button> */}
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateBracket}
                >
                  Create Bracket
                </Button>
              </Box>
            </Box>

            {/* Active Bracket Status */}
            {activeBracket && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Active Bracket:</strong> Created on {new Date(activeBracket.created_at).toLocaleDateString()}
                  {' '}({activeBracket.bracket_items?.length || 0} price tiers)
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={handleDeactivateBracketPricing}
                  sx={{ mt: 1 }}
                >
                  Deactivate Bracket Pricing
                </Button>
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>Effective From</TableCell>
                      <TableCell>Effective To</TableCell>
                      <TableCell>Price Tiers</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {brackets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No brackets found. Create your first bracket to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      brackets.map((bracket) => (
                        <TableRow key={bracket.id}>
                          <TableCell>{getStatusChip(bracket)}</TableCell>
                          <TableCell>
                            {new Date(bracket.effective_from).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {bracket.effective_to 
                              ? new Date(bracket.effective_to).toLocaleDateString() 
                              : 'Indefinite'
                            }
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {bracket.bracket_items?.length || 0} tiers
                            </Typography>
                            {bracket.bracket_items?.slice(0, 2).map((item, index) => (
                              <Typography key={index} variant="caption" display="block">
                                {item.min_quantity}{item.max_quantity ? `-${item.max_quantity}` : '+'}: {formatCurrency(item.price)}
                              </Typography>
                            ))}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {new Date(bracket.created_at).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleEditBracket(bracket)}
                              title="Edit"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleCloneBracket(bracket)}
                              title="Clone"
                            >
                              <CloneIcon />
                            </IconButton>
                            {!bracket.is_selected ? (
                              <IconButton
                                size="small"
                                onClick={() => handleActivateBracket(bracket)}
                                title="Activate"
                                color="success"
                              >
                                <ActivateIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                size="small"
                                onClick={handleDeactivateBracketPricing}
                                title="Deactivate"
                                color="warning"
                              >
                                <DeactivateIcon />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteBracket(bracket)}
                              title="Delete"
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Pricing Breakdown Tab */}
          {/* <TabPanel value={currentTab} index={1}>
            <PricingBreakdown productId={product?.id} />
          </TabPanel> */}

          {/* Suggestions Tab */}
          <TabPanel value={currentTab} index={1}>
            <OptimalPricingSuggestions productId={product?.id} />
          </TabPanel>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Close</Button>
      </Box>

      {/* Bracket Form Dialog */}
      {showBracketForm && (
        <BracketForm
          open={showBracketForm}
          product={product}
          bracket={editingBracket}
          onClose={handleBracketFormClose}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this bracket? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteBracket} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BracketPricingManagement;