import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// PUBLIC_INTERFACE
const ProductSort = ({ sortBy, sortDirection, onSortChange }) => {
  const handleSortByChange = (event) => {
    onSortChange('sortBy', event.target.value);
  };

  const handleSortDirectionChange = (event) => {
    onSortChange('sortDirection', event.target.value);
  };

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sort By"
          onChange={handleSortByChange}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="stock">Stock</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Order</InputLabel>
        <Select
          value={sortDirection}
          label="Order"
          onChange={handleSortDirectionChange}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default ProductSort;