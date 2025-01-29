import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDetail from '../components/products/ProductDetail';
import { getProduct } from '../services/api';

// Mock the API module
jest.mock('../services/api');

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  description: 'Test product description',
  image: 'test-image.jpg',
  stock: 10,
  category: 'Test Category',
  specifications: [
    { name: 'Color', value: 'Blue' },
    { name: 'Size', value: 'Medium' }
  ]
};

const renderWithRouter = (ui, { route = '/products/1' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/products/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProductDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    getProduct.mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<ProductDetail />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays product details when data is loaded successfully', async () => {
    getProduct.mockResolvedValue(mockProduct);
    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    });

    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`In Stock (${mockProduct.stock})`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    
    // Check specifications
    mockProduct.specifications.forEach(spec => {
      expect(screen.getByText(spec.name)).toBeInTheDocument();
      expect(screen.getByText(spec.value)).toBeInTheDocument();
    });
  });

  test('displays error message when API call fails', async () => {
    const errorMessage = 'Failed to load product details';
    getProduct.mockRejectedValue(new Error(errorMessage));
    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('displays "Product not found" when product data is null', async () => {
    getProduct.mockResolvedValue(null);
    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText('Product not found')).toBeInTheDocument();
    });
  });

  test('navigates back when back button is clicked', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    getProduct.mockResolvedValue(mockProduct);
    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText('Back to Products')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Back to Products'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('handles product with missing optional fields', async () => {
    const incompleteProduct = {
      id: '1',
      name: 'Test Product',
      price: 99.99,
      description: 'Test product description',
      stock: 0
    };

    getProduct.mockResolvedValue(incompleteProduct);
    renderWithRouter(<ProductDetail />);

    await waitFor(() => {
      expect(screen.getByText(incompleteProduct.name)).toBeInTheDocument();
    });

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument(); // Category should show N/A
  });

  test('makes API call with correct product ID from URL', async () => {
    const productId = '123';
    getProduct.mockResolvedValue(mockProduct);
    renderWithRouter(<ProductDetail />, { route: `/products/${productId}` });

    await waitFor(() => {
      expect(getProduct).toHaveBeenCalledWith(productId);
    });
  });

  test('updates product details when product ID changes', async () => {
    const product1 = { ...mockProduct, id: '1', name: 'Product 1' };
    const product2 = { ...mockProduct, id: '2', name: 'Product 2' };

    getProduct
      .mockResolvedValueOnce(product1)
      .mockResolvedValueOnce(product2);

    const { rerender } = renderWithRouter(<ProductDetail />, { route: '/products/1' });

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    rerender(
      <MemoryRouter initialEntries={['/products/2']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });
});
