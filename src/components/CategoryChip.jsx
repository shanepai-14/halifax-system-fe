import React from 'react';
import { Chip, TableCell } from '@mui/material';

// Category to color mapping
const getCategoryColor = (categoryName) => {
  if (!categoryName) return 'default';
  
  const category = categoryName.toLowerCase();
  
  switch (category) {
    case 'aluminum':
      return '#1976d2'; // blue
    case 'breezeway':
      return '#2e7d32'; // green
    case 'glass':
      return '#0288d1'; // light blue
    case 'hardware':
      return '#d32f2f'; // red
    case 'accessory':
      return '#f57c00'; // orange
    case 'lock':
      return '#7b1fa2'; // purple
    case 'frame':
      return '#c2185b'; // pink
    case 'track':
      return '#00796b'; // teal
    case 'paint':
      return '#fbc02d'; // yellow
    default:
      return '#9e9e9e'; // gray for other categories
  }
};

const CategoryChip = ({ category }) => {
  if (!category || !category.name) {
    return <TableCell>-</TableCell>;
  }

  const backgroundColor = getCategoryColor(category.name);
  
  return (

      <Chip
        label={category.name}
        size="small"
        sx={{
          backgroundColor,
          color: backgroundColor === '#fbc02d' ? 'rgba(0, 0, 0, 0.87)' : 'white',
          fontWeight: 500
        }}
      />

  );
};

export default CategoryChip;