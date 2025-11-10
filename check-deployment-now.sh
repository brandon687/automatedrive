#!/bin/bash

# Quick Deployment Status Check
# Run this anytime to check if the fix has been deployed

VERCEL_URL="https://dealertrade-app.vercel.app"

echo "================================================"
echo "Quick Vercel Deployment Status Check"
echo "================================================"
echo ""

# Get current CSS file
echo "Fetching current CSS file from Vercel..."
CSS_FILE=$(curl -s "$VERCEL_URL" | grep -o '/assets/index-[a-zA-Z0-9]*\.css' | head -1)

if [ -z "$CSS_FILE" ]; then
    echo "ERROR: Could not detect CSS file"
    exit 1
fi

echo "Current CSS file: $CSS_FILE"
echo ""

# Check if it's the old problematic file
if [ "$CSS_FILE" = "/assets/index-Dl3Mz3Ui.css" ]; then
    echo "STATUS: STILL DEPLOYING"
    echo ""
    echo "The old CSS file is still being served."
    echo "This means Vercel is either:"
    echo "  1. Currently building the new version"
    echo "  2. Hasn't started the build yet"
    echo ""
    echo "RECOMMENDATION:"
    echo "  - Wait 2-3 more minutes"
    echo "  - Then run this script again"
    echo "  - Or check Vercel dashboard: https://vercel.com/dashboard"
    echo ""
    exit 0
fi

# New file detected - check content
echo "STATUS: NEW CSS FILE DETECTED!"
echo ""
echo "Fetching CSS content to verify fix..."
CSS_URL="$VERCEL_URL$CSS_FILE"
CSS_CONTENT=$(curl -s "$CSS_URL")

if echo "$CSS_CONTENT" | grep -q "color:#000!important"; then
    echo "================================================"
    echo "SUCCESS! DEPLOYMENT FIXED!"
    echo "================================================"
    echo ""
    echo "The CSS fix has been successfully deployed:"
    echo "  - New CSS file: $CSS_FILE"
    echo "  - Contains: color:#000!important"
    echo "  - Input text will now be BLACK"
    echo ""
    echo "NEXT STEPS:"
    echo "  1. Open in incognito mode: $VERCEL_URL"
    echo "  2. Test input fields"
    echo "  3. Text should be black and bold"
    echo ""
    echo "If you still see light gray text:"
    echo "  - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Win)"
    echo "  - Clear browser cache completely"
    echo "  - Try a different browser"
    echo ""
else
    echo "WARNING: New CSS file but fix not found"
    echo ""
    echo "The CSS file hash changed, but the expected fix"
    echo "was not found in the content."
    echo ""
    echo "Checking luxury-input styles..."
    echo "$CSS_CONTENT" | grep -o "luxury-input{[^}]*}" | head -3
    echo ""
fi
