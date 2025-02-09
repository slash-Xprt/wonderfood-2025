import { Router, Request, Response, NextFunction } from 'express';
import { validateOrder } from '../middleware/validation';
import { emitNewOrder, emitOrderUpdate } from '../services/socket';
import prisma from '../lib/prisma';
import { CreateOrderInput, OrderStatus } from '../types/orders';

const router = Router();

// Get all orders
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Fetching all orders...');
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(`Successfully fetched ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    next(error);
  }
});

// Create a new order
router.post('/', validateOrder, async (req: Request<{}, {}, CreateOrderInput>, res: Response, next: NextFunction) => {
  try {
    console.log('Creating new order:', req.body);
    
    const { customerInfo, items, total } = req.body;
    
    const order = await prisma.order.create({
      data: {
        customerInfo,
        total,
        status: 'pending',
        items: {
          create: items.map(item => ({
            quantity: item.quantity,
            price: item.price,
            product: {
              connect: { id: item.productId }
            }
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    console.log('Order created successfully:', order.id);
    
    // Emit new order event
    emitNewOrder(order);
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    next(error);
  }
});

// Get order by id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Fetching order by ID:', req.params.id);
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!order) {
      console.log('Order not found:', req.params.id);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log('Order found:', order.id);
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    next(error);
  }
});

// Update order status
router.patch('/:id/status', async (req: Request<{ id: string }, {}, { status: OrderStatus }>, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    console.log('Updating order status:', { orderId: req.params.id, status });
    
    const validStatuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      console.log('Invalid status provided:', status);
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      console.log('Order not found for status update:', req.params.id);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Order status updated successfully:', order.id);
    // Emit order update event
    emitOrderUpdate(order);
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    next(error);
  }
});

// Get orders by status
router.get('/status/:status', async (req: Request<{ status: OrderStatus }>, res: Response, next: NextFunction) => {
  try {
    const { status } = req.params;
    console.log('Fetching orders by status:', status);
    
    const validStatuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      console.log('Invalid status provided:', status);
      return res.status(400).json({ message: 'Invalid status' });
    }

    const orders = await prisma.order.findMany({
      where: { status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Found ${orders.length} orders with status:`, status);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    next(error);
  }
});

export default router; 