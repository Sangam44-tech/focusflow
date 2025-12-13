// backend/server.js
import app from './src/app.js';
import { config } from './src/config/env.js';
import prisma from './src/config/database.js';

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();