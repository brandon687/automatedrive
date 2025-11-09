#!/bin/bash

# Fresh Railway Deployment Script
# Run this after creating new Railway project in dashboard

set -e

echo "🚀 DealerTrade Fresh Railway Deployment"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found${NC}"
    echo "Install it: https://docs.railway.app/develop/cli"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking project structure...${NC}"
if [ ! -f "backend/package.json" ]; then
    echo -e "${RED}❌ Must run from project root (/Users/brandonin/drl)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Project structure OK${NC}"
echo ""

echo -e "${BLUE}Step 2: Checking migrations...${NC}"
if [ ! -d "backend/prisma/migrations/20251109111653_init" ]; then
    echo -e "${RED}❌ Clean migration not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Clean migration ready: 20251109111653_init${NC}"
echo ""

echo -e "${BLUE}Step 3: Checking configuration files...${NC}"
if [ ! -f "nixpacks.toml" ]; then
    echo -e "${RED}❌ nixpacks.toml not found${NC}"
    exit 1
fi
if [ ! -f "railway.json" ]; then
    echo -e "${RED}❌ railway.json not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Configuration files OK${NC}"
echo ""

echo -e "${YELLOW}⚠️  IMPORTANT: Have you created the new Railway project?${NC}"
echo "   1. Go to https://railway.app/dashboard"
echo "   2. Create new project: 'dealertrade-fresh'"
echo "   3. Add PostgreSQL database"
echo "   4. Add empty service named 'backend'"
echo "   5. Set Root Directory to 'backend' in service settings"
echo "   6. Add DATABASE_URL reference to PostgreSQL"
echo ""
read -p "Press ENTER when ready to continue (or Ctrl+C to cancel)..."
echo ""

echo -e "${BLUE}Step 4: Linking to Railway project...${NC}"
echo "You'll be prompted to select your project and service"
railway link

echo ""
echo -e "${BLUE}Step 5: Verifying Railway connection...${NC}"
if railway status | grep -q "Service:"; then
    echo -e "${GREEN}✓ Successfully linked to Railway${NC}"
else
    echo -e "${RED}❌ Railway link failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 6: Deploying to Railway...${NC}"
railway up

echo ""
echo -e "${BLUE}Step 7: Getting deployment URL...${NC}"
DOMAIN=$(railway domain 2>&1)
if echo "$DOMAIN" | grep -q "https://"; then
    URL=$(echo "$DOMAIN" | grep -o 'https://[^ ]*')
    echo -e "${GREEN}✓ Deployment URL: $URL${NC}"
else
    echo -e "${YELLOW}⚠️  Generating domain...${NC}"
    railway domain
    sleep 2
    URL=$(railway domain 2>&1 | grep -o 'https://[^ ]*' | head -1)
fi
echo ""

echo -e "${BLUE}Step 8: Waiting for deployment to complete (30s)...${NC}"
sleep 30
echo ""

echo -e "${BLUE}Step 9: Testing deployment...${NC}"
if command -v curl &> /dev/null && [ ! -z "$URL" ]; then
    echo "Testing health endpoint..."
    HEALTH=$(curl -s -w "\n%{http_code}" "$URL/health" 2>/dev/null | tail -1)

    if [ "$HEALTH" = "200" ]; then
        echo -e "${GREEN}✓ Health check passed!${NC}"
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${GREEN}Your API is live at:${NC}"
        echo -e "${BLUE}$URL${NC}"
        echo ""
        echo -e "${GREEN}Test it:${NC}"
        echo "  curl $URL/health"
        echo "  curl $URL/"
        echo ""
    else
        echo -e "${YELLOW}⚠️  Health check returned: $HEALTH${NC}"
        echo "   Deployment may still be starting..."
        echo "   Check logs: railway logs"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping automatic health check${NC}"
fi

echo -e "${BLUE}Step 10: Viewing logs...${NC}"
echo "   Press Ctrl+C to exit logs"
echo ""
sleep 2
railway logs

echo ""
echo -e "${GREEN}Deployment script completed!${NC}"
