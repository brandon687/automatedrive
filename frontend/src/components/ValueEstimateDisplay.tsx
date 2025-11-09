interface ValueEstimate {
  low: number;
  high: number;
  confidence: 'high' | 'medium' | 'low';
}

interface ValueEstimateDisplayProps {
  estimate: ValueEstimate | null;
}

export default function ValueEstimateDisplay({ estimate }: ValueEstimateDisplayProps) {
  if (!estimate) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const confidenceConfig = {
    high: {
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
      borderColor: 'border-green-400/30',
      label: 'High Confidence',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    medium: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      borderColor: 'border-yellow-400/30',
      label: 'Medium Confidence',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    low: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      borderColor: 'border-blue-400/30',
      label: 'Estimated Range',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const config = confidenceConfig[estimate.confidence];
  const midPoint = (estimate.low + estimate.high) / 2;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-gold/10 via-luxury-charcoal-light/50 to-luxury-charcoal-light border border-luxury-gold/20 p-6 animate-slide-up">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-luxury-gold/10 rounded-full blur-3xl" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-luxury-platinum flex items-center gap-2">
              <svg className="w-5 h-5 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Estimated Market Value
            </h3>
            <p className="text-xs text-luxury-silver/70 mt-1">
              Based on current market data and vehicle specifications
            </p>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} border ${config.borderColor}`}>
            <span className={config.color}>{config.icon}</span>
            <span className={`text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Value Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Low Estimate */}
          <div className="text-center">
            <p className="text-xs text-luxury-silver/70 mb-2 uppercase tracking-wider">
              Conservative
            </p>
            <p className="text-2xl font-bold text-luxury-silver">
              {formatCurrency(estimate.low)}
            </p>
          </div>

          {/* Mid Estimate - Highlighted */}
          <div className="text-center relative">
            <div className="absolute inset-0 bg-luxury-gold/5 rounded-xl border border-luxury-gold/20" />
            <div className="relative z-10 py-2">
              <p className="text-xs text-luxury-gold mb-2 uppercase tracking-wider font-semibold">
                Expected Value
              </p>
              <p className="text-4xl font-display font-bold text-luxury-gold">
                {formatCurrency(midPoint)}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <div className="w-1 h-1 rounded-full bg-luxury-gold animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-luxury-gold animate-pulse delay-100" />
                <div className="w-1 h-1 rounded-full bg-luxury-gold animate-pulse delay-200" />
              </div>
            </div>
          </div>

          {/* High Estimate */}
          <div className="text-center">
            <p className="text-xs text-luxury-silver/70 mb-2 uppercase tracking-wider">
              Optimistic
            </p>
            <p className="text-2xl font-bold text-luxury-silver">
              {formatCurrency(estimate.high)}
            </p>
          </div>
        </div>

        {/* Range Bar */}
        <div className="relative">
          <div className="h-2 bg-luxury-charcoal-light rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-luxury-silver via-luxury-gold to-luxury-platinum animate-pulse-slow" />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-luxury-silver/50">Floor</span>
            <span className="text-xs text-luxury-silver/50">Ceiling</span>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-luxury-charcoal-light/30 border border-luxury-charcoal-light/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-luxury-silver/90 leading-relaxed">
              <p className="font-medium text-luxury-platinum mb-1">
                How dealers will evaluate your vehicle:
              </p>
              <ul className="space-y-1 text-xs">
                <li>• Market demand and recent sales data</li>
                <li>• Condition, maintenance history, and documentation</li>
                <li>• Photo quality and presentation</li>
                <li>• Dealer inventory needs and regional preferences</li>
              </ul>
              <p className="mt-3 text-xs text-luxury-gold">
                High-quality photos can increase offers by 10-15%
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-luxury-silver/50 text-center border-t border-luxury-charcoal-light/20 pt-4">
          This is a preliminary estimate. Final offers will vary based on dealer inspection and market conditions.
        </p>
      </div>
    </div>
  );
}
