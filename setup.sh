#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Create database
echo "Creating database..."
psql -U postgres -c "CREATE DATABASE burger_shop;" || true

# Run database migrations
echo "Running database migrations..."
psql -U postgres -d burger_shop -f src/database/schema.sql
psql -U postgres -d burger_shop -f src/database/init.sql

echo "Setup complete!" 