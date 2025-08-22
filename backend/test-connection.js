const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI ? 'URI loaded' : 'URI missing');

const testConnection = async () => {
  try {
    console.log('Attempting to connect...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
