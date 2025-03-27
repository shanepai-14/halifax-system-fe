import React from 'react';
import { TableRow, TableCell, Skeleton, Typography } from '@mui/material';

const TableRowSkeleton = ({ key }) => {
  return (
    <TableRow key={key}>
      {/* Invoice # */}
      <TableCell>
        <Skeleton width={100} height={24} variant="text" />
      </TableCell>
      
      {/* Customer */}
      <TableCell>
        <Skeleton width={120} height={24} variant="text" />
        <Typography variant="caption" display="block">
          <Skeleton width={80} height={16} variant="text" />
        </Typography>
      </TableCell>
      
      {/* Status */}
      <TableCell>
        <Skeleton width={80} height={32} variant="rounded" />
      </TableCell>
      
      {/* Payment Method */}
      <TableCell>
        <Skeleton width={90} height={24} variant="text" />
      </TableCell>
      
      {/* Order Date */}
      <TableCell>
        <Skeleton width={90} height={24} variant="text" />
      </TableCell>
      
      {/* Delivery Date */}
      <TableCell>
        <Skeleton width={90} height={24} variant="text" />
      </TableCell>
      
      {/* City */}
      <TableCell>
        <Skeleton width={60} height={24} variant="text" />
      </TableCell>
      
      {/* Total */}
      <TableCell align="right">
        <Skeleton width={80} height={24} variant="text" sx={{ ml: 'auto' }} />
      </TableCell>
      
      {/* Delivered */}
      <TableCell>
        <Skeleton width={60} height={32} variant="rounded" />
      </TableCell>
    </TableRow>
  );
};

export default TableRowSkeleton;