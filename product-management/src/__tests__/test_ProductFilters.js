import React from 'react';
import { render, screen, fireEvent, within } from './test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductFilters from '../components/products/ProductFilters';

const mockFilters = {
  category: 'all',
  priceRange: [0, 1000],
  inStock: false
};

describe('ProductFilters Component', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  test('should render all filter controls with proper accessibility attributes', () => {
    render(<ProductFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    // Test filter section labeling
    const filtersRegion = screen.getByRole('region', { name: /product filters/i });
    expect(filtersRegion).toBeInTheDocument();
    
    // Test category select
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    expect(categorySelect).toBeInTheDocument();
    expect(categorySelect).toHaveAttribute('aria-label', 'Filter by category');
    expect(categorySelect).toHaveAttribute('aria-expanded', 'false');
    
    // Test price range slider
    const priceRangeGroup = screen.getByRole('group', { name: /price range/i });
    expect(priceRangeGroup).toBeInTheDocument();
    const sliders = within(priceRangeGroup).getAllByRole('slider');
    expect(sliders[0]).toHaveAttribute('aria-label', 'Minimum price');
    expect(sliders[1]).toHaveAttribute('aria-label', 'Maximum price');
    
    // Test stock checkbox
    const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
    expect(stockCheckbox).toBeInTheDocument();
    expect(stockCheckbox).toHaveAttribute('aria-checked', 'false');
  });

  test('should support keyboard navigation and interaction', async () => {
    const user = userEvent.setup();
    render(<ProductFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);

    // Test category select keyboard interaction
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    await user.tab();
    expect(categorySelect).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(categorySelect).toHaveAttribute('aria-expanded', 'true');
    
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    
    // Test price range slider keyboard interaction
    const sliders = screen.getAllByRole('slider');
    await user.tab();
    expect(sliders[0]).toHaveFocus();
    
    await user.keyboard('{ArrowRight}');
    expect(mockOnFilterChange).toHaveBeenCalledWith('priceRange', expect.any(Array));
    
    // Test checkbox keyboard interaction
    const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
    await user.tab();
    expect(stockCheckbox).toHaveFocus();
    
    await user.keyboard(' '); // Space to toggle checkbox
    expect(stockCheckbox).toHaveAttribute('aria-checked', 'true');
  });

  test('should handle category change', () => {
    render(<ProductFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('category', 'electronics');
  });

  test('should handle price range change', () => {
    render(<ProductFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: 100 } });
    fireEvent.change(sliders[1], { target: { value: 500 } });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('priceRange', [100, 500]);
  });

  test('should handle stock status change', () => {
    render(<ProductFilters filters={mockFilters} onFilterChange={mockOnFilterChange} />);
    
    const checkbox = screen.getByLabelText('In Stock Only');
    fireEvent.click(checkbox);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('inStock', true);
  });

  test('should display current filter values', () => {
    const currentFilters = {
      category: 'electronics',
      priceRange: [200, 800],
      inStock: true
    };
    
    render(<ProductFilters filters={currentFilters} onFilterChange={mockOnFilterChange} />);
    
    expect(screen.getByLabelText(/category/i)).toHaveValue('electronics');
    expect(screen.getByLabelText('In Stock Only')).toBeChecked();
  });
});
