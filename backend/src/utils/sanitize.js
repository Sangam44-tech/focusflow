// backend/src/utils/sanitize.js
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeHtml = (dirty) => {
  if (typeof dirty !== 'string') return dirty;
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 10000); // Max length
};

export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeString(obj);
  }
  
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    sanitized[key] = sanitizeObject(obj[key]);
  }
  return sanitized;
};