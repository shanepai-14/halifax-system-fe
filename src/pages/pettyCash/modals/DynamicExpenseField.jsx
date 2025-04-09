import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  FormHelperText,
  Box,
  InputAdornment
} from '@mui/material';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  CloseOutlined, 
  SaveOutlined 
} from '@ant-design/icons';
import api from '@/lib/axios';
import { toast } from 'sonner';

const DynamicExpenseField = ({ 
  value, 
  onChange, 
  error, 
  helperText,
  name = 'expense',
  label = 'Expense *'
}) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingNewExpense, setIsAddingNewExpense] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');

  // Load expenses on component mount
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data.data);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    onChange({
      target: {
        name,
        value: e.target.value
      }
    });
  };

  const handleAddExpenseClick = () => {
    setIsAddingNewExpense(true);
  };

  const handleCancelAddExpense = () => {
    setIsAddingNewExpense(false);
    setNewExpenseName('');
  };

  const handleSaveNewExpense = async () => {
    if (!newExpenseName.trim()) {
      toast.error('Expense name cannot be empty');
      return;
    }

    try {
      const response = await api.post('/expenses', { name: newExpenseName });
      const newExpense = response.data.data;
      
      setExpenses([...expenses, newExpense]);
      onChange({
        target: {
          name,
          value: newExpense.id
        }
      });
      
      toast.success('Expense created successfully');
      setIsAddingNewExpense(false);
      setNewExpenseName('');
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error(error.response?.data?.message || 'Failed to create expense');
    }
  };

  const handleDeleteClick = async (expense, e) => {
    e.stopPropagation(); // Prevent dropdown from selecting the item
    
    try {
      await api.delete(`/expenses/${expense.id}`);
      
      setExpenses(expenses.filter(p => p.id !== expense.id));
      
      // If the deleted expense was selected, reset the value
      if (value === expense.id) {
        onChange({
          target: {
            name,
            value: ''
          }
        });
      }
      
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error(error.response?.data?.message || 'Failed to delete expense');
    }
  };

  return (
    <>
      {isAddingNewExpense ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <TextField
            fullWidth
            label="New Expense Name"
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
            autoFocus
            size="small"
            margin="dense"
          />
          <IconButton 
            color="primary" 
            onClick={handleSaveNewExpense}
            size="small"
            sx={{ mt: 1 }}
          >
            <SaveOutlined />
          </IconButton>
          <IconButton 
            onClick={handleCancelAddExpense}
            size="small"
            sx={{ mt: 1 }}
          >
            <CloseOutlined />
          </IconButton>
        </Box>
      ) : (
        <FormControl 
          fullWidth 
          error={!!error}
          margin="dense"
        >
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            labelId={`${name}-label`}
            value={value || ''}
            onChange={handleChange}
            label={label}
            disabled={loading}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleAddExpenseClick}
                  edge="end"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  <PlusOutlined />
                </IconButton>
              </InputAdornment>
            }
            renderValue={(selected) => {
              const selectedExpense = expenses.find(p => p.name === selected);
              return selectedExpense?.name || '';
            }}
          >
            {expenses.length === 0 ? (
              <MenuItem disabled>
                {loading ? 'Loading...' : 'No expenses available'}
              </MenuItem>
            ) : (
              expenses.map((expense) => (
                <MenuItem 
                  key={expense.name} 
                  value={expense.name}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{expense.name}</span>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={(e) => handleDeleteClick(expense, e)}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </MenuItem>
              ))
            )}
          </Select>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      )}
    </>
  );
};

export default DynamicExpenseField;