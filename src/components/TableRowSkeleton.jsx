import React from 'react';
import { Skeleton, TableCell, Box  , TableRow} from '@mui/material';
const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={100} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={150} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={100} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={200} />
      </TableCell>
      <TableCell align="right">
        <Skeleton variant="text" width={80} />
      </TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </TableCell>
    </TableRow>
  );
  


export default TableRowSkeleton