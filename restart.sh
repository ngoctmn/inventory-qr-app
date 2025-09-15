#!/bin/bash

echo "🔄 Restarting Inventory QR App..."

# Kill any existing Next.js process on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Stopping existing process on port 3000..."
    kill $(lsof -Pi :3000 -sTCP:LISTEN -t) 2>/dev/null
    sleep 2
fi

# Clear cache
echo "Clearing cache..."
rm -rf .next

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Start development server
echo "Starting development server..."
echo ""
echo "📱 App will be available at: http://localhost:3000"
echo "📊 First, make sure database is setup in Supabase"
echo ""

pnpm dev