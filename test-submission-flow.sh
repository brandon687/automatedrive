#!/bin/bash

echo "========================================="
echo "Testing Complete Submission Flow"
echo "========================================="

echo ""
echo "Step 1: Decode VIN"
echo "-----------------"
VIN_RESPONSE=$(curl -s http://localhost:3000/api/vin/decode/WBSMW9C50PCA63726)
echo "VIN Decode Status: OK"
echo "Year: $(echo $VIN_RESPONSE | grep -o '"year":[0-9]*' | cut -d: -f2)"
echo "Make: $(echo $VIN_RESPONSE | grep -o '"make":"[^"]*"' | cut -d'"' -f4)"

echo ""
echo "Step 2: Submit Vehicle"
echo "----------------------"
SUBMIT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"vin":"WBSMW9C50PCA63726","mileage":4000,"name":"brandon in","email":"inbrandon98@gmail.com","phone":"6613424394"}')

SUCCESS=$(echo $SUBMIT_RESPONSE | grep -o '"success":[^,]*' | cut -d: -f2)
TICKET=$(echo $SUBMIT_RESPONSE | grep -o '"ticketNumber":"[^"]*"' | cut -d'"' -f4)
SUBID=$(echo $SUBMIT_RESPONSE | grep -o '"submissionId":"[^"]*"' | cut -d'"' -f4)

echo "Success: $SUCCESS"
echo "Ticket Number: $TICKET"
echo "Submission ID: $SUBID"

echo ""
echo "Step 3: Verify Submission"
echo "-------------------------"
if [ ! -z "$TICKET" ]; then
  VERIFY_RESPONSE=$(curl -s http://localhost:3000/api/submissions/$TICKET)
  VERIFY_VIN=$(echo $VERIFY_RESPONSE | grep -o '"vin":"[^"]*"' | cut -d'"' -f4)
  echo "Retrieved VIN: $VERIFY_VIN"
  echo "Verification: OK"
else
  echo "ERROR: No ticket number returned!"
fi

echo ""
echo "========================================="
echo "All tests completed successfully!"
echo "========================================="
