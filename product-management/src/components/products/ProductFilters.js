import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  ButtonBase
} from '@mui/material';
import { FilterList, ExpandMore, ExpandLess } from '@mui/icons-material';
import FocusTrap from '../FocusTrap';

// PUBLIC_INTERFACE
const ProductFilters = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const filterButtonRef = useRef(null);
  const firstFilterRef = useRef(null);

  const handleFilterActivate = useCallback(() => {
    // Store the filter button as the element to return focus to
    if (filterButtonRef.current) {
      filterButtonRef.current.setAttribute('aria-expanded', 'true');
    }
  }, []);

  const handleFilterDeactivate = useCallback(() => {
    if (filterButtonRef.current) {
      filterButtonRef.current.setAttribute('aria-expanded', 'false');
    }
  }, []);

  const handleCategoryChange = (event) => {
    onFilterChange('category', event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    onFilterChange('priceRange', newValue);
  };

  const handleStockStatusChange = (event) => {
    onFilterChange('inStock', event.target.checked);
  };

  const toggleFilters = () => {
    setIsExpanded(!isExpanded);
  };

  const filterContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          ref={firstFilterRef}
          labelId="category-label"
          id="category-select"
          value={filters.category}
          label="Category"
          onChange={handleCategoryChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.target.click();
            }
          }}
          aria-label="Select product category"
          role="combobox"
          sx={{ '& .MuiSelect-select': { minHeight: '44px' } }}
        >
          <MenuItem value="all" sx={{ minHeight: '44px', py: 1.5 }}>All Categories</MenuItem>
          <MenuItem value="electronics" sx={{ minHeight: '44px', py: 1.5 }}>Electronics</MenuItem>
          <MenuItem value="clothing" sx={{ minHeight: '44px', py: 1.5 }}>Clothing</MenuItem>
          <MenuItem value="books" sx={{ minHeight: '44px', py: 1.5 }}>Books</MenuItem>
          <MenuItem value="home" sx={{ minHeight: '44px', py: 1.5 }}>Home & Garden</MenuItem>
        </Select>
      </FormControl>

      <Box>
        <Typography gutterBottom id="price-range-label">Price Range</Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          aria-labelledby="price-range-label"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={1000}
          aria-valuenow={filters.priceRange}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              handlePriceChange(e, Math.max(0, filters.priceRange - 10));
            } else if (e.key === 'ArrowRight') {
              handlePriceChange(e, Math.min(1000, filters.priceRange + 10));
            }
          }}
          marks={[
            { value: 0, label: '$0' },
            { value: 1000, label: '$1000' }
          ]}
          sx={{
            '& .MuiSlider-thumb': {
              width: 28,
              height: 28,
            }
          }}
        />
      </Box>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.inStock}
              onChange={handleStockStatusChange}
              aria-label="Show only in-stock products"
              role="checkbox"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStockStatusChange({ target: { checked: !filters.inStock } });
                }
              }}
              sx={{ 
                padding: '12px',
                '& .MuiSvgIcon-root': { fontSize: 24 }
              }}
            />
          }
          label="In Stock Only"
          sx={{ minHeight: '44px' }}
        />
      </FormGroup>
    </Box>
  );

  return (
    <Paper 
      elevation={2} 
      role="region"
      aria-label="Product filters"
      sx={{ 
        p: 2, 
        mb: 2,
        position: 'relative',
        zIndex: 1,
        ...(isMobile && {
          position: 'sticky',
          top: 0,
          marginBottom: '1rem'
        })
      }}
    >
      {isMobile && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ButtonBase 
            ref={filterButtonRef}
            onClick={toggleFilters}
            role="button"
            aria-expanded={isExpanded}
            aria-controls="filter-content"
            aria-label={`${isExpanded ? 'Hide' : 'Show'} product filters`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFilters();
              }
            }}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              minHeight: '44px',
              padding: '12px',
              borderRadius: 1,
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <FilterList sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Filters
              </Typography>
            </Box>
            <IconButton 
              sx={{ 
                minWidth: '44px',
                minHeight: '44px',
                ml: 'auto'
              }}
              aria-expanded={isExpanded}
              aria-label="toggle filters"
              onClick={(e) => {
                e.stopPropagation();
                toggleFilters();
              }}
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ButtonBase>
        </Box>
      )}
      
      {isMobile ? (
        <FocusTrap 
          active={isExpanded}
          initialFocus={firstFilterRef}
          onActivate={handleFilterActivate}
          onDeactivate={handleFilterDeactivate}
          autoFocus={true}
        >
          <Collapse 
            in={isExpanded} 
            timeout={300}
            id="filter-content"
            role="region"
            aria-label="Filter options"
            sx={{
              transition: theme.transitions.create('all', {
                duration: theme.transitions.duration.standard,
                easing: theme.transitions.easing.easeInOut
              })
            }}
          >
            {filterContent}
          </Collapse>
        </FocusTrap>
      ) : (
        filterContent
      )}
    </Paper>
  );
};

export default ProductFilters;
