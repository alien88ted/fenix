#!/bin/bash
# Build script for Render deployment

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations if DATABASE_URL is set
if [ ! -z "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  npx prisma migrate deploy
else
  echo "Warning: DATABASE_URL not set, skipping migrations"
fi

# Build Next.js application
echo "Building Next.js application..."
npm run build

echo "Build complete!"