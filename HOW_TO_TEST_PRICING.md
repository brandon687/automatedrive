# 🎯 How to Test Your New Pricing System

## ✅ Everything is Deployed!

All code has been pushed to GitHub. Here's what you can test right now:

---

## Option 1: Test with Slash Command (Works NOW!)

The easiest way to test - no backend needed:

```bash
/price-research 2023 Ford F-150 Raptor R
```

**What happens:**
- AI agent launches automatically
- Searches CarGurus and AutoTrader via WebSearch
- Analyzes comparable listings
- Generates comprehensive market report
- Shows you pricing, demand, confidence scores

**Try these:**
```bash
/price-research 2023 BMW M4 Competition
/price-research 2021 Toyota Camry
/price-research 2022 Tesla Model 3
```

---

## Option 2: Test API Locally

### Step 1: Start Your Backend
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📍 Environment: development
```

### Step 2: Test the API

**In a new terminal:**

```bash
# Test the analyze endpoint
curl -X POST http://localhost:3000/api/market-research/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2023,
    "make": "Ford",
    "model": "F-150",
    "trim": "Raptor R",
    "mileage": 15000,
    "zipCode": "90210"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "pricing": {
      "marketLow": 95000,
      "marketAverage": 108000,
      "marketHigh": 122000,
      "recommendedAskingPrice": 113400,
      "recommendedDealerOffer": 91800
    },
    "market": {
      "totalComparableListings": 47,
      "averageDaysToSell": 22,
      "marketDemand": "high",
      "priceTrend": "stable"
    },
    "confidence": {
      "dataSourcesCount": 2,
      "overallConfidence": "excellent"
    }
  }
}
```

### Step 3: Check Available Sources
```bash
curl http://localhost:3000/api/market-research/sources
```

---

## Option 3: Test in Your Frontend

Once your backend is deployed to Railway, add this to your React components:

```typescript
// Example: Get pricing for a vehicle
async function getPricing() {
  const response = await fetch('/api/market-research/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      year: 2023,
      make: 'Ford',
      model: 'F-150',
      mileage: 15000
    })
  });

  const { data } = await response.json();
  console.log(`Market Average: $${data.pricing.marketAverage.toLocaleString()}`);
  console.log(`Dealer Offer: $${data.pricing.recommendedDealerOffer.toLocaleString()}`);
  console.log(`Confidence: ${data.confidence.overallConfidence}`);
}
```

---

## What You'll See in the Results

### Pricing Data
- **Market Low**: 10th percentile (lowest realistic price)
- **Market Average**: Mean of all comparable listings
- **Market High**: 90th percentile (highest realistic price)
- **Recommended Asking Price**: Competitive retail price
- **Recommended Dealer Offer**: Wholesale acquisition price

### Market Intelligence
- **Total Comparable Listings**: How many similar vehicles found
- **Average Days to Sell**: Market velocity
- **Market Demand**: very_high | high | moderate | low | very_low
- **Price Trend**: increasing | stable | decreasing

### Confidence Scoring
- **Excellent**: 20+ listings from 2+ sources (trust it!)
- **Good**: 10-19 listings from 2+ sources (reliable)
- **Fair**: 5-9 listings (use with caution)
- **Poor**: < 5 listings (manual research recommended)

---

## Quick Tests to Try

### High-Volume Vehicle (Lots of Data)
```bash
/price-research 2023 Toyota Camry
# Expect: Excellent confidence, 30+ listings
```

### Luxury Vehicle (Moderate Data)
```bash
/price-research 2023 BMW M4 Competition
# Expect: Good confidence, 10-20 listings
```

### Rare/Exotic Vehicle (Limited Data)
```bash
/price-research 2021 Aston Martin DBX
# Expect: Fair/Poor confidence, manual validation needed
```

---

## Troubleshooting

### "Module not found" error
Make sure you're in the backend directory:
```bash
cd backend
npm install
npm run dev
```

### API returns 404
Check that your backend is running on the correct port:
```bash
# Should show all endpoints including market-research
curl http://localhost:3000
```

### No listings found
- Try a more common vehicle first (Toyota Camry, Ford F-150)
- Check your internet connection (needs to scrape websites)
- Verify ZIP code is valid US ZIP

### Backend not starting
```bash
cd backend
npm install cheerio @types/cheerio
npx prisma generate
npm run dev
```

---

## Production Deployment (Railway)

When you deploy to Railway, make sure:

1. **Environment Variables Set**:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `PORT` (Railway provides this)

2. **Build Commands**:
   ```
   npm install
   npx prisma generate
   npm run build
   ```

3. **Start Command**:
   ```
   npm run start
   ```

4. **Database Migration**:
   Railway will need PostgreSQL instead of SQLite. Update `schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/market-research/analyze` | Analyze a vehicle |
| GET | `/api/market-research/:submissionId` | Get stored analysis |
| POST | `/api/market-research/:submissionId/refresh` | Refresh pricing |
| GET | `/api/market-research/sources` | List data sources |

---

## Next Steps

1. **Test the slash command** (works right now!)
2. **Start your backend locally** and test the API
3. **Deploy backend to Railway** (when ready)
4. **Integrate into frontend** UI components

---

## 🎉 Success Indicators

You'll know it's working when you see:

✅ **Via Slash Command:**
```
VEHICLE MARKET RESEARCH REPORT
Vehicle: 2023 Ford F-150 Raptor R
Market Average: $108,450
Confidence: Excellent (47 listings from 2 sources)
```

✅ **Via API:**
```json
{
  "success": true,
  "data": {
    "pricing": { ... },
    "confidence": { "overallConfidence": "excellent" }
  }
}
```

✅ **In Database:**
Check `market_analysis` table for stored research results.

---

**Ready to test? Try this now:**
```bash
/price-research 2023 Ford F-150 Raptor R
```
