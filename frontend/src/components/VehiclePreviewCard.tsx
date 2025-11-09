interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
}

interface VehiclePreviewCardProps {
  vehicleInfo: VehicleInfo;
}

export default function VehiclePreviewCard({ vehicleInfo }: VehiclePreviewCardProps) {
  // Determine if this is a luxury/performance vehicle based on make
  const luxuryBrands = ['Aston Martin', 'Ferrari', 'Lamborghini', 'Porsche', 'McLaren', 'Bentley', 'Rolls-Royce', 'Maserati'];
  const performanceBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Ford'];

  const isLuxury = luxuryBrands.some(brand => vehicleInfo.make?.includes(brand));
  const isPerformance = performanceBrands.some(brand => vehicleInfo.make?.includes(brand));

  const badgeColor = isLuxury ? 'luxury-gold' : isPerformance ? 'luxury-platinum' : 'luxury-silver';
  const badgeText = isLuxury ? 'Luxury' : isPerformance ? 'Performance' : 'Premium';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-charcoal-light to-luxury-charcoal border border-luxury-charcoal-light/30 p-6 mb-6 animate-slide-up">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${badgeColor}/20 border border-${badgeColor}/30`}>
            <div className={`w-2 h-2 rounded-full bg-${badgeColor} animate-pulse`} />
            <span className={`text-xs font-medium text-${badgeColor} uppercase tracking-wider`}>
              {badgeText} Vehicle
            </span>
          </span>

          <svg className="w-8 h-8 text-luxury-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        {/* Vehicle Info */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-display font-bold text-luxury-platinum">
              {vehicleInfo.year}
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-luxury-gold/30 to-transparent mt-4" />
          </div>

          <div>
            <p className="text-2xl font-semibold text-luxury-platinum">
              {vehicleInfo.make}
            </p>
            <p className="text-xl text-luxury-silver mt-1">
              {vehicleInfo.model}
            </p>
            {vehicleInfo.trim && (
              <p className="text-sm text-luxury-gold mt-2 font-medium">
                {vehicleInfo.trim}
              </p>
            )}
          </div>
        </div>

        {/* Decorative Element */}
        <div className="mt-6 flex items-center gap-2 text-xs text-luxury-silver/50">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Vehicle Verified via NHTSA Database</span>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shine" />
    </div>
  );
}
