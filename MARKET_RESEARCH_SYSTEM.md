# Market Research & Pricing Intelligence System

## Overview

The DealerTrade Market Research System provides dealer-grade vehicle pricing intelligence by aggregating data from multiple marketplace sources including CarGurus and AutoTrader. The system delivers accurate, real-time pricing analysis to help dealers make informed acquisition decisions.

## Features

### 1. Multi-Source Data Aggregation
- **CarGurus Integration**: Scrapes and analyzes listings from CarGurus marketplace
- **AutoTrader Integration**: Collects pricing data from AutoTrader listings
- **Future Sources**: Architecture ready for KBB, NADA, Black Book, Edmunds integration

### 2. Intelligent Price Analysis
- **Market Statistics**: Low, Average, High pricing across all sources
- **Confidence Scoring**: Data quality assessment (Excellent/Good/Fair/Poor)
- **Comparable Filtering**: Smart filtering by mileage, year, condition
- **Outlier Detection**: Automatic removal of unrealistic listings

### 3. Dealer-Focused Recommendations
- **Recommended Asking Price**: Based on market average + demand premium
- **Competitive Dealer Offer**: Realistic wholesale acquisition price
- **Days-to-Sell Estimation**: Market velocity analysis
- **Market Demand Assessment**: 5-level demand classification

### 4. Comprehensive Market Intelligence
- **Geographic Analysis**: Local vs national market comparison
- **Price Trends**: Market direction indicators
- **Historical Tracking**: Price history over time
- **Comparable Listings**: Sample of actual market listings

## System Architecture

### Database Schema

#### market_price_sources
Stores individual pricing data points from each source:
- Source identification (cargurus, autotrader, etc.)
- Pricing data (asking, dealer, private party, trade-in)
- Listing details (dealer, location, mileage, condition)
- Confidence scores and metadata

#### market_analysis
Aggregated market analysis per submission:
- Calculated price ranges (low/avg/high)
- Recommended pricing (asking/dealer offer)
- Market intelligence (demand, trends, days-to-sell)
- Confidence metrics and insights

#### price_history
Historical price tracking:
- Snapshot of market average over time
- Change detection (amount and percentage)
- Source count at each snapshot

#### comparable_vehicles
Similar vehicle listings for context:
- Vehicle specifications
- Pricing and condition
- Source and location
- Similarity scoring

#### market_research_jobs
Background job queue for research tasks:
- Job configuration and priority
- Status tracking
- Retry logic
- Results and error handling

### Services

#### MarketResearchOrchestrator
Main orchestration service that:
- Coordinates all pricing sources
- Filters relevant listings
- Aggregates data into unified analysis
- Stores results in database

#### CarGurusResearch
Specialized service for CarGurus:
- Builds search URLs based on vehicle specs
- Parses listing HTML
- Extracts pricing and dealer information

#### AutoTraderResearch
Specialized service for AutoTrader:
- Constructs AutoTrader search queries
- Parses listing data
- Normalizes pricing information

### API Endpoints

#### POST /api/market-research/analyze
Perform new market research for a vehicle.

**Request:**
```json
{
  "submissionId": "uuid",
  "vin": "1HGBH41JXMN109186",
  "year": 2023,
  "make": "Ford",
  "model": "F-150",
  "trim": "Raptor R",
  "mileage": 15000,
  "zipCode": "90210"
}
```

**Response:**
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
    },
    "insights": "Found 47 comparable listings...",
    "recommendation": "Based on excellent confidence market data...",
    "sampleListings": [...]
  }
}
```

#### GET /api/market-research/:submissionId
Retrieve stored market research for a submission.

**Response:** Complete market analysis including pricing, market intelligence, sources, and price history.

#### POST /api/market-research/:submissionId/refresh
Refresh market research with latest data.

**Response:** Updated pricing analysis and confirmation.

#### GET /api/market-research/sources
Get list of available market research sources and their status.

## Usage

### Via API

```typescript
// Analyze a vehicle
const response = await fetch('/api/market-research/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    year: 2023,
    make: 'BMW',
    model: 'M4',
    trim: 'Competition',
    mileage: 8500,
    zipCode: '10001'
  })
});

