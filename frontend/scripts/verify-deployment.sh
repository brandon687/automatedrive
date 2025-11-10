#!/bin/bash

# Vercel Deployment Verification Script
# This script verifies that CSS changes are properly deployed to Vercel

set -e

VERCEL_URL="https://dealertrade-app.vercel.app"
EXPECTED_TEXT="color:#000!important"

echo "=========================================="
echo "Vercel Deployment Verification"
echo "=========================================="
echo ""

# Wait for deployment (give Vercel time to build)
echo "Waiting 60 seconds for Vercel to complete deployment..."
sleep 60

echo "Fetching index.html from Vercel..."
INDEX_HTML=$(curl -s "$VERCEL_URL")

# Extract CSS filename from HTML
CSS_FILE=$(echo "$INDEX_HTML" | grep -oP '/assets/index-[a-zA-Z0-9]+\.css' | head -1)

if [ -z "$CSS_FILE" ]; then
    echo "ERROR: Could not find CSS file in HTML"
    echo "HTML content:"
    echo "$INDEX_HTML"
    exit 1
fi

echo "Found CSS file: $CSS_FILE"
echo ""

# Fetch CSS file
CSS_URL="$VERCEL_URL$CSS_FILE"
echo "Fetching CSS from: $CSS_URL"
CSS_CONTENT=$(curl -s "$CSS_URL")

# Check for expected styles
echo ""
echo "Checking for luxury-input styles..."
LUXURY_INPUT_STYLES=$(echo "$CSS_CONTENT" | grep -o "\.luxury-input{[^}]*}" | head -3)

if [ -z "$LUXURY_INPUT_STYLES" ]; then
    echo "ERROR: Could not find .luxury-input styles"
    exit 1
fi

echo "Found luxury-input styles:"
echo "$LUXURY_INPUT_STYLES"
echo ""

# Verify color is black
if echo "$CSS_CONTENT" | grep -q "$EXPECTED_TEXT"; then
    echo "SUCCESS: CSS contains the fix!"
    echo "Input text color is set to black (#000) with !important"
    exit 0
else
    echo "FAILURE: CSS does NOT contain the fix"
    echo "Expected to find: $EXPECTED_TEXT"
    echo ""
    echo "Full luxury-input styles:"
    echo "$LUXURY_INPUT_STYLES"
    exit 1
fi
