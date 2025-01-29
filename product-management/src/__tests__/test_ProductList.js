import React from 'react';
import { render, screen, fireEvent, waitFor } from './test-utils';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import ProductList from '../components/products/ProductList';

const mockProducts = [
  {
    id: '1',
    name: 'Product A',
    description: 'Description A',
    price: 99.99,
    stock: 10,
    category: 'electronics',
    image: 'https://via.placeholder.com/200'
  },
  {
    id: '2',
    name: 'Product B',
    description: 'Description B',
    price: 149.99,
    stock: 0,
    category: 'clothing',
    image: 'https://via.placeholder.com/200'
  }
];

const server = setupServer(
  http.get('http://localhost:3000/api/products', () => {
    return HttpResponse.json(mockProducts);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProductList Component', () => {
  // Test case PL_RENDER_001
  test('renders loading state initially with proper accessibility', () => {
    render(<ProductList />);
    const loadingSpinner = screen.getByRole('progressbar');
    expect(loadingSpinner).toBeInTheDocument();
    expect(loadingSpinner).toHaveAttribute('aria-label', 'Loading products');
    expect(loadingSpinner).toHaveAttribute('aria-busy', 'true');
  });

  // Test case PL_RENDER_002
  test('renders products after loading with proper accessibility', async () => {
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Test main content area
    const mainContent = screen.getByRole('main', { name: /product list/i });
    expect(mainContent).toBeInTheDocument();

    // Test product grid
    const productGrid = screen.getByRole('grid', { name: /products/i });
    expect(productGrid).toBeInTheDocument();

    // Test individual product cards
    const products = screen.getAllByRole('article');
    expect(products).toHaveLength(2);

    // Test product card accessibility
    const firstProduct = products[0];
    expect(firstProduct).toHaveAttribute('aria-labelledby', expect.any(String));
    expect(firstProduct).toHaveAttribute('tabindex', '0');

    // Verify product information is accessible
    expect(screen.getByRole('heading', { name: 'Product A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Product B' })).toBeInTheDocument();

    // Test price accessibility
    const prices = screen.getAllByRole('text', { name: /price/i });
    expect(prices[0]).toHaveTextContent('$99.99');
    expect(prices[1]).toHaveTextContent('$149.99');
  });

  test('supports keyboard navigation through products', async () => {
    const user = userEvent.setup();
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const products = screen.getAllByRole('article');
    
    // Test keyboard navigation
    await user.tab();
    expect(products[0]).toHaveFocus();
    
    await user.tab();
    expect(products[1]).toHaveFocus();
    
    // Test interaction with focused product
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // Test case PL_FILTER_001
  test('filters products by category', async () => {
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.queryByText('Product B')).not.toBeInTheDocument();
  });

  // Test case PL_FILTER_002
  test('filters products by stock status', async () => {
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const stockCheckbox = screen.getByRole('checkbox', { name: /in stock only/i });
    fireEvent.click(stockCheckbox);

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.queryByText('Product B')).not.toBeInTheDocument();
  });

  // Test case PL_SORT_001
  test('sorts products by name', async () => {
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
    fireEvent.change(sortSelect, { target: { value: 'name' } });

    const products = screen.getAllByRole('article');
    expect(products[0]).toHaveTextContent('Product A');
    expect(products[1]).toHaveTextContent('Product B');
  });

  // Test case PL_VIEW_001
  test('toggles between grid and list view', async () => {
    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const listViewButton = screen.getByRole('button', { name: /list view/i });
    fireEvent.click(listViewButton);

    const products = screen.getAllByRole('article');
    expect(products[0].parentElement).toHaveClass('MuiGrid-grid-xs-12');

    const gridViewButton = screen.getByRole('button', { name: /grid view/i });
    fireEvent.click(gridViewButton);
    expect(products[0].parentElement).toHaveClass('MuiGrid-grid-md-4');
  });

  // Test case PL_ERROR_001
  test('handles API error gracefully with proper accessibility', async () => {
    server.use(
      http.get('http://localhost:3000/api/products', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<ProductList />);
    
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Test error message accessibility
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveAttribute('aria-live', 'assertive');
    expect(errorAlert).toHaveTextContent(/failed to load products/i);

    // Test focus management after error
    expect(document.activeElement).toBe(errorAlert);

    // Test error recovery UI
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveAttribute('aria-label', 'Retry loading products');
  });
});
