# Vehicle Pricing Research - Quick Start Guide

## Get Accurate Pricing in 3 Easy Steps

### Method 1: Using Slash Command (Fastest)

```bash
/price-research 2023 Ford F-150 Raptor R
```

or

```bash
/price-research 1HGBH41JXMN109186
```

This launches an AI agent that will:
- Search CarGurus and AutoTrader for comparable listings
- Analyze pricing data from multiple sources
- Generate a comprehensive market report
- Provide dealer pricing recommendations

**You'll get:**
- Market Low/Average/High prices
- Recommended asking price
- Competitive dealer offer price
- Market demand assessment
- Days-to-sell estimate
- Sample comparable listings
- Confidence score

---

### Method 2: Via API (For Integration)

**Analyze a Vehicle:**

```javascript
POST /api/market-research/analyze

{
  "year": 2023,
  "make": "Ford",
  "model": "F-150",
  "trim": "Raptor R",
  "mileage": 15000,
  "zipCode": "90210"
}

// Response:
{
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
    "marketDemand": "high"
  },
  "confidence": {
    "overallConfidence": "excellent"
  }
}
```

**Get Stored Research:**

```javascript
GET /api/market-research/:submissionId

// Returns complete analysis including price history
```

**Refresh Pricing:**

```javascript
POST /api/market-research/:submissionId/refresh

// Updates with latest market data
```

---

### Method 3: Manual Research (For Deep Dives)

For complex or rare vehicles, you can manually guide the research:

1. Ask Claude: "Research pricing for [VEHICLE]"
2. Claude will use WebSearch to find listings on:
   - CarGurus
   - AutoTrader
   - Enthusiast forums (for rare vehicles)
3. Claude will analyze and provide detailed report

**Example:**

```
Research pricing for a 2021 Aston Martin DBX with 12,000 miles
```

Claude will:
- Search multiple marketplaces
- Find 10-20 comparable listings
- Calculate market statistics
- Provide pricing recommendations
- Assess market demand and trends

---

## Understanding Your Results

### Price Breakdown

| Metric | What It Means |
|--------|---------------|
| **Market Low** | 10th percentile - lowest realistic price |
| **Market Average** | Mean price of all comparable listings |
| **Market High** | 90th percentile - highest realistic price |
| **Recommended Asking Price** | Competitive retail price (avg + 5-10%) |
| **Recommended Dealer Offer** | Wholesale acquisition price (avg - 15-20%) |

### Confidence Levels

| Level | Meaning | Action |
|-------|---------|--------|
| **Excellent** | 20+ listings from 2+ sources | Trust the numbers |
| **Good** | 10-19 listings from 2+ sources | Reliable pricing |
| **Fair** | 5-9 listings | Use with caution |
| **Poor** | < 5 listings | Manual research recommended |

### Market Demand

| Level | Days to Sell | Strategy |
|-------|--------------|----------|
| **Very High** | < 15 days | Price at high end of range |
| **High** | 15-30 days | Price at market average |
| **Moderate** | 30-45 days | Competitive pricing needed |
| **Low** | 45-60 days | Price below average |
| **Very Low** | 60+ days | Aggressive pricing required |

---

## Common Use Cases

### Use Case 1: Quick Valuation for Trade-In

```bash
/price-research VIN123456789012345

# Get instant pricing to evaluate trade-in offer
```

### Use Case 2: Pricing New Inventory

```javascript
// When receiving new inventory, get market pricing
POST /api/market-research/analyze
{
  "submissionId": "abc-123",
  "year": 2022,
  "make": "BMW",
  "model": "M4",
  "mileage": 8500
}

// Use recommendedAskingPrice to list vehicle
```

### Use Case 3: Competitive Analysis

```
Research pricing for 2023 Mercedes-Benz G550

# Get market intelligence:
# - How many are for sale?
# - What's the price range?
# - How fast are they selling?
# - What should we offer?
```

### Use Case 4: Monitoring Price Trends

```javascript
// Check if pricing changed
GET /api/market-research/:submissionId

// Compare lastUpdated date
// If > 7 days old, refresh:

POST /api/market-research/:submissionId/refresh
```

---

## Pro Tips

### 1. **Provide Accurate Mileage**
Mileage significantly affects pricing. A difference of 20k miles can change value by $2,000-$5,000.

### 2. **Include Trim Level**
Trim packages (e.g., "Raptor R" vs "XLT") can mean $20,000+ difference.

### 3. **Use ZIP Code for Local Market**
Prices vary by region. California prices ≠ Texas prices.

### 4. **Refresh Weekly**
Vehicle prices change rapidly. Refresh research weekly for active inventory.

### 5. **Check Multiple Times of Year**
Convertibles sell higher in spring. 4WD trucks higher in winter.

### 6. **Look at Days-to-Sell**
Fast-moving vehicles = strong demand = price at high end.
Slow-moving = weak demand = price aggressively.

### 7. **Trust "Excellent" Confidence**
When system shows "Excellent" confidence with 20+ comparables, the pricing is highly accurate.

### 8. **Manual Research for Rare Vehicles**
For exotic, classic, or rare vehicles with < 5 comparables, do manual research or wait for more data.

---

## Troubleshooting

### "Poor confidence, < 5 listings found"

**Solution:**
- Expand search radius (different ZIP code)
- Search +/- 1 year
- Check enthusiast forums
- Wait a few days for new listings

### "No listings found"

**Solution:**
- Verify make/model spelling
- Check if trim is correct
- Try without trim level
- Research manually using WebSearch

### "Pricing seems off"

**Possible Causes:**
- Rare vehicle with limited data
- Regional price variations
- Seasonal factors
- Recent model change/refresh

**Solution:**
- Check sampleListings for actual comps
- Verify vehicle specs are correct
- Do manual validation search

---

## Next Steps

### For Developers

1. Review `/backend/src/services/market-research.service.ts`
2. Check API endpoints in `/backend/src/controllers/market-research.controller.ts`
3. Explore database schema in `/backend/prisma/schema.prisma`
4. Read full documentation: `MARKET_RESEARCH_SYSTEM.md`

### For Users

1. Try the slash command: `/price-research [VEHICLE]`
2. Explore API endpoints via Postman/Insomnia
3. Review sample reports to understand output format
4. Integrate into your workflow

### For Integration

1. Use API endpoints in your frontend
2. Display pricing prominently in vehicle listings
3. Show confidence levels to users
4. Auto-refresh pricing on schedule
5. Alert on significant price changes

---

## Support Resources

- **Full Documentation**: `MARKET_RESEARCH_SYSTEM.md`
- **API Reference**: See controllers/market-research.controller.ts
- **Database Schema**: backend/prisma/schema.prisma
- **Agent Prompt**: .claude/agents/market-research-agent.md
- **Example Searches**: Try `/price-research` with different vehicles

---

## Roadmap

**Coming Soon:**
- ✅ CarGurus & AutoTrader (Live)
- 🔄 Kelley Blue Book API integration
- 🔄 NADA Guides API integration
- 🔄 Black Book wholesale pricing
- 🔄 Edmunds integration
- 🔄 Price trend predictions
- 🔄 Automated daily updates
- 🔄 Price alert notifications

**Your Feedback Matters!**
Let us know what features would help you most.
