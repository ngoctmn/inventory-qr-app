#!/bin/bash

# Test script for Inventory QR App

echo "🧪 Testing Inventory QR App"
echo "==========================="

# Check environment
echo "📋 Checking environment..."

# Check Node version
NODE_VERSION=$(node --version)
echo "✓ Node version: $NODE_VERSION"

# Check pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo "✓ pnpm version: $PNPM_VERSION"
else
    echo "❌ pnpm not found"
    exit 1
fi

# Check .env.local
if [ -f .env.local ]; then
    echo "✓ .env.local exists"
    # Check if Supabase vars are set
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=https://" .env.local; then
        echo "✓ Supabase URL configured"
    else
        echo "❌ Supabase URL not configured"
    fi
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=ey" .env.local; then
        echo "✓ Supabase Key configured"
    else
        echo "❌ Supabase Key not configured"
    fi
else
    echo "❌ .env.local not found"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use"
    echo "Killing existing process..."
    kill $(lsof -Pi :3000 -sTCP:LISTEN -t)
    sleep 2
fi

echo ""
echo "✅ Environment check complete!"
echo ""
echo "📝 Instructions:"
echo "1. Copy content from database-setup.sql"
echo "2. Paste into Supabase SQL Editor and RUN"
echo "3. Start the app: pnpm dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "🚀 Starting development server..."
pnpm dev