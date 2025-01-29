import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Box, 
  ToggleButton, 
  ToggleButtonGroup,
  Alert,
  Skeleton
} from '@mui/material';
import { ProductListSkeleton } from './SkeletonLoading';
import { ViewModule as GridIcon, ViewList as ListIcon } from '@mui/icons-material';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import ProductSort from './ProductSort';
import { fetchProducts } from '../../services/api';

// Placeholder data for initial testing
const placeholderProducts = [
  {
    id: '1',
    name: 'Sample Product 1',
    description: 'This is a sample product description.',
    price: 99.99,
    stock: 10,
    image: 'https://via.placeholder.com/200'
  },
  {
    id: '2',
    name: 'Sample Product 2',
    description: 'Another sample product description.',
    price: 149.99,
    stock: 5,
    image: 'https://via.placeholder.com/200'
  }
];

// PUBLIC_INTERFACE
const ProductList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000],
    inStock: false
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Using placeholder data instead.');
        setProducts(placeholderProducts);
        setFilteredProducts(placeholderProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let result = [...products];

      // Apply category filter
      if (filters.category !== 'all') {
        result = result.filter(product => product.category === filters.category);
      }

      // Apply price range filter
      result = result.filter(product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      );

      // Apply stock filter
      if (filters.inStock) {
        result = result.filter(product => product.stock > 0);
      }

      // Apply sorting
      const sortedResult = [...result].sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === 'price') {
          comparison = a.price - b.price;
        } else if (sortBy === 'stock') {
          comparison = a.stock - b.stock;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });

      setFilteredProducts(sortedResult);
    };

    applyFilters();
  }, [filters, products, sortBy, sortDirection]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ width: '250px' }}>
            <Skeleton variant="rectangular" height={200} animation="wave" />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Skeleton variant="rectangular" width={200} height={40} animation="wave" />
            <Skeleton variant="rectangular" width={100} height={40} animation="wave" />
          </Box>
        </Box>
        <ProductListSkeleton viewMode={viewMode} />
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ width: '250px' }}>
          <ProductFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ProductSort
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={(type, value) => {
              if (type === 'sortBy') {
                setSortBy(value);
              } else if (type === 'sortDirection') {
                setSortDirection(value);
              }
            }}
          />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label="view mode"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <Grid 
            item 
            key={product.id} 
            xs={12} 
            sm={viewMode === 'grid' ? 6 : 12}
            md={viewMode === 'grid' ? 4 : 12}
          >
            <ProductCard product={product} viewMode={viewMode} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
