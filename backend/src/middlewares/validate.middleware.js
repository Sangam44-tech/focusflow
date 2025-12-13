// backend/src/middlewares/validate.middleware.js
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    req.body = validated; // Replace with validated/sanitized data
    next();
  } catch (error) {
    if (error.errors) {
      const errors = error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }));
      throw new ApiError(400, 'Validation failed', errors);
    }
    throw new ApiError(400, 'Invalid request data');
  }
};