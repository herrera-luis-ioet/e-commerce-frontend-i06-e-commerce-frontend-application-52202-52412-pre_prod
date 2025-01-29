import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { fetchProducts, getProduct } from '../services/api';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Mock data
const mockProducts = [
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

const mockProduct = {
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

// Setup MSW server
const server = setupServer(
  // GET /products handler
  http.get(`${BASE_URL}/products`, () => {
    return HttpResponse.json(mockProducts);
  }),
  
  // GET /products/:id handler
  http.get(`${BASE_URL}/products/:id`, ({ params }) => {
    const { id } = params;
    if (id === '1') {
      return HttpResponse.json(mockProduct);
    }
    return new HttpResponse(null, { status: 404 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Service Integration Tests', () => {
  // Test case API_INT_001
  test('successfully fetches all products', async () => {
    const products = await fetchProducts();
    expect(products).toEqual(mockProducts);
    expect(products.length).toBe(2);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('description');
    expect(products[0]).toHaveProperty('price');
    expect(products[0]).toHaveProperty('stock');
    expect(products[0]).toHaveProperty('category');
    expect(products[0]).toHaveProperty('image');
  });

  // Test case API_INT_002
  test('successfully fetches a single product by ID', async () => {
    const product = await getProduct('1');
    expect(product).toEqual(mockProduct);
    expect(product.id).toBe('1');
    expect(product.specifications).toHaveLength(2);
    expect(product.specifications[0]).toHaveProperty('name');
    expect(product.specifications[0]).toHaveProperty('value');
  });

  // Test case API_INT_003
  test('handles network error when fetching products', async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () => {
        return new HttpResponse(JSON.stringify({ error: 'Internal Server Error' }), {
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );

    try {
      await fetchProducts();
      fail('Expected fetchProducts to throw');
    } catch (error) {
      expect(error.name).toBe('APIError');
      expect(error.type).toBe('SERVER_ERROR');
      expect(error.status).toBe(500);
      expect(error.message).toContain('Internal Server Error');
    }
  });

  // Test case API_INT_004
  test('handles invalid product ID', async () => {
    try {
      await getProduct('');
      fail('Expected getProduct to throw for empty ID');
    } catch (error) {
      expect(error.name).toBe('APIError');
      expect(error.type).toBe('INVALID_PARAMS');
      expect(error.status).toBe(400);
      expect(error.message).toBe('Product ID is required');
    }

    server.use(
      http.get(`${BASE_URL}/products/999`, () => {
        return new HttpResponse(JSON.stringify({ message: 'Product not found' }), {
          status: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );

    try {
      await getProduct('999');
      fail('Expected getProduct to throw for non-existent ID');
    } catch (error) {
      expect(error.name).toBe('APIError');
      expect(error.type).toBe('NOT_FOUND');
      expect(error.status).toBe(404);
      expect(error.message).toContain('Product not found');
    }
  });

  // Test case API_INT_005
  test('handles API server error response', async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () => {
        return new HttpResponse(JSON.stringify({ 
          error: 'Server Error',
          message: 'Database connection failed'
        }), {
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );

    try {
      await fetchProducts();
      fail('Expected fetchProducts to throw');
    } catch (error) {
      expect(error.name).toBe('APIError');
      expect(error.type).toBe('SERVER_ERROR');
      expect(error.status).toBe(500);
      expect(error.message).toContain('Database connection failed');
    }
  });

  // Test case API_INT_006
  test('handles malformed API response', async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () => {
        return new HttpResponse('Invalid JSON', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );

    try {
      await fetchProducts();
      fail('Expected fetchProducts to throw');
    } catch (error) {
      expect(error.name).toBe('APIError');
      expect(error.type).toBe('INVALID_RESPONSE');
      expect(error.message).toContain('Invalid JSON response');
    }
  });

  // Test case API_INT_009
  test('handles unauthorized access', async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () => {
        return new HttpResponse(JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Authentication required'
        }), {
          status: 401,
          statusText: 'Unauthorized',
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );

    try {
      await fetchProducts();
      fail('Expected fetchProducts to throw');
    } catch (error) {
      expect(error.name).toBe('APIError');
      expect(error.type).toBe('UNAUTHORIZED');
      expect(error.status).toBe(401);
      expect(error.message).toContain('Authentication required');
    }
  });

  // Test case API_INT_007
  test('handles empty product list response', async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () => {
        return HttpResponse.json([]);
      })
    );

    const products = await fetchProducts();
    expect(products).toEqual([]);
  });

  // Test case API_INT_008
  test('handles timeout error', async () => {
    server.use(
      http.get(`${BASE_URL}/products`, async () => {
        await new Promise(resolve => setTimeout(resolve, 6000)); // Longer than fetch timeout
        return HttpResponse.json(mockProducts);
      })
    );

    await expect(fetchProducts()).rejects.toThrow('Failed to fetch products');
  }, 7000);
});
