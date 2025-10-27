#!/bin/bash

# Credit Jambo Client App Environment Setup Script

echo "🚀 Setting up Credit Jambo Client App Environment"
echo "=================================================="

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "📋 Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo "⚠️  Please edit backend/.env with your actual values!"
else
    echo "✅ backend/.env already exists"
fi

echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your actual database credentials"
echo "2. Run 'npm run setup' to install dependencies and setup database"
echo "3. Run 'npm run dev' for development or 'npm run deploy' for Docker production"
echo ""

# Show current environment status
echo "📊 Current Environment Status:"
if [ -f "backend/.env" ]; then
    echo "✅ backend/.env: EXISTS"
else
    echo "❌ backend/.env: MISSING"
fi

if [ -d "backend/node_modules" ]; then
    echo "✅ Dependencies: INSTALLED"
else
    echo "❌ Dependencies: NOT INSTALLED (run: npm run setup)"
fi

echo ""
echo "🎯 Quick Start Commands:"
echo "Development: npm run dev"
echo "Docker Prod: npm run deploy"
echo "Database:    npm run db:studio"
