#!/bin/bash

echo "🚀 Setup Inventory QR App"
echo "========================="

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Check .env.local
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "Please create .env.local with:"
    echo "NEXT_PUBLIC_SUPABASE_URL=your_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key"
    exit 1
else
    echo "✅ .env.local found"
fi

# Build the app
echo "🔨 Building app..."
pnpm build

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to Supabase Dashboard > SQL Editor"
echo "2. Copy and run the SQL from setup.sql"
echo "3. Run: pnpm dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "🎯 Quick test:"
echo "- Create a cycle in Dashboard"
echo "- Upload sample Excel file"
echo "- Generate QR codes"
echo "- Test scanning"