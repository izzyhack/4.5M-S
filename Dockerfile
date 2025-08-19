# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install git (required for git operations)
RUN apk add --no-cache git

# Create logs directory
RUN mkdir -p logs

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY .env.example ./.env

# Create non-root user for security
RUN addgroup -g 1001 -S quoter && \
    adduser -S quoter -u 1001 -G quoter && \
    chown -R quoter:quoter /app

# Switch to non-root user
USER quoter

# Configure git for the container
RUN git config --global user.name "Quote Committer Bot" && \
    git config --global user.email "quotes@container.local" && \
    git config --global init.defaultBranch main

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check: OK')" || exit 1

# Default environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV DEV_MODE=true
ENV DEV_INTERVAL=5000
ENV AUTO_PUSH=false

# Expose port for potential future web interface
EXPOSE 3000

# Start the quote committer
CMD ["node", "src/quote-committer.js"]