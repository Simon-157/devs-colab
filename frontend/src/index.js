//libraries
import React from 'react';
import ReactDOM from 'react-dom/client';
import  { QueryClientProvider, QueryClient } from "react-query"
import { ReactQueryDevtools } from 'react-query/devtools'

//styles
import "./global/global.scss";
import "./index.css"
import "./css/tailwind.css"

//components
import App from './App';
import ErrorBoundary from './pages/errors/error-boundary/ErrorBoundary';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client ={queryClient} >
        <App />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

