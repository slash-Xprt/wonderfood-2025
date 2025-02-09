import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { router } from './routes';
import { useProductStore } from './stores/useProductStore';
import { useOrderStore } from './stores/useOrderStore';
import './styles/index.css';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Initialize WebSocket connections
useProductStore.getState().initializeSocket();
useOrderStore.getState().initializeSocket();

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <Elements stripe={stripePromise}>
    <RouterProvider router={router} />
  </Elements>
);
