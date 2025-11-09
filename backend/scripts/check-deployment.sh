#!/bin/bash
# Check Railway Deployment Status

echo "🔍 Checking Railway Deployment Status"
echo "======================================"
echo ""

# Project details
PROJECT_ID="4ed977a7-234c-453a-8ad9-c373e81e82bb"
SERVICE_ID="0e4e3d63-e3c1-4c5e-8002-3c92cec531bd"
DEPLOYMENT_ID="ef4db719-f238-424f-b493-28791c0aa192"

echo "Project: dealertrade"
echo "Service ID: $SERVICE_ID"
echo "Deployment ID: $DEPLOYMENT_ID"
echo ""
echo "Build Logs URL:"
echo "https://railway.com/project/$PROJECT_ID/service/$SERVICE_ID?id=$DEPLOYMENT_ID"
echo ""
echo "---"
echo ""

# Try to get logs via railway CLI with explicit service
echo "Attempting to fetch logs..."
echo ""

# Use railway list to see services
echo "Available services:"
railway list 2>/dev/null || echo "Failed to list services"
echo ""

# Try to check if deployment is complete
echo "Checking deployment status..."
echo "Please visit the Build Logs URL above to monitor the deployment."
echo ""

# Try to get domain
echo "Service URL (when deployed):"
echo "Check Railway dashboard for the public URL"
echo ""

echo "---"
echo ""
echo "Manual Steps:"
echo "1. Visit: https://railway.com/project/$PROJECT_ID"
echo "2. Click on your service"
echo "3. Check the 'Deployments' tab"
echo "4. View build logs for deployment: $DEPLOYMENT_ID"
echo "5. Once deployed, find your public URL in 'Settings' > 'Networking'"
echo ""
echo "Expected startup sequence:"
echo "  ✓ Build: npm ci"
echo "  ✓ Build: npx prisma generate"
echo "  ✓ Build: npm run build"
echo "  ✓ Start: npx prisma migrate deploy"
echo "  ✓ Start: node dist/index.js"
echo "  ✓ Server: 🚀 Server running on port 3000"
echo ""
