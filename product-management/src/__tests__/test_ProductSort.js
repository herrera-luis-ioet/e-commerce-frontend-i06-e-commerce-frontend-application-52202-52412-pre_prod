import React from 'react';
import { render, screen, fireEvent, within } from './test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductSort from '../components/products/ProductSort';

describe('ProductSort Component', () => {
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    mockOnSortChange.mockClear();
  });

  test('should render sort controls with proper accessibility attributes', () => {
    render(
      <ProductSort
        sortBy="name"
        sortDirection="asc"
        onSortChange={mockOnSortChange}
      />
    );
    
    // Test form control labeling
    const sortByGroup = screen.getByRole('group', { name: /sort options/i });
    expect(sortByGroup).toBeInTheDocument();
    
    // Test select components with proper roles and labels
    const sortBySelect = screen.getByRole('combobox', { name: /sort by/i });
    const orderSelect = screen.getByRole('combobox', { name: /order/i });
    
    expect(sortBySelect).toBeInTheDocument();
    expect(orderSelect).toBeInTheDocument();
    
    // Check for proper ARIA attributes
    expect(sortBySelect).toHaveAttribute('aria-haspopup', 'listbox');
    expect(sortBySelect).toHaveAttribute('aria-expanded', 'false');
    expect(sortBySelect).toHaveAttribute('aria-label', 'Sort by');
    
    expect(orderSelect).toHaveAttribute('aria-haspopup', 'listbox');
    expect(orderSelect).toHaveAttribute('aria-expanded', 'false');
    expect(orderSelect).toHaveAttribute('aria-label', 'Sort order');
    
    // Verify select options are properly labeled
    expect(screen.getByRole('option', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Price' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ascending' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Descending' })).toBeInTheDocument();
  });

  test('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <ProductSort
        sortBy="name"
        sortDirection="asc"
        onSortChange={mockOnSortChange}
      />
    );

    const sortBySelect = screen.getByRole('combobox', { name: /sort by/i });
    
    // Test keyboard interaction
    await user.tab();
    expect(sortBySelect).toHaveFocus();
    
    // Open dropdown with keyboard
    await user.keyboard('{Enter}');
    expect(sortBySelect).toHaveAttribute('aria-expanded', 'true');
    
    // Navigate options
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Price' })).toHaveFocus();
    
    // Select option with keyboard
    await user.keyboard('{Enter}');
    expect(mockOnSortChange).toHaveBeenCalledWith('sortBy', 'price');
  });

  test('should handle sort by change', () => {
    render(
      <ProductSort
        sortBy="name"
        sortDirection="asc"
        onSortChange={mockOnSortChange}
      />
    );
    
    const sortBySelect = screen.getByText('Name').closest('[role="combobox"]');
    const nativeInput = sortBySelect.parentElement.querySelector('input');
    fireEvent.change(nativeInput, { target: { value: 'price' } });
    
    expect(mockOnSortChange).toHaveBeenCalledWith('sortBy', 'price');
  });

  test('should handle sort direction change', () => {
    render(
      <ProductSort
        sortBy="name"
        sortDirection="asc"
        onSortChange={mockOnSortChange}
      />
    );
    
    const orderSelect = screen.getByText('Ascending').closest('[role="combobox"]');
    const nativeInput = orderSelect.parentElement.querySelector('input');
    fireEvent.change(nativeInput, { target: { value: 'desc' } });
    
    expect(mockOnSortChange).toHaveBeenCalledWith('sortDirection', 'desc');
  });

  test('should display current sort values', () => {
    render(
      <ProductSort
        sortBy="price"
        sortDirection="desc"
        onSortChange={mockOnSortChange}
      />
    );
    
    const sortBySelect = screen.getByText('Price').closest('[role="combobox"]');
    const orderSelect = screen.getByText('Descending').closest('[role="combobox"]');
    
    expect(sortBySelect.parentElement.querySelector('input')).toHaveValue('price');
    expect(orderSelect.parentElement.querySelector('input')).toHaveValue('desc');
  });

  test('should have correct initial display values', () => {
    render(
      <ProductSort
        sortBy="name"
        sortDirection="asc"
        onSortChange={mockOnSortChange}
      />
    );
    
    const sortBySelect = screen.getByRole('combobox', { name: /sort by/i });
    expect(sortBySelect).toHaveTextContent('Name');
    
    const orderSelect = screen.getByRole('combobox', { name: /order/i });
    expect(orderSelect).toHaveTextContent('Ascending');
  });
});
