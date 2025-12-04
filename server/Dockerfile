# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm ci

# Install NestJS CLI globally for build command
RUN npm install -g @nestjs/cli

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy existing public directory with company images (will be overridden by volume mount in production)
COPY public ./public

# Expose port 4001 for NestJS
EXPOSE 4001

# Start the application
CMD ["npm", "run", "start:prod"]
