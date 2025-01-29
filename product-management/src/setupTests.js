import './__tests__/setup/msw-setup';
import './__tests__/setup/text-encoder';
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './__tests__/mocks/handlers';

// Setup MSW
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  // Enable request interception
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});



// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      /Warning: ReactDOM.render is no longer supported in React 18/.test(args[0]) ||
      /Warning: An update to .* inside a test was not wrapped in act/.test(args[0])
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
