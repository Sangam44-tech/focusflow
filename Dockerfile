# Multi-stage build for production
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./
RUN npx prisma generate

FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

# Copy backend files
COPY --from=backend-build /app/backend ./backend

# Copy frontend build (optional for serving static files)
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Set working directory to backend
WORKDIR /app/backend

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5000
CMD ["npm", "start"]