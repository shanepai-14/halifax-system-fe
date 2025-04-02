import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  TeamOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useEmployees } from '@/hooks/useEmployees';
import AddEmployeeModal from './modals/AddEmployeeModal';
import EditEmployeeModal from './modals/EditEmployeeModal';
import EmployeeTransactionsModal from './modals/EmployeeTransactionsModal';

const EmployeesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [editEmployeeModalOpen, setEditEmployeeModalOpen] = useState(false);
  const [transactionsModalOpen, setTransactionsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Custom hooks
  const { 
    employees, 
    getAllEmployees, 
    deleteEmployee, 
    stats,
    loading 
  } = useEmployees();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const filters = {
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        department: departmentFilter !== 'all' ? departmentFilter : undefined
      };
      await getAllEmployees(filters);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditEmployeeModalOpen(true);
  };

  const handleViewTransactions = (employee) => {
    setSelectedEmployee(employee);
    setTransactionsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    
    try {
      await deleteEmployee(selectedEmployee.id);
      setDeleteConfirmOpen(false);
      setSelectedEmployee(null);
      loadData();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const confirmDelete = (employee) => {
    setSelectedEmployee(employee);
    setDeleteConfirmOpen(true);
  };
  
  const getDepartmentOptions = () => {
    if (!stats || !stats.departments) return [];
    return stats.departments;
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip label="Active" color="success" size="small" />;
      case 'inactive':
        return <Chip label="Inactive" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box>
      {/* Summary Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Employees Management</Typography>
              <Typography variant="body2" color="textSecondary">
                Manage employees for petty cash transactions
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlusOutlined />}
                onClick={() => setAddEmployeeModalOpen(true)}
              >
                Add Employee
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search name, code, position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                label="Department"
              >
                <MenuItem value="all">All Departments</MenuItem>
                {getDepartmentOptions().map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSearch}
              startIcon={<FilterOutlined />}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Employees Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee Code</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No employees found</TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.employee_code}</TableCell>
                  <TableCell>{employee.full_name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    {employee.phone_number ? (
                      <div>
                        <div>{employee.phone_number}</div>
                        <Typography variant="caption" color="textSecondary">
                          {employee.email}
                        </Typography>
                      </div>
                    ) : (
                      employee.email
                    )}
                  </TableCell>
                  <TableCell>{getStatusChip(employee.status)}</TableCell>
                  <TableCell>
                    <Tooltip title="View Transactions">
                      <IconButton 
                        color="primary" 
                        size="small" 
                        onClick={() => handleViewTransactions(employee)}
                      >
                        <EyeOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        color="info" 
                        size="small" 
                        onClick={() => handleEdit(employee)}
                      >
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        color="error" 
                        size="small" 
                        onClick={() => confirmDelete(employee)}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the employee "{selectedEmployee?.full_name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modals */}
      <AddEmployeeModal
        open={addEmployeeModalOpen}
        onClose={() => setAddEmployeeModalOpen(false)}
        onSuccess={() => {
          setAddEmployeeModalOpen(false);
          loadData();
        }}
        departments={getDepartmentOptions()}
      />

      <EditEmployeeModal
        open={editEmployeeModalOpen}
        onClose={() => {
          setEditEmployeeModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSuccess={() => {
          setEditEmployeeModalOpen(false);
          setSelectedEmployee(null);
          loadData();
        }}
        employee={selectedEmployee}
        departments={getDepartmentOptions()}
      />

      <EmployeeTransactionsModal
        open={transactionsModalOpen}
        onClose={() => {
          setTransactionsModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />
    </Box>
  );
};

export default EmployeesTab;