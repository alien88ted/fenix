#!/bin/bash
# Deployment verification script for Render

echo "🔍 Fenix Wallet Deployment Verification"
echo "========================================"

# Check if URL is provided
if [ -z "$1" ]; then
    echo "Usage: ./verify-deployment.sh <your-app-url>"
    echo "Example: ./verify-deployment.sh https://fenix-wallet.onrender.com"
    exit 1
fi

APP_URL=$1
echo "Testing deployment at: $APP_URL"
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Health check passed (HTTP $HEALTH_RESPONSE)"
    echo "   Response:"
    curl -s "$APP_URL/api/health" | python3 -m json.tool 2>/dev/null || curl -s "$APP_URL/api/health"
elif [ "$HEALTH_RESPONSE" = "503" ]; then
    echo "⚠️  Health check returned 503 - Configuration issues detected"
    echo "   Response:"
    curl -s "$APP_URL/api/health" | python3 -m json.tool 2>/dev/null || curl -s "$APP_URL/api/health"
else
    echo "❌ Health check failed (HTTP $HEALTH_RESPONSE)"
fi
echo ""

# Test main page
echo "2. Testing main page..."
MAIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL")
if [ "$MAIN_RESPONSE" = "200" ]; then
    echo "✅ Main page accessible (HTTP $MAIN_RESPONSE)"
else
    echo "❌ Main page not accessible (HTTP $MAIN_RESPONSE)"
fi
echo ""

# Test static assets
echo "3. Testing static assets..."
MANIFEST_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/site.webmanifest")
if [ "$MANIFEST_RESPONSE" = "200" ]; then
    echo "✅ Static assets serving correctly"
else
    echo "⚠️  Static assets may not be configured (HTTP $MANIFEST_RESPONSE)"
fi
echo ""

# Summary
echo "========================================"
echo "Deployment Verification Complete"
echo ""
echo "Next steps if issues found:"
echo "1. Check Render logs for detailed error messages"
echo "2. Verify all environment variables are set"
echo "3. Ensure database is accessible"
echo "4. Check Privy credentials are correct"
echo ""
echo "For detailed troubleshooting, see RENDER_TROUBLESHOOTING.md"