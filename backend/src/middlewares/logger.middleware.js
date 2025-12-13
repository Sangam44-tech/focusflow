// backend/src/middlewares/logger.middleware.js
import { v4 as uuidv4 } from 'uuid';

export const requestLogger = (req, res, next) => {
  const requestId = uuidv4();
  const startTime = Date.now();
  
  req.requestId = requestId;
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${requestId} --> ${req.method} ${req.path}`);
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    
    console.log(
      `[${new Date().toISOString()}] ${requestId} <-- ${res.statusCode} ${duration}ms [${logLevel}]`
    );
  });
  
  next();
};