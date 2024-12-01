import React from 'react';
import { Skeleton,Grid , Card , CardContent } from '@mui/material';
const CardSkeleton = () => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 1 }} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="80%" />
        </CardContent>
      </Card>
    </Grid>
  );

export default CardSkeleton