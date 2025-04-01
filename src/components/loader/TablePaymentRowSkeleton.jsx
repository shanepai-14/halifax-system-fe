import React from 'react';
import { TableRow, TableCell, Skeleton } from '@mui/material';

const TablePaymentRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell><Skeleton variant="text" width="90%" height={20} /></TableCell>
      <TableCell><Skeleton variant="text" width="90%" height={20} /></TableCell>
      <TableCell><Skeleton variant="text" width="90%" height={20} /></TableCell>
      <TableCell><Skeleton variant="text" width="90%" height={20} /></TableCell>
      <TableCell><Skeleton variant="text" width="90%" height={20} /></TableCell>
      <TableCell align="right"><Skeleton variant="text" width="90%" height={20} /></TableCell>
      <TableCell><Skeleton variant="rounded" width={70} height={22} /></TableCell>
      <TableCell><Skeleton variant="text" width="90%" height={20} /></TableCell>
      <TableCell align="right">
        <Skeleton variant="rounded" width={90} height={30} />
      </TableCell>
    </TableRow>
  );
};

export default TablePaymentRowSkeleton;