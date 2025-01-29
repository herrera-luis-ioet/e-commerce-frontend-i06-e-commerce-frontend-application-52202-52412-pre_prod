/**
 * Mock handlers for MSW (Mock Service Worker)
 * @module handlers
 */

import { http, HttpResponse } from 'msw';

/**
 * Mock product data for testing
 * @type {Array<Object>}
 */
export const mockProducts = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 99.99,
    stock: 10,
    category: 'electronics',
    image: 'https://via.placeholder.com/200'
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    price: 149.99,
    stock: 5,
    category: 'clothing',
    image: 'https://via.placeholder.com/200'
  }
];

/**
 * Mock single product data with specifications
 * @type {Object}
 */
export const mockProduct = {
  id: '1',
  name: 'Product 1',
  description: 'Description 1',
  price: 99.99,
  stock: 10,
  category: 'electronics',
  image: 'https://via.placeholder.com/200',
  specifications: [
    { name: 'Color', value: 'Black' },
    { name: 'Weight', value: '200g' }
  ]
};

/**
 * MSW request handlers for mocking API endpoints
 * @type {Array<RestHandler>}
 */
export const handlers = [
  // Get all products
  http.get('http://localhost:3000/api/products', () => {
    return HttpResponse.json(mockProducts);
  }),

  // Get single product
  http.get('http://localhost:3000/api/products/:id', ({ params }) => {
    const { id } = params;
    if (id === '1') {
      return HttpResponse.json(mockProduct);
    }
    return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
  }),

  // Filter products
  http.get('http://localhost:3000/api/products/filter', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const inStock = url.searchParams.get('inStock');
    
    let filteredProducts = [...mockProducts];
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (inStock !== null) {
      filteredProducts = filteredProducts.filter(p => (inStock === 'true' ? p.stock > 0 : p.stock === 0));
    }
    
    return HttpResponse.json(filteredProducts);
  })
];
