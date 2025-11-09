#!/bin/bash

# DealerTrade Frontend Deployment Test Script
# This script tests a deployed application to verify it works correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
URL="${1:-http://localhost:3001}"
TIMEOUT="${2:-30}"

echo "=========================================="
echo "DealerTrade Deployment Test"
echo "=========================================="
echo ""
echo "Testing URL: $URL"
echo "Timeout: ${TIMEOUT}s"
echo ""

# Function to print status
print_status() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
  else
    echo -e "${RED}✗${NC} $2"
  fi
}

# Function to print warning
print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Test 1: Check if URL is accessible
echo "1. Checking if application is accessible..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$URL" || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
  print_status 0 "Application is accessible (HTTP $HTTP_CODE)"
else
  print_status 1 "Application is not accessible (HTTP $HTTP_CODE)"
  exit 1
fi

# Test 2: Check response time
echo ""
echo "2. Checking response time..."
START_TIME=$(date +%s%N)
curl -s -o /dev/null "$URL"
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))

if [ $RESPONSE_TIME -lt 3000 ]; then
  print_status 0 "Response time is good (${RESPONSE_TIME}ms)"
elif [ $RESPONSE_TIME -lt 5000 ]; then
  print_warning "Response time is acceptable (${RESPONSE_TIME}ms)"
else
  print_warning "Response time is slow (${RESPONSE_TIME}ms)"
fi

# Test 3: Check for required content
echo ""
echo "3. Checking for required content..."
HTML_CONTENT=$(curl -s "$URL")

if echo "$HTML_CONTENT" | grep -q "root"; then
  print_status 0 "React root element found"
else
  print_status 1 "React root element NOT found"
fi

if echo "$HTML_CONTENT" | grep -q "src"; then
  print_status 0 "JavaScript bundle referenced"
else
  print_status 1 "JavaScript bundle NOT referenced"
fi

# Test 4: Run Playwright smoke tests
echo ""
echo "4. Running Playwright smoke tests..."
echo "   (This will take ~5 seconds)"
echo ""

cd "$(dirname "$0")/.." || exit 1

TEST_URL="$URL" npx playwright test e2e/deployment-smoke.spec.ts --project=chromium --reporter=list

TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
  print_status 0 "All Playwright tests passed"
else
  print_status 1 "Some Playwright tests failed"
fi

# Test 5: Check for console errors (if tests passed)
echo ""
echo "5. Checking test artifacts..."

if [ -d "test-results/screenshots" ]; then
  SCREENSHOT_COUNT=$(find test-results/screenshots -name "*.png" 2>/dev/null | wc -l)
  print_status 0 "Screenshots captured ($SCREENSHOT_COUNT files)"
else
  print_warning "No screenshots directory found"
fi

# Summary
echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""

if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✓ Deployment test PASSED${NC}"
  echo ""
  echo "Your application is working correctly!"
  echo ""
  echo "Next steps:"
  echo "  - View full HTML report: npm run test:report"
  echo "  - Run mobile tests: npm run test:mobile"
  echo "  - Test other devices: npm test"
  exit 0
else
  echo -e "${RED}✗ Deployment test FAILED${NC}"
  echo ""
  echo "Please review the errors above and:"
  echo "  1. Check application logs"
  echo "  2. Verify all assets are deployed"
  echo "  3. Test locally first"
  echo "  4. Review HTML report: npm run test:report"
  exit 1
fi
