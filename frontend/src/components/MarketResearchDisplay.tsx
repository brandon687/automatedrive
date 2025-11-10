import { useState, useEffect } from 'react';
import api from '../lib/api';

interface StateBreakdown {
  [state: string]: {
    count: number;
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
  };
}

interface MarketAnalysis {
  marketLow: number;
  marketAverage: number;
  marketHigh: number;
  recommendedDealerOffer: number;
  overallConfidence: number;
  marketDemand: string;
  averageDaysToSell: number;
  lastUpdated: string;
}

interface PricingData {
  submissionId: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    vin: string;
    mileage: number;
  };
  marketAnalysis: MarketAnalysis | null;
  stateBreakdown: StateBreakdown;
  totalComparables: number;
  dataSources: number;
  researchJobs: Array<{
    id: string;
    status: string;
    completedAt: string | null;
  }>;
  lastUpdated: string;
}

interface MarketResearchDisplayProps {
  submissionId: string;
}

export default function MarketResearchDisplay({ submissionId }: MarketResearchDisplayProps) {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStates, setExpandedStates] = useState(false);

  useEffect(() => {
    fetchPricingData();
  }, [submissionId]);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/admin/submissions/${submissionId}/pricing`);
      setPricingData(response.data);
    } catch (err: any) {
      console.error('Failed to fetch pricing data:', err);
      setError('Unable to load market research data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await api.post(`/admin/submissions/${submissionId}/refresh-pricing`);

      // Poll for completion
      setTimeout(() => {
        fetchPricingData();
      }, 3000);

      alert('Pricing refresh initiated. Data will update in a few seconds.');
    } catch (err: any) {
      console.error('Failed to refresh pricing:', err);
      alert('Failed to trigger pricing refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  const getDemandBadge = (demand: string) => {
    const badges: { [key: string]: { color: string; label: string } } = {
      high: { color: 'bg-green-100 text-green-800', label: '🔥 High Demand' },
      medium: { color: 'bg-blue-100 text-blue-800', label: '📊 Medium Demand' },
      low: { color: 'bg-gray-100 text-gray-800', label: '📉 Low Demand' },
    };
    return badges[demand.toLowerCase()] || badges.medium;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading market research data...</p>
        </div>
      </div>
    );
  }

  if (error || !pricingData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600">
          <p>{error || 'No pricing data available'}</p>
          <button
            onClick={fetchPricingData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { vehicle, marketAnalysis, stateBreakdown, totalComparables, dataSources } = pricingData;
  const stateList = Object.entries(stateBreakdown).slice(0, expandedStates ? undefined : 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Market Research Intelligence</h2>
            <p className="text-blue-100">
              {vehicle.year} {vehicle.make} {vehicle.model}
              {vehicle.trim && ` ${vehicle.trim}`}
            </p>
            <p className="text-sm text-blue-200 mt-1">
              {vehicle.mileage.toLocaleString()} miles • VIN: {vehicle.vin}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 disabled:opacity-50 flex items-center space-x-2"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>

        {/* Research Status */}
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="font-medium">{totalComparables}</span> comparables found
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="font-medium">{dataSources}</span> data sources
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="font-medium">{Object.keys(stateBreakdown).length}</span> states
          </div>
        </div>
      </div>

      {/* Market Analysis */}
      {marketAnalysis ? (
        <>
          {/* Price Range Overview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Nationwide Market Price Range</h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(marketAnalysis.overallConfidence)}`}>
                  {getConfidenceLabel(marketAnalysis.overallConfidence)} Confidence ({marketAnalysis.overallConfidence}%)
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDemandBadge(marketAnalysis.marketDemand).color}`}>
                  {getDemandBadge(marketAnalysis.marketDemand).label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Market Low</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(marketAnalysis.marketLow)}</p>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-2 font-medium">Market Average</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(marketAnalysis.marketAverage)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Market High</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(marketAnalysis.marketHigh)}</p>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700 mb-2 font-medium">Recommended Dealer Offer</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(marketAnalysis.recommendedDealerOffer)}</p>
              </div>
            </div>

            {/* Visual Price Range */}
            <div className="relative h-12 bg-gray-200 rounded-lg overflow-hidden">
              <div className="absolute h-full bg-gradient-to-r from-gray-400 via-blue-500 to-gray-400" style={{ left: '0%', right: '0%' }} />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <span className="text-xs font-medium text-white drop-shadow">{formatCurrency(marketAnalysis.marketLow)}</span>
                <span className="text-sm font-bold text-white drop-shadow">AVG: {formatCurrency(marketAnalysis.marketAverage)}</span>
                <span className="text-xs font-medium text-white drop-shadow">{formatCurrency(marketAnalysis.marketHigh)}</span>
              </div>
            </div>

            {/* Market Insights */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600">Average Days to Sell</p>
                <p className="text-2xl font-bold text-gray-900">{marketAnalysis.averageDaysToSell} days</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-600">Expected Profit Margin</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(marketAnalysis.marketAverage - marketAnalysis.recommendedDealerOffer)}
                </p>
                <p className="text-xs text-gray-500">
                  ({Math.round(((marketAnalysis.marketAverage - marketAnalysis.recommendedDealerOffer) / marketAnalysis.recommendedDealerOffer) * 100)}% markup)
                </p>
              </div>
            </div>
          </div>

          {/* State-by-State Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">State-by-State Price Analysis</h3>
              <p className="text-sm text-gray-600">Prices by location across the USA</p>
            </div>

            {Object.keys(stateBreakdown).length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stateList.map(([state, data]) => (
                    <div key={state} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{state}</h4>
                          <p className="text-sm text-gray-500">{data.count} listings</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-600">{formatCurrency(data.avgPrice)}</p>
                          <p className="text-xs text-gray-500">Average</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-600">Low</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(data.minPrice)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600">High</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(data.maxPrice)}</p>
                        </div>
                      </div>
                      {/* Price range bar */}
                      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '100%' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {Object.keys(stateBreakdown).length > 10 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setExpandedStates(!expandedStates)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      {expandedStates ? 'Show Less' : `Show All ${Object.keys(stateBreakdown).length} States`}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">No state-level data available yet</p>
            )}
          </div>

          {/* Dealer Recommendations */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Dealer Action Items
            </h3>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-1">💰 Recommended Dealer Offer</p>
                <p className="text-sm text-gray-600">
                  Offer {formatCurrency(marketAnalysis.recommendedDealerOffer)} to stay competitive while maintaining healthy margins.
                </p>
              </div>

              {marketAnalysis.marketDemand.toLowerCase() === 'high' && (
                <div className="bg-white rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-1">🔥 High Demand Vehicle</p>
                  <p className="text-sm text-gray-600">
                    This vehicle is in high demand. Consider offering closer to market average ({formatCurrency(marketAnalysis.marketAverage)}) to secure the deal.
                  </p>
                </div>
              )}

              {marketAnalysis.averageDaysToSell <= 25 && (
                <div className="bg-white rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-1">⚡ Fast-Moving Inventory</p>
                  <p className="text-sm text-gray-600">
                    Expected to sell in {marketAnalysis.averageDaysToSell} days. Quick turnover makes this a valuable acquisition.
                  </p>
                </div>
              )}

              <div className="bg-white rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-1">📊 Market Confidence: {getConfidenceLabel(marketAnalysis.overallConfidence)}</p>
                <p className="text-sm text-gray-600">
                  Based on {totalComparables} comparable vehicles across {Object.keys(stateBreakdown).length} states.
                  Data confidence: {marketAnalysis.overallConfidence}%
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 font-medium">Market research is being processed</p>
          <p className="text-sm text-yellow-700 mt-2">Pricing data will be available shortly. Check back in a few moments.</p>
          <button
            onClick={fetchPricingData}
            className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            Check Again
          </button>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(pricingData.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
