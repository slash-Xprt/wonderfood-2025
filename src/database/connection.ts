import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
    path: process.env.NODE_ENV === 'development' 
        ? path.join(__dirname, '../../.env.development')
        : path.join(__dirname, '../../.env')
});

const { Pool } = pg;

export const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    database: 'burger_shop',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Add error handling for connection issues
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
}); 