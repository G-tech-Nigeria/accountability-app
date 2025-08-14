#!/bin/bash

# 🚀 Accountability App Deployment Script

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Make sure you have your environment variables set up."
    echo "   Required variables:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your app is ready for deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Push your code to GitHub:"
    echo "   git add ."
    echo "   git commit -m 'Ready for deployment'"
    echo "   git push origin main"
    echo ""
    echo "2. Deploy to Vercel (Recommended):"
    echo "   - Go to https://vercel.com"
    echo "   - Import your GitHub repository"
    echo "   - Add environment variables"
    echo "   - Deploy!"
    echo ""
    echo "3. Or deploy to Netlify:"
    echo "   - Go to https://netlify.com"
    echo "   - Import your GitHub repository"
    echo "   - Configure build settings"
    echo "   - Deploy!"
    echo ""
    echo "📁 Built files are in the 'dist' directory"
    echo "🌐 Your app will be live in minutes!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
