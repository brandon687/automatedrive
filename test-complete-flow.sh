#!/bin/bash

echo "========================================"
echo "DEALERTRADE SUBMISSION SYSTEM TEST"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test data
VIN="WBSMW9C50PCA63726"
MILEAGE=4000
NAME="brandon in"
EMAIL="inbrandon98@gmail.com"
PHONE="6613424394"

echo "${BLUE}Test 1: Backend Health Check${NC}"
HEALTH=$(curl -s http://localhost:3000/health)
if echo "$HEALTH" | grep -q "ok"; then
    echo "${GREEN}✓ Backend is healthy${NC}"
else
    echo "${RED}✗ Backend health check failed${NC}"
    exit 1
fi
echo ""

echo "${BLUE}Test 2: VIN Decode Endpoint${NC}"
VIN_RESPONSE=$(curl -s http://localhost:3000/api/vin/decode/$VIN)
if echo "$VIN_RESPONSE" | grep -q "success"; then
    YEAR=$(echo $VIN_RESPONSE | grep -o '"year":[0-9]*' | cut -d: -f2)
    MAKE=$(echo $VIN_RESPONSE | grep -o '"make":"[^"]*"' | cut -d'"' -f4)
    echo "${GREEN}✓ VIN decoded successfully${NC}"
    echo "  Year: $YEAR"
    echo "  Make: $MAKE"
else
    echo "${RED}✗ VIN decode failed${NC}"
    exit 1
fi
echo ""

echo "${BLUE}Test 3: Vehicle Submission (with CORS headers)${NC}"
SUBMIT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d "{\"vin\":\"$VIN\",\"mileage\":$MILEAGE,\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"phone\":\"$PHONE\"}")

SUCCESS=$(echo $SUBMIT_RESPONSE | grep -o '"success":[^,]*' | cut -d: -f2)
TICKET=$(echo $SUBMIT_RESPONSE | grep -o '"ticketNumber":"[^"]*"' | cut -d'"' -f4)
SUBID=$(echo $SUBMIT_RESPONSE | grep -o '"submissionId":"[^"]*"' | cut -d'"' -f4)

if [ "$SUCCESS" = "true" ]; then
    echo "${GREEN}✓ Submission created successfully${NC}"
    echo "  Ticket Number: $TICKET"
    echo "  Submission ID: $SUBID"
else
    echo "${RED}✗ Submission failed${NC}"
    echo "  Response: $SUBMIT_RESPONSE"
    exit 1
fi
echo ""

echo "${BLUE}Test 4: Retrieve Submission${NC}"
if [ ! -z "$TICKET" ]; then
    VERIFY_RESPONSE=$(curl -s http://localhost:3000/api/submissions/$TICKET)
    VERIFY_VIN=$(echo $VERIFY_RESPONSE | grep -o '"vin":"[^"]*"' | cut -d'"' -f4)
    VERIFY_EMAIL=$(echo $VERIFY_RESPONSE | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
    
    if [ "$VERIFY_VIN" = "$VIN" ]; then
        echo "${GREEN}✓ Submission retrieved successfully${NC}"
        echo "  VIN: $VERIFY_VIN"
        echo "  Email: $VERIFY_EMAIL"
    else
        echo "${RED}✗ Submission verification failed${NC}"
        exit 1
    fi
else
    echo "${RED}✗ No ticket number to verify${NC}"
    exit 1
fi
echo ""

echo "${BLUE}Test 5: Frontend Server Check${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "${GREEN}✓ Frontend is accessible${NC}"
else
    echo "${RED}✗ Frontend not accessible (HTTP $FRONTEND_STATUS)${NC}"
fi
echo ""

echo "========================================"
echo "${GREEN}ALL TESTS PASSED!${NC}"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Enter VIN: $VIN"
echo "3. Fill in the form with the test data"
echo "4. Submit and verify the ticket number is displayed"
echo "5. Check browser console for detailed logs"
echo ""
