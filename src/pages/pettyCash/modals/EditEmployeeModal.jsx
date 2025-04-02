import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid
} from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { useEmployees } from '@/hooks/useEmployees';

const EditEmployeeModal = ({ open, onClose, onSuccess, employee, departments = [] }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    department: '',
    email: '',
    phone_number: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [newDepartment, setNewDepartment] = useState('');

  const { updateEmployee, loading } = useEmployees();

  useEffect(() => {
    if (employee) {
      setFormData({
        full_name: employee.full_name || '',
        position: employee.position || '',
        department: employee.department || '',
        email: employee.email || '',
        phone_number: employee.phone_number || '',
        status: employee.status || 'active'
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.department.trim() && !newDepartment.trim()) {
      newErrors.department = 'Department is required';
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employee || !validateForm()) {
      return;
    }

    try {
      const data = {
        ...formData,
        department: formData.department === 'new' ? newDepartment : formData.department
      };
      
      await updateEmployee(employee.id, data);
      handleClose(true);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleClose = (success = false) => {
    setNewDepartment('');
    setErrors({});
    success ? onSuccess() : onClose();
  };

  if (!employee) {
    return null;
  }

  return (
    <Dialog open={open} onClose={() => handleClose()} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit Employee</Typography>
          <IconButton edge="end" color="inherit" onClick={() => handleClose()} aria-label="close">
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="Employee Code"
            value={employee.employee_code || ''}
            disabled
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                error={!!errors.full_name}
                helperText={errors.full_name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                error={!!errors.position}
                helperText={errors.position}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                error={!!errors.department}
                required
              >
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  label="Department *"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                  <MenuItem value="new">
                    <em>Add New Department</em>
                  </MenuItem>
                </Select>
                {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {formData.department === 'new' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="New Department Name"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  error={formData.department === 'new' && !newDepartment.trim()}
                  helperText={formData.department === 'new' && !newDepartment.trim() ? 'New department name is required' : ''}
                />
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : null}
          >
            {loading ? 'Updating...' : 'Update Employee'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditEmployeeModal;
            
          