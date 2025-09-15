#!/bin/bash

echo "🚀 Starting Inventory QR App"
echo "============================"

# Change to project directory
cd /Users/ngoctmn/Documents/development/inventory-qr-app

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Installing with npm..."
    npm install -g pnpm
fi

# Kill any existing process on port 3000
echo "🔄 Checking port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Stopping existing process..."
    kill -9 $(lsof -t -i:3000) 2>/dev/null
    sleep 2
fi

# Clean install
echo "📦 Installing dependencies..."
rm -rf node_modules .next package-lock.json pnpm-lock.yaml
pnpm install

# Check if installation succeeded
if [ ! -d "node_modules" ]; then
    echo "❌ Installation failed. Trying with npm..."
    npm install
fi

# Start the development server
echo ""
echo "🌐 Starting server..."
echo "====================="
pnpm dev

# If pnpm dev fails, try npm
if [ $? -ne 0 ]; then
    echo "Trying with npm run dev..."
    npm run dev
fi