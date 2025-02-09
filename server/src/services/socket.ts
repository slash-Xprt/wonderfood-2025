import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { IOrder } from '../models/Order';
import { MenuItem } from '../types/menu';

let io: Server;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('join_admin', () => {
      socket.join('admin_room');
      console.log('Admin joined:', socket.id);
    });

    socket.on('join_order', (orderId: string) => {
      socket.join(`order_${orderId}`);
      console.log(`Client joined order room: ${orderId}`);
    });

    socket.on('join_products', () => {
      socket.join('products_room');
      console.log('Client joined products room:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Client disconnected:', socket.id, 'Reason:', reason);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export const emitOrderUpdate = (order: IOrder) => {
  if (!io) return;

  // Emit to admin room
  io.to('admin_room').emit('order_updated', order);
  
  // Emit to specific order room
  io.to(`order_${order._id}`).emit('order_updated', order);
};

export const emitNewOrder = (order: IOrder) => {
  if (!io) return;
  
  io.to('admin_room').emit('new_order', order);
};

export const emitProductUpdate = (product: MenuItem) => {
  if (!io) return;
  
  io.to('products_room').emit('product_updated', product);
  io.to('admin_room').emit('product_updated', product);
};

export const emitNewProduct = (product: MenuItem) => {
  if (!io) return;
  
  io.to('products_room').emit('product_created', product);
  io.to('admin_room').emit('product_created', product);
};

export const emitProductDeletion = (productId: number) => {
  if (!io) return;
  
  io.to('products_room').emit('product_deleted', productId);
  io.to('admin_room').emit('product_deleted', productId);
}; 