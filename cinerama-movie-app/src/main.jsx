// Entry point for the React application. This file sets up the React environment and renders the main App component into the root DOM node.



import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import App from './App.jsx';

import './index.css';

import './auth.css';


createRoot(document.getElementById('root')).render(

  <App />
  
)
