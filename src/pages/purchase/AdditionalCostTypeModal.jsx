import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { useCreateCostType, useUpdateCostType, useCostType } from '@/hooks/useCostTypes';

/**
 * Modal component for creating and updating additional cost types
 * @param {Object} props
 * @param {Boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Handler for closing the modal
 * @param {String|null} props.costTypeId - ID of cost type to edit (null for create mode)
 * @param {Function} props.onSuccess - Optional callback after successful operation
 */
const AdditionalCostTypeModal = ({
  open,
  onClose,
  costTypeId = null,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_active: true,
    is_deduction: false
  });
  const [errors, setErrors] = useState({});

  const isEditMode = !!costTypeId;

  // Query hooks
  const { data: existingCostType, isLoading: isLoadingCostType } = useCostType(costTypeId);
  const createMutation = useCreateCostType();
  const updateMutation = useUpdateCostType();

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Reset form when modal opens/closes or when switching between create/edit
  useEffect(() => {
    if (open) {
      if (isEditMode && existingCostType) {
        setFormData({
          name: existingCostType.name || '',
          code: existingCostType.code || '',
          description: existingCostType.description || '',
          is_active: existingCostType.is_active ?? true,
          is_deduction: existingCostType.is_deduction ?? false
        });
      } else if (!isEditMode) {
        setFormData({
          name: '',
          code: '',
          description: '',
          is_active: true,
          is_deduction: false
        });
      }
      setErrors({});
    }
  }, [open, isEditMode, existingCostType]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Cost type name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Cost type name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Cost type name must be less than 100 characters';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Cost type code is required';
    } else if (formData.code.trim().length < 2) {
      newErrors.code = 'Cost type code must be at least 2 characters';
    } else if (formData.code.trim().length > 20) {
      newErrors.code = 'Cost type code must be less than 20 characters';
    }

    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim() || null,
      is_active: formData.is_active,
      is_deduction: formData.is_deduction
    };

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: costTypeId,
          data: submitData
        });
      } else {
        await createMutation.mutateAsync(submitData);
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (error) {
      // Handle validation errors from server
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        code: '',
        description: '',
        is_active: true,
        is_deduction: false
      });
      setErrors({});
      onClose();
    }
  };

  const hasServerError = createMutation.error || updateMutation.error;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {isEditMode ? 'Edit Cost Type' : 'Create New Cost Type'}
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={isLoading}
            size="small"
          >
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Loading state for edit mode */}
        {isEditMode && isLoadingCostType ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Server Error Alert */}
            {hasServerError && (
              <Alert severity="error">
                {createMutation.error?.response?.data?.message ||
                 updateMutation.error?.response?.data?.message ||
                 'An error occurred. Please try again.'}
              </Alert>
            )}

            {/* Cost Type Name */}
            <TextField
              label="Cost Type Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name || 'Enter a descriptive name for this cost type'}
              fullWidth
              required
              disabled={isLoading}
              inputProps={{ maxLength: 100 }}
            />

            {/* Cost Type Code */}
            <TextField
              label="Cost Type Code"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
              error={!!errors.code}
              helperText={errors.code || 'Enter a unique code (e.g., SHIPPING, TAX, etc.)'}
              fullWidth
              required
              disabled={isLoading}
              inputProps={{ maxLength: 20 }}
              placeholder="e.g., SHIPPING"
            />

            {/* Description */}
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description || 'Optional description for this cost type'}
              fullWidth
              multiline
              rows={3}
              disabled={isLoading}
              inputProps={{ maxLength: 500 }}
            />

            {/* Active Status */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={
                <Box>
                  <Typography variant="body1">
                    Active
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.is_active 
                      ? 'This cost type can be used in purchase orders' 
                      : 'This cost type will be hidden from selection'}
                  </Typography>
                </Box>
              }
            />

            {/* Deduction Status */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_deduction}
                  onChange={(e) => handleInputChange('is_deduction', e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={
                <Box>
                  <Typography variant="body1">
                    Deduction
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.is_deduction 
                      ? 'This cost will be subtracted from the total amount' 
                      : 'This cost will be added to the total amount'}
                  </Typography>
                </Box>
              }
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || (isEditMode && isLoadingCostType)}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
        >
          {isLoading
            ? (isEditMode ? 'Updating...' : 'Creating...')
            : (isEditMode ? 'Update Cost Type' : 'Create Cost Type')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdditionalCostTypeModal;