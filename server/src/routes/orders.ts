import { Router, Request, Response, NextFunction } from 'express';
import { validateOrder } from '../middleware/validation';
import { Order } from '../types/orders';

const router = Router();

// Store orders in memory (in a real app, this would be a database)
let orders: Order[] = [];

// Get all orders
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// Create a new order
router.post('/', validateOrder, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order: Order = {
      id: Date.now(),
      items: req.body.items,
      total: req.body.total,
      customerInfo: req.body.customerInfo,
      status: 'pending',
      createdAt: new Date()
    };
    
    orders.push(order);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// Get order by id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Update order status
router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const status = req.body.status;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    order.status = status;
    res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router; 