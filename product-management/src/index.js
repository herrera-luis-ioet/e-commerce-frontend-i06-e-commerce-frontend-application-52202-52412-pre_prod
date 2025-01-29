import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './components/ErrorBoundary';

// Initialize the application with error handling
const initializeApp = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found. Application cannot be initialized.');
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );

    // Report web vitals for performance monitoring
    reportWebVitals(console.log);
  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Display a user-friendly error message
    document.body.innerHTML = `
      <div role="alert" style="padding: 20px; margin: 20px; border: 1px solid #ff0000; border-radius: 4px; background-color: #fff5f5;">
        <h2>Application Error</h2>
        <p>We're sorry, but the application failed to load. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background-color: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
};

// Start the application
initializeApp();
