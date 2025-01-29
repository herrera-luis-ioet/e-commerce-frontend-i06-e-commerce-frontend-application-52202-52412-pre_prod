// PUBLIC_INTERFACE
/**
 * API service for handling product-related API calls
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const TIMEOUT_DURATION = 10000; // 10 seconds timeout

/**
 * Custom error class for API errors
 * @extends Error
 */
class APIError extends Error {
  /**
   * Create an APIError
   * @param {string} message - Error message
   * @param {number} status - HTTP status code
   * @param {string} type - Error type identifier
   * @param {Object} [details] - Additional error details
   * @throws {TypeError} If required parameters are missing or of wrong type
   */
  constructor(message, status, type, details = {}) {
    if (!message || typeof message !== 'string') {
      throw new TypeError('Error message must be a non-empty string');
    }
    if (typeof status !== 'number' || status < 0) {
      throw new TypeError('Status must be a non-negative number');
    }
    if (!type || typeof type !== 'string') {
      throw new TypeError('Error type must be a non-empty string');
    }
    if (typeof details !== 'object' || Array.isArray(details)) {
      throw new TypeError('Details must be an object');
    }

    super(message);
    this.name = 'APIError';
    this.status = status;
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // Flag for operational vs programmer errors
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }

    // Add request context if available
    if (details.request) {
      this.request = {
        url: details.request.url,
        method: details.request.method,
        headers: details.request.headers
      };
    }

    // Add response context if available
    if (details.response) {
      this.response = {
        status: details.response.status,
        statusText: details.response.statusText,
        headers: details.response.headers
      };
    }

    // Freeze the error instance to prevent modifications
    Object.freeze(this);
  }

  /**
   * Get error category based on status code
   * @returns {string} Error category
   */
  getCategory() {
    if (this.status === 0) return 'Network';
    if (this.status >= 500) return 'Server';
    if (this.status >= 400) return 'Client';
    return 'Unknown';
  }

  /**
   * Check if error is a specific type
   * @param {string} type - Error type to check against
   * @returns {boolean} True if error is of specified type
   */
  isType(type) {
    return this.type === type;
  }

  /**
   * Check if error is a network error
   * @returns {boolean} True if error is a network error
   */
  isNetworkError() {
    return this.type === ErrorTypes.NETWORK_ERROR;
  }

  /**
   * Check if error is a server error
   * @returns {boolean} True if error is a server error
   */
  isServerError() {
    return this.type === ErrorTypes.SERVER_ERROR || this.status >= 500;
  }

  /**
   * Check if error is a client error
   * @returns {boolean} True if error is a client error
   */
  isClientError() {
    return this.type === ErrorTypes.CLIENT_ERROR || (this.status >= 400 && this.status < 500);
  }

  /**
   * Check if error is a timeout error
   * @returns {boolean} True if error is a timeout error
   */
  isTimeoutError() {
    return this.type === ErrorTypes.TIMEOUT_ERROR;
  }

  /**
   * Creates a formatted error object for client consumption
   * @returns {Object} Formatted error object
   */
  toJSON() {
    return {
      message: this.message,
      type: this.type,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

/**
 * Error types enum for API errors
 * @readonly
 * @enum {string}
 */
export const ErrorTypes = {
  NETWORK_ERROR: 'NetworkError',
  SERVER_ERROR: 'ServerError',
  CLIENT_ERROR: 'ClientError',
  TIMEOUT_ERROR: 'TimeoutError',
  VALIDATION_ERROR: 'ValidationError',
  NOT_FOUND: 'NotFoundError',
  UNAUTHORIZED: 'UnauthorizedError',
  FORBIDDEN: 'ForbiddenError',
  INVALID_RESPONSE: 'InvalidResponseError',
  INVALID_PARAMS: 'InvalidParamsError',
  UNKNOWN_ERROR: 'UnknownError'
};

/**
 * Handles API response and throws appropriate error
 * @param {Response} response - Fetch API response object
 * @returns {Promise} Promise that resolves with JSON data or rejects with APIError
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || 'An error occurred';
    } catch {
      errorMessage = await response.text().catch(() => 'Unknown error');
    }

    const errorType = 
      response.status === 404 ? ErrorTypes.NOT_FOUND :
      response.status === 401 ? ErrorTypes.UNAUTHORIZED :
      response.status === 403 ? ErrorTypes.FORBIDDEN :
      response.status === 408 ? ErrorTypes.TIMEOUT :
      response.status === 422 ? ErrorTypes.VALIDATION_ERROR :
      response.status >= 500 ? ErrorTypes.SERVER_ERROR :
      ErrorTypes.UNKNOWN_ERROR;

    const details = {
      statusText: response.statusText,
      url: response.url,
      method: response.type
    };

    throw new APIError(
      `Request failed: ${errorMessage}`,
      response.status,
      errorType,
      details
    );
  }
  
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new APIError(
      'Invalid JSON response from server',
      response.status,
      ErrorTypes.INVALID_RESPONSE,
      { originalError: error.message }
    );
  }
};

/**
 * Fetch with timeout wrapper
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} Promise that resolves with fetch response or rejects with timeout error
 */
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', 408, ErrorTypes.TIMEOUT_ERROR, {
        timeoutDuration: TIMEOUT_DURATION,
        type: 'TimeoutError'
      });
    }
    throw new APIError(
      'Network error',
      0,
      error.message.includes('Failed to fetch') ? ErrorTypes.NETWORK_ERROR : ErrorTypes.UNKNOWN_ERROR,
      { originalError: error.message }
    );
  }
};

/**
 * Fetch all products from the API
 * @returns {Promise} Promise object representing the products data
 * @throws {APIError} When the request fails
 */
export const fetchProducts = async () => {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/products`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      'Failed to fetch products: ' + (error.message || 'Unknown error'),
      0,
      error.name === 'AbortError' ? ErrorTypes.TIMEOUT : ErrorTypes.NETWORK_ERROR,
      { originalError: error.message }
    );
  }
};

/**
 * Fetch a single product by ID from the API
 * @param {string} id - The ID of the product to fetch
 * @returns {Promise} Promise object representing the product data
 * @throws {APIError} When the request fails
 */
export const getProduct = async (id) => {
  if (!id) {
    throw new APIError('Product ID is required', 400, ErrorTypes.INVALID_PARAMS, {
      param: 'id',
      value: id
    });
  }
  
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/products/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching product:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      'Failed to fetch product: ' + (error.message || 'Unknown error'),
      0,
      error.name === 'AbortError' ? ErrorTypes.TIMEOUT : ErrorTypes.NETWORK_ERROR,
      { originalError: error.message, productId: id }
    );
  }
};

export default {
  fetchProducts,
  getProduct,
};
