import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

// PUBLIC_INTERFACE
export const ProductCardSkeleton = ({ viewMode = 'grid' }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: viewMode === 'grid' ? 'column' : 'row'
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: viewMode === 'grid' ? '100%' : '200px',
          height: viewMode === 'grid' ? '200px' : '100%'
        }}
        animation="wave"
      />
      <CardContent sx={{ flex: 1, width: viewMode === 'list' ? '100%' : 'auto' }}>
        <Skeleton variant="text" width="80%" height={32} animation="wave" />
        <Skeleton variant="text" width="40%" height={24} animation="wave" />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="90%" animation="wave" />
          <Skeleton variant="text" width="90%" animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
};

// PUBLIC_INTERFACE
export const ProductListSkeleton = ({ viewMode = 'grid', count = 6 }) => {
  return (
    <Grid container spacing={2}>
      {[...Array(count)].map((_, index) => (
        <Grid
          item
          key={index}
          xs={12}
          sm={viewMode === 'grid' ? 6 : 12}
          md={viewMode === 'grid' ? 4 : 12}
        >
          <ProductCardSkeleton viewMode={viewMode} />
        </Grid>
      ))}
    </Grid>
  );
};

// PUBLIC_INTERFACE
export const ProductDetailSkeleton = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Skeleton
          variant="rectangular"
          sx={{ width: '100%', height: '400px' }}
          animation="wave"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="80%" height={40} animation="wave" />
          <Skeleton variant="text" width="30%" height={32} sx={{ my: 2 }} animation="wave" />
          
          <Box sx={{ my: 3 }}>
            <Skeleton variant="text" width="40%" height={28} animation="wave" />
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="100%" animation="wave" />
            <Skeleton variant="text" width="90%" animation="wave" />
          </Box>

          <Box sx={{ my: 3 }}>
            <Skeleton variant="text" width="40%" height={28} animation="wave" />
            <Grid container spacing={2}>
              {[...Array(4)].map((_, index) => (
                <Grid item xs={6} key={index}>
                  <Skeleton variant="text" width="40%" animation="wave" />
                  <Skeleton variant="text" width="60%" animation="wave" />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};