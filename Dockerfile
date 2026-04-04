# ---- Stage 1: Build the Next.js Frontend ----
FROM node:20-alpine AS builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

# Copy all frontend files to the builder
COPY frontend/ .

# Build the Next.js app
RUN npm run build

# ---- Stage 2: Setup Python Backend & Serve ----
FROM python:3.13-slim

WORKDIR /app

# Install Node.js and Supervisor in the Python container
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs supervisor && \
    rm -rf /var/lib/apt/lists/*

# Copy backend dependencies and install
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application code
COPY backend/ ./backend/

# Copy frontend code, node_modules, and build output from Stage 1
COPY --from=builder /app/frontend/ ./frontend/

# Setup a supervisor configuration to run both Next.js and FastAPI
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose Next.js port and FastAPI port
EXPOSE 3000 3001

# Command to run supervisor, which will start both processes
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
