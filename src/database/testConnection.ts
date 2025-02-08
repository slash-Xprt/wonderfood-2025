import { pool } from './connection.js';

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to the database');
        await client.query('SELECT NOW()');
        console.log('Successfully executed test query');
        await client.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
    } finally {
        await pool.end();
    }
}

testConnection(); 