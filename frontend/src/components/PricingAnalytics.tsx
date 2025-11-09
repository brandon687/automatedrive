import { useState, useEffect } from 'react';
import api from '../lib/api';

interface PricingInsights {
  estimatedRetail: number;
  estimatedWholesale: number;
  estimatedPrivateParty: number;
  marketTrend: 'increasing' | 'stable' | 'decreasing';
  demandLevel: 'high' | 'medium' | 'low';
  daysToSell: number;
  competitivePrice: number;
}

interface ValuationData {
  vin: string;
  marketValue: {
    low: number;
    average: number;
    high: number;
    currency: string;
  };
  confidence: string;
  source: string;
  timestamp: Date;
}

interface PricingAnalyticsProps {
  submissionId: string;
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  mileage: number;
}

export default function PricingAnalytics({
  submissionId,
  vin,
  year,
  make,
  model,
  mileage
}: PricingAnalyticsProps) {
  const [valuation, setValuation] = useState<ValuationData | null>(null);
  const [insights, setInsights] = useState<PricingInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchValuation();
  }, [submissionId]);

  const fetchValuation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/valuation/submission/${submissionId}`);

      if (response.data.success) {
        setValuation(response.data.valuation);
        setInsights(response.data.insights);
      }
    } catch (err: any) {
      console.error('Failed to fetch valuation:', err);
      setError('Unable to load pricing data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await api.post(`/valuation/submission/${submissionId}/refresh`);

      if (response.data.success) {
        setValuation(response.data.valuation);
        setInsights(response.data.insights);
      }
    } catch (err: any) {
      console.error('Failed to refresh valuation:', err);
      alert('Failed to refresh pricing data');
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

  const getConfidenceBadge = (confidence: string) => {
    const badges: { [key: string]: { color: string; text: string } } = {
      high: { color: 'bg-green-100 text-green-800', text: 'High Confidence' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Medium Confidence' },
      low: { color: 'bg-orange-100 text-orange-800', text: 'Low Confidence' },
      none: { color: 'bg-gray-100 text-gray-800', text: 'Estimated' },
    };
    return badges[confidence] || badges.none;
  };

  const getSourceBadge = (source: string) => {
    const badges: { [key: string]: { color: string; text: string } } = {
      'auto.dev': { color: 'bg-blue-100 text-blue-800', text: 'Auto.dev API' },
      'vincario': { color: 'bg-purple-100 text-purple-800', text: 'Vincario' },
      'estimated': { color: 'bg-gray-100 text-gray-800', text: 'Estimated' },
      'unavailable': { color: 'bg-red-100 text-red-800', text: 'Unavailable' },
    };
    return badges[source] || badges.estimated;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchValuation}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!valuation) {
    return null;
  }

  const { marketValue, confidence, source } = valuation;
  const confidenceBadge = getConfidenceBadge(confidence);
  const sourceBadge = getSourceBadge(source);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Valuation</h2>
            <p className="text-gray-600">
              {year} {make} {model} • {mileage.toLocaleString()} miles
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
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
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        <div className="mt-4 flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${confidenceBadge.color}`}>
            {confidenceBadge.text}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${sourceBadge.color}`}>
            {sourceBadge.text}
          </span>
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Market Price Range</h3>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Low</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(marketValue.low)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Average</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(marketValue.average)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">High</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(marketValue.high)}</p>
          </div>
        </div>

        {/* Visual Range Bar */}
        <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-green-400 via-blue-500 to-green-400 opacity-50"
            style={{ left: '0%', right: '0%' }}
          />
          <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-medium text-gray-700">
            <span>{formatCurrency(marketValue.low)}</span>
            <span className="text-blue-700 font-bold">{formatCurrency(marketValue.average)}</span>
            <span>{formatCurrency(marketValue.high)}</span>
          </div>
        </div>
      </div>

      {/* Pricing Insights */}
      {insights && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing Insights</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Estimated Retail</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(insights.estimatedRetail)}</p>
              <p className="text-xs text-gray-500 mt-1">Dealer asking price</p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Estimated Wholesale</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(insights.estimatedWholesale)}</p>
              <p className="text-xs text-gray-500 mt-1">Trade-in value</p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Private Party</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(insights.estimatedPrivateParty)}</p>
              <p className="text-xs text-gray-500 mt-1">Peer-to-peer sale</p>
            </div>

            <div className="border rounded-lg p-4 bg-blue-50">
              <p className="text-sm text-blue-700 mb-1 font-medium">Competitive Offer</p>
              <p className="text-xl font-bold text-blue-900">{formatCurrency(insights.competitivePrice)}</p>
              <p className="text-xs text-blue-600 mt-1">Recommended dealer bid</p>
            </div>
          </div>

          {/* Market Intelligence */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Demand Level</p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  insights.demandLevel === 'high'
                    ? 'bg-green-100 text-green-800'
                    : insights.demandLevel === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {insights.demandLevel.charAt(0).toUpperCase() + insights.demandLevel.slice(1)}
              </span>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Market Trend</p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  insights.marketTrend === 'increasing'
                    ? 'bg-green-100 text-green-800'
                    : insights.marketTrend === 'stable'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {insights.marketTrend === 'increasing' && '↑ Increasing'}
                {insights.marketTrend === 'stable' && '→ Stable'}
                {insights.marketTrend === 'decreasing' && '↓ Decreasing'}
              </span>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Days to Sell</p>
              <p className="text-2xl font-bold text-gray-900">{insights.daysToSell}</p>
              <p className="text-xs text-gray-500">Estimated</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {insights && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Dealer Recommendations
          </h3>

          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-1">💰 Competitive Bid Range</p>
              <p className="text-sm text-gray-600">
                Offer between {formatCurrency(insights.competitivePrice - 1000)} - {formatCurrency(insights.competitivePrice + 1000)} to be competitive
              </p>
            </div>

            {insights.demandLevel === 'high' && (
              <div className="bg-white rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-1">🔥 High Demand Alert</p>
                <p className="text-sm text-gray-600">
                  This vehicle type is in high demand. Consider offering closer to market average for better chances.
                </p>
              </div>
            )}

            {insights.daysToSell <= 20 && (
              <div className="bg-white rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-1">⚡ Fast Mover</p>
                <p className="text-sm text-gray-600">
                  Estimated to sell within {insights.daysToSell} days. Act quickly to secure this vehicle.
                </p>
              </div>
            )}

            <div className="bg-white rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-1">📊 Profit Potential</p>
              <p className="text-sm text-gray-600">
                Estimated profit margin: {formatCurrency(insights.estimatedRetail - insights.competitivePrice)}
                ({Math.round(((insights.estimatedRetail - insights.competitivePrice) / insights.competitivePrice) * 100)}% markup)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
