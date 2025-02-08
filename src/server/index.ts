import express, { Request, Response, NextFunction } from 'express';
import { pool } from '../database/connection.js';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface User {
  id: number;
  role: string;
}

interface AuthRequest extends Request {
  user?: User;
}

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env'
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user as User;
        next();
    });
};

// Test route
app.get('/api/test', (req: Request, res: Response) => {
    res.json({ message: 'Server is running!' });
});

// Admin login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        
        const user = result.rows[0];
        
        if (!user || !await bcrypt.compare(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Protected product management routes
app.post('/api/products', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    
    const { name, description, price, stock_quantity } = req.body;
    
    try {
        const result = await pool.query(
            'INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, stock_quantity]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Product routes
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Order routes
app.post('/api/orders', async (req, res) => {
    const { customerName, customerEmail, items } = req.body;
    
    try {
        const client = await pool.connect();
        
        await client.query('BEGIN');
        
        const orderResult = await client.query(
            'INSERT INTO orders (customer_name, customer_email, total_amount) VALUES ($1, $2, $3) RETURNING id',
            [customerName, customerEmail, 0]
        );
        
        const orderId = orderResult.rows[0].id;
        let totalAmount = 0;
        
        for (const item of items) {
            const productResult = await client.query(
                'SELECT price FROM products WHERE id = $1',
                [item.productId]
            );
            
            const price = productResult.rows[0].price;
            totalAmount += price * item.quantity;
            
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
                [orderId, item.productId, item.quantity, price]
            );
        }
        
        await client.query(
            'UPDATE orders SET total_amount = $1 WHERE id = $2',
            [totalAmount, orderId]
        );
        
        await client.query('COMMIT');
        res.json({ orderId, totalAmount });
    } catch (err) {
        await client?.query('ROLLBACK');
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update product
app.put('/api/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    
    const { id } = req.params;
    const { name, description, price, stock_quantity, image } = req.body;
    
    try {
        const result = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, image = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [name, description, price, stock_quantity, image, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 