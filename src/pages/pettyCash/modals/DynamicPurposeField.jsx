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

const DynamicPurposeField = ({ 
  value, 
  onChange, 
  error, 
  helperText,
  name = 'purpose',
  label = 'Purpose *'
}) => {
  const [purposes, setPurposes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingNewPurpose, setIsAddingNewPurpose] = useState(false);
  const [newPurposeName, setNewPurposeName] = useState('');

  // Load purposes on component mount
  useEffect(() => {
    loadPurposes();
  }, []);

  const loadPurposes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/purposes');
      setPurposes(response.data.data);
    } catch (error) {
      console.error('Error loading purposes:', error);
      toast.error('Failed to load purposes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    onChange({
      target: {
        name,
        value: e.target.value
      }
    });
  };

  const handleAddPurposeClick = () => {
    setIsAddingNewPurpose(true);
  };

  const handleCancelAddPurpose = () => {
    setIsAddingNewPurpose(false);
    setNewPurposeName('');
  };

  const handleSaveNewPurpose = async () => {
    if (!newPurposeName.trim()) {
      toast.error('Purpose name cannot be empty');
      return;
    }

    try {
      const response = await api.post('/purposes', { name: newPurposeName });
      const newPurpose = response.data.data;
      
      setPurposes([...purposes, newPurpose]);
      onChange({
        target: {
          name,
          value: newPurpose.id
        }
      });
      
      toast.success('Purpose created successfully');
      setIsAddingNewPurpose(false);
      setNewPurposeName('');
    } catch (error) {
      console.error('Error creating purpose:', error);
      toast.error(error.response?.data?.message || 'Failed to create purpose');
    }
  };

  const handleDeleteClick = async (purpose, e) => {
    e.stopPropagation(); // Prevent dropdown from selecting the item
    
    try {
      await api.delete(`/purposes/${purpose.id}`);
      
      setPurposes(purposes.filter(p => p.id !== purpose.id));
      
      // If the deleted purpose was selected, reset the value
      if (value === purpose.id) {
        onChange({
          target: {
            name,
            value: ''
          }
        });
      }
      
      toast.success('Purpose deleted successfully');
    } catch (error) {
      console.error('Error deleting purpose:', error);
      toast.error(error.response?.data?.message || 'Failed to delete purpose');
    }
  };

  return (
    <>
      {isAddingNewPurpose ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <TextField
            fullWidth
            label="New Purpose Name"
            value={newPurposeName}
            onChange={(e) => setNewPurposeName(e.target.value)}
            autoFocus
            size="small"
            margin="dense"
          />
          <IconButton 
            color="primary" 
            onClick={handleSaveNewPurpose}
            size="small"
            sx={{ mt: 1 }}
          >
            <SaveOutlined />
          </IconButton>
          <IconButton 
            onClick={handleCancelAddPurpose}
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
                  onClick={handleAddPurposeClick}
                  edge="end"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  <PlusOutlined />
                </IconButton>
              </InputAdornment>
            }
            renderValue={(selected) => {
              const selectedPurpose = purposes.find(p => p.name === selected);
              return selectedPurpose?.name || '';
            }}
          >
            {purposes.length === 0 ? (
              <MenuItem disabled>
                {loading ? 'Loading...' : 'No purposes available'}
              </MenuItem>
            ) : (
              purposes.map((purpose) => (
                <MenuItem 
                  key={purpose.name} 
                  value={purpose.name}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{purpose.name}</span>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={(e) => handleDeleteClick(purpose, e)}
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

export default DynamicPurposeField;