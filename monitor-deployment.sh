#!/bin/bash

echo "Monitoring Vercel deployment for dealertrade-app.vercel.app..."
echo "Looking for new CSS file hash (current: index-CVHhgAd0.css)"
echo "Expected new hash should be different after deployment"
echo ""

OLD_HASH="index-CVHhgAd0.css"
CHECK_COUNT=0
MAX_CHECKS=60  # Monitor for 10 minutes (60 checks * 10 seconds)

while [ $CHECK_COUNT -lt $MAX_CHECKS ]; do
    RESPONSE=$(curl -s https://dealertrade-app.vercel.app)
    CSS_FILE=$(echo "$RESPONSE" | grep -o 'index-[^"]*\.css' | head -1)

    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

    if [ "$CSS_FILE" != "$OLD_HASH" ] && [ ! -z "$CSS_FILE" ]; then
        echo ""
        echo "🎉 DEPLOYMENT DETECTED! [$TIMESTAMP]"
        echo "New CSS file: $CSS_FILE"
        echo ""
        echo "Verifying the changes are live..."
        sleep 3

        # Download and check the new CSS for our bold black text styles
        CSS_CONTENT=$(curl -s "https://dealertrade-app.vercel.app/assets/$CSS_FILE")

        if echo "$CSS_CONTENT" | grep -q "font-weight:700" && echo "$CSS_CONTENT" | grep -q "000"; then
            echo "✅ SUCCESS! Bold black text styles are present in the deployed CSS!"
            echo ""
            echo "Your app is now LIVE with the fixes at: https://dealertrade-app.vercel.app"
        else
            echo "⚠️  CSS file updated but bold styles might need verification"
        fi
        exit 0
    fi

    CHECK_COUNT=$((CHECK_COUNT + 1))
    echo "[$TIMESTAMP] Check #$CHECK_COUNT: Still using $CSS_FILE - Waiting for deployment..."
    sleep 10
done

echo ""
echo "⏱️  Monitoring timeout reached (10 minutes). Deployment may still be in progress."
echo "Check your Vercel dashboard at: https://vercel.com"
