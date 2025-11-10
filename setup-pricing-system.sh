#!/bin/bash

# DealerTrade Market Research System - Setup Script
# This script helps you set up the new pricing intelligence system

set -e

echo "=================================================="
echo "DealerTrade Market Research System Setup"
echo "=================================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_success "Running from correct directory"
echo ""

# Step 1: Check Node.js and npm
echo "Step 1: Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+ first."
    exit 1
fi
echo ""

# Step 2: Install backend dependencies
echo "Step 2: Installing backend dependencies..."
cd backend

if [ ! -d "node_modules" ]; then
    print_info "Installing npm packages..."
    npm install
else
    print_info "Node modules already installed, checking for new packages..."
    npm install
fi

# Install cheerio for web scraping
print_info "Installing cheerio for web scraping..."
npm install cheerio
npm install --save-dev @types/cheerio

print_success "Backend dependencies installed"
cd ..
echo ""

# Step 3: Database check
echo "Step 3: Checking database connection..."
cd backend

if [ -f ".env" ]; then
    print_success ".env file found"

    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL" .env; then
        print_success "DATABASE_URL configured"
    else
        print_warning "DATABASE_URL not found in .env"
        print_info "Please add your PostgreSQL connection string"
    fi
else
    print_error ".env file not found in backend directory"
    print_info "Copy .env.example to .env and configure your settings"
    exit 1
fi

cd ..
echo ""

# Step 4: Review Prisma schema
echo "Step 4: Reviewing Prisma schema updates..."
print_info "New models added:"
echo "  • MarketPriceSource - Individual price data from sources"
echo "  • MarketAnalysis - Aggregated pricing intelligence"
echo "  • PriceHistory - Historical price tracking"
echo "  • ComparableVehicle - Similar vehicle listings"
echo "  • MarketResearchJob - Background research jobs"
print_success "Schema updated in backend/prisma/schema.prisma"
echo ""

# Step 5: Database migration prompt
echo "Step 5: Database migration"
print_warning "IMPORTANT: Database migration required!"
echo ""
echo "To apply the new schema, run:"
echo ""
echo "  cd backend"
echo "  npx prisma migrate dev --name add_market_research_tables"
echo ""
read -p "Do you want to run the migration now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Running Prisma migration..."
    cd backend
    npx prisma migrate dev --name add_market_research_tables
    print_success "Database migration completed"
    cd ..
else
    print_warning "Skipping migration. Remember to run it before using the pricing system!"
fi
echo ""

# Step 6: Check for existing routes
echo "Step 6: Checking route configuration..."
if [ -f "backend/src/routes/index.ts" ]; then
    print_success "Routes file found"
    print_warning "Remember to add market research routes!"
    echo ""
    echo "Add these lines to your routes file:"
    echo ""
    echo "  import * as marketResearchController from './controllers/market-research.controller';"
    echo ""
    echo "  router.post('/api/market-research/analyze', marketResearchController.analyzeVehicle);"
    echo "  router.get('/api/market-research/:submissionId', marketResearchController.getMarketResearch);"
    echo "  router.post('/api/market-research/:submissionId/refresh', marketResearchController.refreshMarketResearch);"
    echo "  router.get('/api/market-research/sources', marketResearchController.getAvailableSources);"
    echo ""
elif [ -f "backend/src/routes.ts" ]; then
    print_success "Routes file found"
    print_warning "Remember to add market research routes! (See above)"
else
    print_warning "Could not find routes file - manual setup required"
fi
echo ""

# Step 7: Test the system
echo "Step 7: Testing the setup..."
print_info "You can test the pricing system with:"
echo ""
echo "  /price-research 2023 Ford F-150 Raptor R"
echo ""
echo "Or via API:"
echo ""
echo "  curl -X POST http://localhost:5000/api/market-research/analyze \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"year\":2023,\"make\":\"Ford\",\"model\":\"F-150\",\"mileage\":15000}'"
echo ""

# Step 8: Summary
echo "=================================================="
echo "Setup Summary"
echo "=================================================="
echo ""
print_success "Dependencies installed"
print_success "Prisma schema updated"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_success "Database migrated"
else
    print_warning "Database migration pending"
fi
echo ""
echo "Next Steps:"
echo ""
echo "1. Review PRICING_QUICK_START.md for usage examples"
echo "2. Read MARKET_RESEARCH_SYSTEM.md for full documentation"
echo "3. Add market research routes to your Express app"
echo "4. Test with: /price-research 2023 Toyota Camry"
echo "5. Check logs in backend for any scraping issues"
echo ""
print_success "Setup complete! 🎉"
echo ""
echo "Documentation files:"
echo "  • PRICING_QUICK_START.md - Quick start guide"
echo "  • MARKET_RESEARCH_SYSTEM.md - Full system documentation"
echo "  • PRICING_SYSTEM_SUMMARY.md - Implementation summary"
echo ""
