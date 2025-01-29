import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProductCard from '../components/products/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  stock: 10,
  image: 'https://test.com/image.jpg'
};

describe('ProductCard Component', () => {
  test('should render correctly in grid view', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} viewMode="grid" />
      </BrowserRouter>
    );
    
    const card = screen.getByRole('img').closest('div');
    expect(card).toHaveStyle({ display: 'block' });
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });

  test('should render correctly in list view', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} viewMode="list" />
      </BrowserRouter>
    );
    
    const card = screen.getByRole('img').closest('div');
    expect(card).toHaveStyle({ display: 'flex' });
  });

  test('should use placeholder image when no image provided', () => {
    const productWithoutImage = { ...mockProduct, image: undefined };
    render(
      <BrowserRouter>
        <ProductCard product={productWithoutImage} viewMode="grid" />
      </BrowserRouter>
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/200');
  });

  test('should display all product information', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} viewMode="grid" />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });
});
