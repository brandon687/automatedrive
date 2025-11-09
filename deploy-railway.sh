#!/bin/bash

# DealerTrade Railway Deployment Script
# This script helps deploy both backend and frontend to Railway

set -e  # Exit on error

echo "🚀 DealerTrade Railway Deployment Script"
echo "=========================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if logged in
echo "📝 Checking Railway login status..."
railway whoami || {
    echo "❌ Not logged in to Railway. Please run: railway login"
    exit 1
}

echo "✅ Logged in to Railway!"
echo ""

# Check if git repo is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - DealerTrade platform"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository exists"
fi

echo ""
echo "📋 Deployment Options:"
echo "1. Deploy Backend only"
echo "2. Deploy Frontend only"
echo "3. Deploy Both (Recommended)"
echo "4. Exit"
echo ""
read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Deploying Backend..."
        cd backend
        railway up
        echo "✅ Backend deployed!"
        echo "🔗 Get your backend URL: railway open"
        ;;
    2)
        echo ""
        echo "🎨 Deploying Frontend..."
        echo "⚠️  Make sure to set VITE_API_URL environment variable!"
        read -p "Enter your backend URL (e.g., https://xxx.railway.app): " BACKEND_URL
        cd frontend
        railway variables set VITE_API_URL="$BACKEND_URL/api"
        railway up
        echo "✅ Frontend deployed!"
        echo "🔗 Get your frontend URL: railway open"
        ;;
    3)
        echo ""
        echo "🚀 Deploying Backend first..."
        cd backend

        # Check if project is linked
        if ! railway status &> /dev/null; then
            echo "🔗 Linking to Railway project..."
            railway link
        fi

        # Set backend environment variables
        echo "🔧 Setting backend environment variables..."
        railway variables set PORT=3000
        railway variables set NODE_ENV=production
        railway variables set AUTO_DEV_API_KEY=sk_ad_i8ttO7rJHcoeeRHVUMHver41

        echo "📦 Deploying backend..."
        railway up

        echo "✅ Backend deployed!"
        echo ""
        echo "⏳ Waiting for backend to be ready..."
        sleep 5

        # Get backend URL
        BACKEND_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4 | head -1)

        if [ -z "$BACKEND_URL" ]; then
            echo "⚠️  Could not auto-detect backend URL"
            read -p "Enter your backend URL: " BACKEND_URL
        else
            echo "✅ Backend URL: $BACKEND_URL"
        fi

        echo ""
        echo "🎨 Deploying Frontend..."
        cd ../frontend

        # Check if project is linked
        if ! railway status &> /dev/null; then
            echo "🔗 Linking to Railway project..."
            railway link
        fi

        # Set frontend environment variables
        echo "🔧 Setting frontend environment variables..."
        railway variables set VITE_API_URL="$BACKEND_URL/api"

        echo "📦 Deploying frontend..."
        railway up

        echo "✅ Frontend deployed!"
        echo ""
        echo "🎉 Deployment Complete!"
        echo "=========================================="
        echo "Backend:  $BACKEND_URL"
        echo "Frontend: (check with: railway open)"
        echo ""
        echo "📝 Next Steps:"
        echo "1. Run database migrations: cd backend && railway run npx prisma migrate deploy"
        echo "2. Update backend FRONTEND_URL with your frontend Railway URL"
        echo "3. Test your live site!"
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "📖 For more details, see RAILWAY_DEPLOYMENT.md"
echo "🔗 Open Railway dashboard: https://railway.app/"
echo ""
