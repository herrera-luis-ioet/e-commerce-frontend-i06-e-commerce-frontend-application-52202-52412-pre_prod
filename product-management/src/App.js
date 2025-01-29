import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductManagement from './components/products';
import ProductDetail from './components/products/ProductDetail';
import ErrorBoundary from './components/ErrorBoundary';

// PUBLIC_INTERFACE
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div style={{ 
          backgroundColor: '#ADDFFF',
          minHeight: '100vh',
          padding: '20px'
        }}>
          <Routes>
            <Route path="/" element={<ProductManagement />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
