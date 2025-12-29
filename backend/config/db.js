const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

let sandboxPool = null;

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority'
        });
        console.log(`MongoDB: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error('MongoDB:', err.message);
        return null;
    }
};

const createPostgresPool = () => {
    if (!process.env.SANDBOX_DATABASE_URL) {
        console.error('SANDBOX_DATABASE_URL missing');
        return null;
    }

    try {
        const pool = new Pool({
            connectionString: process.env.SANDBOX_DATABASE_URL,
        });

        pool.query('SELECT 1', (err) => {
            err 
                ? console.error('PostgreSQL test failed:', err.message)
                : console.log('PostgreSQL connected');
        });

        pool.on('error', (err) => {
            console.error('PostgreSQL pool error:', err.message);
        });

        return pool;
    } catch (error) {
        console.error('PostgreSQL pool creation failed:', error.message);
        return null;
    }
};

sandboxPool = createPostgresPool();

module.exports = { connectMongoDB, sandboxPool };