const { data } = await response.json();
console.log(`Market Average: $${data.pricing.marketAverage.toLocaleString()}`);
console.log(`Dealer Offer: $${data.pricing.recommendedDealerOffer.toLocaleString()}`);
```

### Via Slash Command

```bash
/price-research 2023 Ford F-150 Raptor R
```

This launches the Market Research Agent which:
1. Uses WebSearch to find comparable listings
2. Analyzes pricing data from multiple sources
3. Generates comprehensive market report
4. Provides dealer-focused recommendations

### Via Market Research Agent

The specialized Market Research Agent can be launched directly for in-depth analysis:

```
Use the Task tool with subagent_type="market-research" to perform comprehensive vehicle valuation research.
```

The agent will provide:
- Detailed market research report
- Pricing analysis with confidence levels
- Sample of comparable listings
- Market insights and recommendations

## Data Quality & Confidence

### Confidence Levels

**Excellent (90-100% confidence)**
- 20+ comparable listings
- Data from 2+ sources
- Recent data (< 7 days old)
- Narrow price variance

**Good (70-89% confidence)**
- 10-19 comparable listings
- Data from 2+ sources
- Recent data (< 14 days old)
- Moderate price variance

**Fair (50-69% confidence)**
- 5-9 comparable listings
- Data from 1+ sources
- Data < 30 days old
- Some price variance

**Poor (< 50% confidence)**
- < 5 comparable listings
- Limited source diversity
- Old data or fallback estimation
- High price variance

### Data Freshness

- Real-time scraping on each research request
- Price history tracked for trend analysis
- Automatic staleness detection (> 30 days)
- Refresh recommendations when data is stale

### Filtering & Quality Control

1. **Mileage Filtering**: +/- 20,000 miles from target
2. **Year Filtering**: Same year or +/- 1 year
3. **Price Outlier Removal**: Outside $5k-$500k range
4. **Condition Matching**: Similar condition grades
5. **Geographic Relevance**: Prioritize local market

## Future Enhancements

### Phase 2: Premium Data Sources
- [ ] Kelley Blue Book (KBB) API integration
- [ ] NADA Guides API integration
- [ ] Black Book API integration
- [ ] Edmunds API integration
- [ ] Manheim Market Report integration

### Phase 3: Advanced Features
- [ ] Machine learning price prediction
- [ ] Seasonal trend analysis
- [ ] Depreciation forecasting
- [ ] Market anomaly detection
- [ ] Automated price alerts

### Phase 4: Enterprise Features
- [ ] Bulk vehicle valuation
- [ ] Custom market reports
- [ ] API rate limiting and authentication
- [ ] White-label reporting
- [ ] Data export (CSV, Excel, PDF)

## Technical Considerations

### Web Scraping Best Practices

**Currently Using:**
- Axios with custom headers
- Cheerio for HTML parsing
- Retry logic for failed requests
- Timeout handling

**Production Recommendations:**
- Use scraping APIs (Apify, Bright Data, ScrapingBee)
- Implement proxy rotation
- Add CAPTCHA solving service
- Respect robots.txt and rate limits
- Consider legal/ToS implications

### Performance Optimization

**Current:**
- Parallel source fetching
- In-memory data processing
- Database write batching

**Recommended:**
- Redis caching for repeat lookups
- Background job processing (Bull, BullMQ)
- CDN for static market data
- Database query optimization

### Scalability

**Considerations:**
- Queue-based research jobs
- Horizontal scaling of scraper workers
- Database read replicas for analytics
- Caching layer for frequent queries

## Legal & Compliance

### Data Scraping
- Review terms of service for each marketplace
- Implement respectful scraping (rate limits, user agents)
- Consider using official APIs where available
- Consult legal counsel for commercial use

### Data Privacy
- No PII scraping from listings
- Aggregate data only
- Clear data retention policies
- GDPR/CCPA compliance if applicable

## Monitoring & Maintenance

### Health Checks
- Source availability monitoring
- Scraper success rate tracking
- Data quality metrics
- API endpoint performance

### Alerts
- Source failures
- Data quality degradation
- Unusual price movements
- API rate limit warnings

## Support

For issues or questions:
1. Check system logs in `/backend/logs`
2. Review API error responses
3. Test individual sources using service methods
4. Contact development team

## Changelog

### v1.0.0 (Current)
- ✅ Multi-source data aggregation (CarGurus, AutoTrader)
- ✅ Intelligent price analysis and recommendations
- ✅ Comprehensive database schema
- ✅ REST API endpoints
- ✅ Market Research Agent
- ✅ Slash command integration
- ✅ Price history tracking
- ✅ Confidence scoring system

### Planned for v1.1.0
- KBB API integration
- NADA API integration
- Enhanced geographic analysis
- ML-based price prediction
- Automated daily price updates
