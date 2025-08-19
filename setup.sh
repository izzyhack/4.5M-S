#!/bin/bash

# Autonomous Tech Quote Committer Setup Script
# This script sets up the quote committer system for various deployment scenarios

set -e  # Exit on any error

echo "🚀 Setting up Autonomous Tech Quote Committer..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git and try again."
    exit 1
fi

echo "✅ Git $(git --version | cut -d' ' -f3) detected"

# Install npm dependencies
echo "📦 Installing dependencies..."
npm install

# Create logs directory
mkdir -p logs

# Setup environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env
    echo "✅ Created .env file. Please review and modify as needed."
else
    echo "✅ Environment file already exists"
fi

# Configure git if not already configured
if ! git config user.name &> /dev/null; then
    echo "⚙️  Configuring git user..."
    git config user.name "Quote Committer Bot"
    git config user.email "quotes@local.example"
    echo "✅ Git user configured"
fi

# Test the application
echo "🧪 Running basic tests..."
npm test

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Available commands:"
echo "  npm start              - Start the quote committer (4.5ms intervals - HIGH FREQUENCY!)"
echo "  npm run dev            - Start in development mode (5 second intervals)"
echo "  node src/quote-committer.js --help  - Show help"
echo ""
echo "Deployment options:"
echo "  Docker:     docker-compose up"
echo "  Systemd:    sudo npm run install-service && sudo systemctl start quote-committer"
echo ""
echo "⚠️  WARNING: The default 4.5ms interval creates ~222 commits per second!"
echo "⚠️  Use development mode for testing: npm run dev"
echo ""
echo "Configuration file: .env"
echo "View logs: tail -f logs/quote-committer.log"