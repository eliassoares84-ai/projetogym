#!/bin/bash
set -e

echo "🚀 Starting Projeto Fitness Backend Deployment"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run Prisma migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Seed database if needed
echo "🌱 Database setup complete"

echo "✅ Deployment successful!"
