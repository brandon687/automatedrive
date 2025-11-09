# Vehicle Pricing API Setup Guide

This guide will help you set up vehicle pricing APIs for the DealerTrade platform.

---

## Quick Setup (5 minutes) - Auto.dev FREE Tier ⭐

### Step 1: Sign Up for Auto.dev

1. Visit: https://www.auto.dev/pricing
2. Click "Get Started" or "Sign Up"
3. Create a free account (no credit card required)
4. Get **1,000 FREE API calls per month**

### Step 2: Get Your API Key

1. Log into your Auto.dev dashboard
2. Navigate to API Keys section
3. Copy your API key

### Step 3: Add to DealerTrade

1. Open `/Users/brandonin/drl/backend/.env`
2. Find the line: `AUTO_DEV_API_KEY=`
3. Add your key: `AUTO_DEV_API_KEY=your_actual_key_here`
4. Save the file
5. Restart the backend server

### Step 4: Test

```bash
# Test the API
curl http://localhost:3000/api/valuation/1HGBH41JXMN109186?year=2020&make=Honda&model=Accord&mileage=50000
```

**Expected Response:**
```json
{
  "success": true,
  "valuation": {
    "vin": "1HGBH41JXMN109186",
    "marketValue": {
      "low": 18500,
      "average": 21000,
      "high": 23500,
      "currency": "USD"
    },
    "confidence": "medium",
    "source": "auto.dev"
  },
  "insights": {
    "estimatedRetail": 23500,
    "estimatedWholesale": 18500,
    "estimatedPrivateParty": 21000,
    "competitivePrice": 17850,
    "daysToSell": 30,
    "demandLevel": "medium"
  }
}
```

---

## Optional: Vincario Backup API

### When to Use
- When Auto.dev reaches its limit
- For cross-reference pricing
- Better global coverage

### Setup Steps

1. Visit: https://vincario.com/ or https://vindecoder.eu/
2. Sign up for free account (20 free lookups)
3. Get API key from dashboard
4. Add to `.env`: `VINCARIO_API_KEY=your_key_here`

---

## Fallback System (Already Implemented)

If both APIs fail or aren't configured, the system automatically uses an **estimation model** based on:
- Vehicle age
- Make/model base prices
- Mileage depreciation
- Market trends

This ensures you always get pricing data, even without API keys!

---

## API Endpoints Available

### 1. Get Valuation by VIN
```bash
GET /api/valuation/:vin?year=2020&make=Honda&model=Accord&mileage=50000
```

### 2. Get Submission Valuation (Cached)
```bash
GET /api/valuation/submission/:submissionId
```

### 3. Refresh Submission Valuation (Force Update)
```bash
POST /api/valuation/submission/:submissionId/refresh
```

### 4. Admin Market Analytics
```bash
GET /api/valuation/admin/analytics
```

---

## Cost & Usage

### Free Tier (Current)
- **Auto.dev**: 1,000 calls/month = FREE
- **Vincario**: 20 calls = FREE
- **Estimation**: Unlimited = FREE

**Estimated Monthly Usage:**
- MVP (50-200 submissions): **$0**
- Growth (500-1000 submissions): **$0**
- Scale (2000 submissions): ~$30/month

### When to Upgrade

**Upgrade when you exceed:**
- 1,000 submissions/month
- Need enterprise features
- Require 99.9% uptime SLA

**Upgrade options:**
- Auto.dev: Pay-as-you-go ($0.03/request after free tier)
- Vincario: Volume pricing available
- KBB InfoDriver: $500-1000/month (enterprise)

---

## Features Included

### ✅ Market Valuation
- Low, average, high price ranges
- Confidence levels
- Multiple data sources

### ✅ Pricing Insights
- Estimated retail value
- Estimated wholesale value
- Estimated private party value
- Competitive dealer buy price
- Days to sell estimate
- Demand level (high/medium/low)

### ✅ Admin Analytics
- Average market values across submissions
- Valuation source breakdown
- Quote vs market value comparison
- Recent submission tracking

### ✅ Caching System
- 24-hour cache for valuations
- Reduces API costs
- Faster response times
- Manual refresh available

---

## Troubleshooting

### API Key Not Working

**Problem:** Getting "Invalid API key" error

**Solution:**
1. Check `.env` file has correct key
2. Restart backend server after adding key
3. Verify no extra spaces in key
4. Test key directly on Auto.dev dashboard

### Rate Limit Exceeded

**Problem:** "429 Too Many Requests"

**Solution:**
1. You've exceeded free tier (1,000 calls/month)
2. System automatically falls back to estimation
3. Consider upgrading to paid tier
4. Enable Vincario as backup

### No Pricing Data

**Problem:** Returns $0 values

**Solution:**
1. Check VIN is valid (17 characters)
2. Verify year, make, model are provided
3. System falls back to estimation automatically
4. Check API keys are configured

### CORS Errors

**Problem:** Frontend can't access API

**Solution:**
1. Backend CORS is already configured
2. Verify frontend URL in backend `.env`
3. Restart both servers

---

## Database Schema

Pricing data is automatically stored in `submissions` table:

```sql
estimated_value_low      INT
estimated_value_avg      INT
estimated_value_high     INT
valuation_source         TEXT  -- 'auto.dev', 'vincario', 'estimated'
valuation_confidence     TEXT  -- 'high', 'medium', 'low'
valuation_date           DATETIME
pricing_insights         TEXT  -- JSON with detailed insights
```

---

## Security Best Practices

### ✅ DO:
- Keep API keys in `.env` file
- Never commit `.env` to git
- Use environment variables in production
- Rotate keys periodically

### ❌ DON'T:
- Share API keys publicly
- Hardcode keys in source code
- Commit keys to version control
- Use production keys in development

---

## Next Steps

### Phase 1 (MVP) - ✅ DONE
- [x] Auto.dev integration
- [x] Fallback estimation model
- [x] Caching system
- [x] Admin analytics

### Phase 2 (Growth) - Planned
- [ ] Add Vincario as backup
- [ ] Historical price tracking
- [ ] Price trend analysis
- [ ] Email alerts for price changes

### Phase 3 (Scale) - Future
- [ ] Web scraping (Autotrader, CarGurus)
- [ ] Machine learning price predictions
- [ ] Real-time market updates
- [ ] KBB InfoDriver integration (enterprise)

---

## Support & Resources

**Auto.dev:**
- Pricing: https://www.auto.dev/pricing
- Docs: https://docs.auto.dev/
- Support: support@auto.dev

**Vincario:**
- Website: https://vincario.com/
- Docs: https://vindecoder.eu/api/

**DealerTrade:**
- Issues: Report at your project repo
- Docs: See PROJECT_CHANGELOG.md
- Backend: `/backend/src/services/valuation.service.ts`

---

**Last Updated:** 2025-11-08
**Status:** Production Ready (with free API tier)
