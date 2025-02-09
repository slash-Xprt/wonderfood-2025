import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { emitProductUpdate, emitNewProduct, emitProductDeletion } from '../services/socket';
import prisma from '../lib/prisma';

const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  }
});

// Get all products
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Fetching all products from database...');
    const products = await prisma.product.findMany({
      orderBy: {
        category: 'asc'
      }
    });
    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
});

// Get product by id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Fetching product by ID:', req.params.id);
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!product) {
      console.log('Product not found:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    next(error);
  }
});

// Create new product
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Creating new product:', req.body);
    const newProduct = await prisma.product.create({
      data: {
        ...req.body,
        isActive: true
      }
    });
    
    // Emit WebSocket event
    emitNewProduct(newProduct);
    
    console.log('Product created successfully:', newProduct.id);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
});

// Update product
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);
    console.log('Updating product:', { id: productId, updates: req.body });
    
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: req.body
    });

    // Emit WebSocket event
    emitProductUpdate(updatedProduct);

    console.log('Product updated successfully:', productId);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    next(error);
  }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.id);
    console.log('Deleting product:', productId);
    
    await prisma.product.delete({
      where: { id: productId }
    });
    
    // Emit WebSocket event
    emitProductDeletion(productId);

    console.log('Product deleted successfully:', productId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    next(error);
  }
});

// Upload image
router.post('/upload', upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Processing image upload...');
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    // In a real app, you might want to use a CDN or cloud storage
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log('Image uploaded successfully:', imageUrl);
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    next(error);
  }
});

export default router; 