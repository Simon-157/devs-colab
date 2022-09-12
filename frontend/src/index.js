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
import UserProvider from './contexts/userContext';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
     <ErrorBoundary>
      <QueryClientProvider client ={queryClient} >
      <UserProvider>
        <App />
        <ReactQueryDevtools />
      </UserProvider>
      </QueryClientProvider>
    </ErrorBoundary>
);

