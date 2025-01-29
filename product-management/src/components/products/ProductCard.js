import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';

// PUBLIC_INTERFACE
const ProductCard = ({ product, viewMode }) => {
  const isGridView = viewMode === 'grid';

  return (
    <Card 
      sx={{ 
        display: isGridView ? 'block' : 'flex',
        mb: 2,
        width: isGridView ? '100%' : '100%',
        height: isGridView ? 'auto' : '200px'
      }}
    >
      <CardMedia
        component="img"
        image={product.image || 'https://via.placeholder.com/200'}
        alt={product.name}
        sx={{
          width: isGridView ? '100%' : '200px',
          height: isGridView ? '200px' : '100%',
          objectFit: 'cover'
        }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock: {product.stock}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    image: PropTypes.string
  }).isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired
};

export default ProductCard;
