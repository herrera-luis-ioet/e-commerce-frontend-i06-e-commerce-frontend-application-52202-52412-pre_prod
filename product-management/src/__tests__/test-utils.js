import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme();

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Helper function to setup userEvent
export const setup = (jsx) => {
  return {
    user: userEvent.setup(),
    ...customRender(jsx),
  };
};

// Helper function for async events
export const waitForLoadingToFinish = () =>
  waitFor(
    () => {
      const loader = screen.queryByRole('progressbar');
      if (loader) {
        throw new Error('Still loading');
      }
    },
    { timeout: 4000 }
  );

// Helper function to simulate API errors
export const simulateNetworkError = async (promise) => {
  try {
    await promise;
  } catch (error) {
    if (error.name === 'NetworkError') {
      return error;
    }
    throw error;
  }
};

// Helper function for form interactions
export const fillForm = async (user, fields) => {
  for (const [fieldName, value] of Object.entries(fields)) {
    const input = screen.getByLabelText(fieldName);
    await user.clear(input);
    await user.type(input, value);
  }
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
