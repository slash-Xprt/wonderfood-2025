import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { errorHandler } from '../../server/src/middleware/errorHandler';
import productRoutes from '../../server/src/routes/products';
import orderRoutes from '../../server/src/routes/orders';
import paymentRoutes from '../../server/src/routes/payment';

const api = express();

// Middleware
api.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

api.use(json());
api.use(urlencoded({ extended: true }));

// Routes
api.use('/products', productRoutes);
api.use('/orders', orderRoutes);
api.use('/payment', paymentRoutes);

// Error handling
api.use(errorHandler);

// Not found handler
api.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Export the serverless function
export const handler = serverless(api); 