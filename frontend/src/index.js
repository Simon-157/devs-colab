//libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

//styles
import "./global/global.scss";
import "./index.css"

//components
import App from './App';
import ErrorBoundary from './pages/errors/error-boundary/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

