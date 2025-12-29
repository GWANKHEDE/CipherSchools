const mongoose = require('mongoose');
const { Pool } = require('pg');

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ciphersql', {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('Error: MongoDB not connected. Please make sure MongoDB is running locally or set MONGO_URI in .env to your Atlas connection string.');
        console.error(`Reason: ${err.message}`);
        process.exit(1);
    }
};

const sandboxPool = new Pool({
    connectionString: process.env.SANDBOX_DATABASE_URL,
});

sandboxPool.on('error', (err) => {
    console.error('Unexpected error on idle sandbox client', err);
    process.exit(-1);
});

module.exports = {
    connectMongoDB,
    sandboxPool
};
