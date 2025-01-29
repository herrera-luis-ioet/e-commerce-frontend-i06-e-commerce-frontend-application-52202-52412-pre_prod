import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  Paper,
  Typography,
  Skeleton,
} from '@mui/material';
import { ProductDetailSkeleton } from './SkeletonLoading';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getProduct } from '../../services/api';

// PUBLIC_INTERFACE
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getProduct(id);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Skeleton variant="rectangular" width={120} height={36} animation="wave" sx={{ mb: 3 }} />
          <ProductDetailSkeleton />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Product not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
          variant="outlined"
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardMedia
                component="img"
                image={product.image || 'https://via.placeholder.com/600'}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  minHeight: '400px',
                  objectFit: 'cover'
                }}
              />
            </Card>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>

              <Typography variant="h5" color="primary" sx={{ my: 2 }}>
                ${product.price}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Specifications
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Stock Status
                    </Typography>
                    <Typography variant="body1">
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1">
                      {product.category || 'N/A'}
                    </Typography>
                  </Grid>
                  {product.specifications?.map((spec, index) => (
                    <Grid item xs={6} key={index}>
                      <Typography variant="body2" color="text.secondary">
                        {spec.name}
                      </Typography>
                      <Typography variant="body1">
                        {spec.value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetail;
