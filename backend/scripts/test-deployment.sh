#!/bin/bash
# Comprehensive Railway Deployment Test Script

set -e

echo "🔍 Railway Deployment Test Suite"
echo "================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_step() {
    local description="$1"
    local command="$2"

    echo -n "Testing: $description... "

    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test function with output
test_step_verbose() {
    local description="$1"
    local command="$2"

    echo ""
    echo "Testing: $description"
    echo "----------------------------------------"

    if eval "$command"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
    echo ""
}

# 1. Check Railway CLI
echo "📦 Checking Prerequisites"
test_step "Railway CLI installed" "which railway"
test_step "Node.js installed" "which node"
test_step "npm installed" "which npm"
echo ""

# 2. Check Configuration Files
echo "📝 Checking Configuration Files"
test_step "railway.json exists" "test -f railway.json"
test_step "nixpacks.toml exists" "test -f nixpacks.toml"
test_step "package.json exists" "test -f package.json"
test_step "tsconfig.json exists" "test -f tsconfig.json"
test_step "prisma/schema.prisma exists" "test -f prisma/schema.prisma"
test_step "prisma.config.ts NOT present" "test ! -f prisma.config.ts"
echo ""

# 3. Check Dependencies
echo "📚 Checking Dependencies"
test_step "node_modules exists" "test -d node_modules"
test_step "@prisma/client installed" "test -d node_modules/@prisma/client"
test_step "express installed" "test -d node_modules/express"
echo ""

# 4. Build Test
echo "🔨 Testing Build"
test_step_verbose "TypeScript compilation" "npm run build"
test_step "dist directory created" "test -d dist"
test_step "dist/index.js exists" "test -f dist/index.js"
echo ""

# 5. Prisma Tests
echo "🗄️  Testing Prisma"
test_step_verbose "Prisma client generation" "npx prisma generate"
test_step "Prisma client exists" "test -d node_modules/.prisma"
echo ""

# 6. Railway Connection
echo "☁️  Testing Railway Connection"
test_step_verbose "Railway authentication" "railway whoami"
test_step_verbose "Railway project linked" "railway status"
echo ""

# 7. Environment Variables
echo "🔐 Checking Railway Environment Variables"
echo "Current Railway variables:"
railway variables 2>/dev/null || echo "Failed to fetch variables"
echo ""

# 8. Check Required Variables
echo "Checking required environment variables on Railway:"
REQUIRED_VARS=("DATABASE_URL" "PORT" "NODE_ENV" "JWT_SECRET" "AUTO_DEV_API_KEY")

for var in "${REQUIRED_VARS[@]}"; do
    if railway variables 2>/dev/null | grep -q "$var"; then
        echo -e "  ${GREEN}✓${NC} $var is set"
        ((TESTS_PASSED++))
    else
        echo -e "  ${RED}✗${NC} $var is MISSING"
        ((TESTS_FAILED++))
    fi
done
echo ""

# 9. Local Environment Check
echo "🏠 Checking Local Environment"
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠${NC}  .env file not found (optional for Railway)"
fi
echo ""

# 10. Git Status
echo "📊 Git Status"
echo "Modified files:"
git status --short 2>/dev/null || echo "Not a git repository"
echo ""

# Summary
echo "================================="
echo "Test Summary"
echo "================================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Ready to deploy.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Commit your changes: git add . && git commit -m 'Fix Railway deployment'"
    echo "  2. Deploy to Railway: railway up"
    echo "  3. Check logs: railway logs"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please fix the issues before deploying.${NC}"
    exit 1
fi
