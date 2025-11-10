# Price Research Command

Launch the Market Research Agent to perform comprehensive vehicle pricing analysis.

## Usage

```
/price-research [VIN or "YEAR MAKE MODEL"]
```

## Examples

```
/price-research 1HGBH41JXMN109186
/price-research 2023 Ford F-150 Raptor R
/price-research 2021 BMW M4 Competition
```

## What This Does

The Market Research Agent will:

1. **Search Multiple Sources**: CarGurus, AutoTrader, and other marketplaces
2. **Find Comparable Listings**: Vehicles matching year, make, model, mileage
3. **Analyze Pricing Data**: Calculate market low, average, high, and recommended prices
4. **Assess Market Conditions**: Demand level, days-to-sell, price trends
5. **Generate Report**: Comprehensive pricing analysis with confidence levels

## Agent Instructions

You must use the Task tool to launch the "market-research" specialized agent with the following prompt:

```
Perform comprehensive market research for: [VEHICLE INFO]

Use WebSearch extensively to:
1. Search CarGurus for comparable listings
2. Search AutoTrader for similar vehicles
3. Find recent sales data if available
4. Research market conditions

Provide a complete VEHICLE MARKET RESEARCH REPORT including:
- Pricing Analysis (low, average, high, recommended)
- Market Intelligence (demand, trends, days-to-sell)
- Comparable Listings Sample (at least 5-10 examples)
- Detailed Insights and Recommendations
- Confidence Level based on data quality

Remember to:
- Filter for vehicles within +/- 20k miles
- Same year or +/- 1 year
- Exclude obvious outliers
- Note data freshness and sources
- Provide dealer-grade accuracy
```

Then format and present the results to the user in a clean, readable format.
