import React from 'react';
import {
  Paper, Box, Grid, Divider, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Skeleton
} from '@mui/material';

const DeliveryReportSkeleton = () => {
  // Generate array of specified length for skeleton rows
  const generateSkeletonRows = (count) => {
    return Array(count).fill(0).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton animation="wave" height={24} /></TableCell>
        <TableCell><Skeleton animation="wave" height={24} /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" height={24} /></TableCell>
        <TableCell align="center"><Skeleton animation="wave" height={24} /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" height={24} /></TableCell>
        <TableCell align="right"><Skeleton animation="wave" height={24} /></TableCell>
      </TableRow>
    ));
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Skeleton animation="wave" height={40} width="40%" />
        <Box>
          <Skeleton animation="wave" variant="rectangular" width={170} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Company Header with Logo */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={12}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Skeleton animation="wave" height={50} width="50%" sx={{ mx: 'auto' }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Skeleton animation="wave" height={30} width={200} />
              <Skeleton animation="wave" height={20} width={180} />
              <Skeleton animation="wave" height={20} width={160} />
              <Skeleton animation="wave" height={20} width={140} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Skeleton animation="wave" height={20} width={150} />
              <Skeleton animation="wave" height={20} width={150} />
              <Skeleton animation="wave" height={20} width={150} />
              <Skeleton animation="wave" height={20} width={150} />
            </Box>
          </Grid>
        </Grid>

        {/* Customer & Order Info */}
        <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
          <Grid item xs={6} md={6}>
            <Box sx={{ mb: 1 }}>
              <Skeleton animation="wave" height={24} width="80%" />
              <Skeleton animation="wave" height={20} width="70%" />
              <Skeleton animation="wave" height={20} width="50%" />
              <Skeleton animation="wave" height={20} width="60%" />
            </Box>
          </Grid>

          <Grid item xs={6} md={6}>
            <Box sx={{ textAlign: 'right' }}>
              <Skeleton animation="wave" height={24} width="60%" sx={{ ml: 'auto' }} />
              <Skeleton animation="wave" height={24} width="40%" sx={{ ml: 'auto' }} />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1 }} />

        {/* Items Table */}
        <Skeleton animation="wave" height={28} width="20%" sx={{ mb: 1 }} />
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><Skeleton animation="wave" height={24} /></TableCell>
                <TableCell><Skeleton animation="wave" height={24} /></TableCell>
                <TableCell align="right"><Skeleton animation="wave" height={24} /></TableCell>
                <TableCell align="center"><Skeleton animation="wave" height={24} /></TableCell>
                <TableCell align="right"><Skeleton animation="wave" height={24} /></TableCell>
                <TableCell align="right"><Skeleton animation="wave" height={24} /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generateSkeletonRows(5)}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Skeleton animation="wave" height={20} width={160} />
            <Skeleton animation="wave" height={20} width={140} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Grid container spacing={0} sx={{ maxWidth: '400px' }}>
              <Grid item xs={6}>
                <Skeleton animation="wave" height={20} width="80%" sx={{ ml: 'auto' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" height={20} width="60%" sx={{ ml: 'auto' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" height={20} width="80%" sx={{ ml: 'auto' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" height={20} width="60%" sx={{ ml: 'auto' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" height={24} width="90%" sx={{ ml: 'auto' }} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" height={24} width="70%" sx={{ ml: 'auto' }} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Signature Lines */}
        <Grid container spacing={2} sx={{ mt: 4, px: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Grid item xs={2.4}>
            <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1, textAlign: 'center' }}>
              <Skeleton animation="wave" height={20} width="80%" sx={{ mx: 'auto' }} />
            </Box>
          </Grid>
          <Grid item xs={2.4}>
            <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1, textAlign: 'center' }}>
              <Skeleton animation="wave" height={20} width="80%" sx={{ mx: 'auto' }} />
            </Box>
          </Grid>
          <Grid item xs={2.4}>
            <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1, textAlign: 'center' }}>
              <Skeleton animation="wave" height={20} width="80%" sx={{ mx: 'auto' }} />
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 4, px: 2, display: 'flex', justifyContent: 'center', gap: 30 }}>
          <Grid item xs={2.4}>
            <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1, textAlign: 'center' }}>
              <Skeleton animation="wave" height={20} width="80%" sx={{ mx: 'auto' }} />
            </Box>
          </Grid>
          <Grid item xs={2.4}>
            <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1, textAlign: 'center' }}>
              <Skeleton animation="wave" height={20} width="80%" sx={{ mx: 'auto' }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default DeliveryReportSkeleton;