interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
}

interface LuxurySuccessModalProps {
  ticketNumber: string;
  vehicleInfo: VehicleInfo | null;
}

export default function LuxurySuccessModal({
  ticketNumber,
  vehicleInfo,
}: LuxurySuccessModalProps) {
  const shareUrl = `${window.location.origin}${window.location.pathname}`;
  const shareText = `I just submitted my vehicle to DealerTrade's exclusive dealer network. Experience premium vehicle trading: ${shareUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ticketNumber);
    // Could add a toast notification here
    alert('Submission number copied to clipboard!');
  };

  return (
    <div className="text-center space-y-8 animate-fade-in">
      {/* Success Icon */}
      <div className="relative">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-full flex items-center justify-center shadow-2xl shadow-luxury-gold/30">
          <svg
            className="w-12 h-12 text-luxury-charcoal"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div className="absolute inset-0 w-24 h-24 mx-auto bg-luxury-gold rounded-full animate-ping opacity-20" />
      </div>

      {/* Main Message */}
      <div>
        <h2 className="text-4xl font-display font-bold text-luxury-platinum mb-3">
          Submission Complete
        </h2>
        <p className="text-lg text-luxury-silver max-w-lg mx-auto">
          Your vehicle has been submitted to our exclusive dealer network
        </p>
      </div>

      {/* Submission Details Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-charcoal-light to-luxury-charcoal border border-luxury-gold/30 p-8 max-w-md mx-auto">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative z-10 space-y-4">
          <p className="text-sm text-luxury-silver/70 uppercase tracking-widest">
            Your Submission Number
          </p>
          <div
            className="inline-flex items-center gap-3 cursor-pointer group"
            onClick={copyToClipboard}
          >
            <p className="text-4xl font-display font-bold text-luxury-gold">
              {ticketNumber}
            </p>
            <svg
              className="w-5 h-5 text-luxury-silver/50 group-hover:text-luxury-gold transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>

          {vehicleInfo && (
            <div className="pt-4 border-t border-luxury-charcoal-light/30">
              <p className="text-xl font-semibold text-luxury-platinum">
                {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
              </p>
              {vehicleInfo.trim && (
                <p className="text-sm text-luxury-gold mt-1">{vehicleInfo.trim}</p>
              )}
            </div>
          )}
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-luxury-gold/10 to-transparent -skew-x-12 animate-shine" />
      </div>

      {/* Timeline */}
      <div className="bg-luxury-charcoal-light/20 border border-luxury-charcoal-light/30 rounded-2xl p-8 max-w-2xl mx-auto">
        <h3 className="text-xl font-display font-bold text-luxury-platinum mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What Happens Next
        </h3>

        <div className="space-y-6">
          {[
            {
              step: 1,
              title: 'Immediate Review',
              description: 'Our team verifies your submission details and photography',
              time: 'Within 2 hours',
            },
            {
              step: 2,
              title: 'Dealer Distribution',
              description: 'Your vehicle is presented to our curated network of verified dealers',
              time: '2-4 hours',
            },
            {
              step: 3,
              title: 'Competitive Bidding',
              description: 'Dealers submit their best offers based on current market demand',
              time: '12-24 hours',
            },
            {
              step: 4,
              title: 'Exclusive Offers',
              description: "We'll email and call you with the top offers for your consideration",
              time: '24-48 hours',
            },
          ].map((item, index) => (
            <div key={item.step} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-luxury-gold/20 border-2 border-luxury-gold flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-luxury-gold">{item.step}</span>
                </div>
                {index < 3 && (
                  <div className="w-0.5 h-full bg-gradient-to-b from-luxury-gold/30 to-transparent mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-base font-semibold text-luxury-platinum">
                    {item.title}
                  </h4>
                  <span className="text-xs text-luxury-gold font-medium">{item.time}</span>
                </div>
                <p className="text-sm text-luxury-silver/80">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div className="bg-luxury-charcoal-light/20 border border-luxury-charcoal-light/30 rounded-xl p-6 hover:border-luxury-gold/30 transition-colors">
          <div className="w-12 h-12 mx-auto mb-3 bg-luxury-gold/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-luxury-platinum mb-1">
            Check Your Email
          </p>
          <p className="text-xs text-luxury-silver/70">
            Confirmation sent with full details
          </p>
        </div>

        <div className="bg-luxury-charcoal-light/20 border border-luxury-charcoal-light/30 rounded-xl p-6 hover:border-luxury-gold/30 transition-colors">
          <div className="w-12 h-12 mx-auto mb-3 bg-luxury-gold/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-luxury-platinum mb-1">
            SMS Updates
          </p>
          <p className="text-xs text-luxury-silver/70">
            Real-time offer notifications
          </p>
        </div>
      </div>

      {/* Concierge Contact */}
      <div className="bg-gradient-to-br from-luxury-gold/10 to-luxury-charcoal-light/10 border border-luxury-gold/30 rounded-2xl p-6 max-w-lg mx-auto">
        <h4 className="text-lg font-semibold text-luxury-platinum mb-2">
          Questions or Updates?
        </h4>
        <p className="text-sm text-luxury-silver/80 mb-4">
          Our concierge team is available to assist you throughout the process
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="tel:+15551234567"
            className="luxury-button-primary flex-1 text-sm py-3 inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Concierge
          </a>
          <a
            href="mailto:concierge@dealertrade.com"
            className="luxury-button-secondary flex-1 text-sm py-3 inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Us
          </a>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="border-t border-luxury-charcoal-light/20 pt-8">
        <p className="text-sm text-luxury-silver/80 mb-4">
          Know someone looking to sell their luxury vehicle?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert('Link copied to clipboard!');
            }}
            className="luxury-button-secondary flex-1 text-sm py-3"
          >
            Copy Link
          </button>
          <button
            onClick={() => {
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
              window.open(url, '_blank');
            }}
            className="luxury-button-secondary flex-1 text-sm py-3"
          >
            Share on X
          </button>
        </div>
      </div>

      {/* New Submission */}
      <button
        onClick={() => window.location.reload()}
        className="text-luxury-gold hover:text-luxury-gold-light text-sm font-medium transition-colors inline-flex items-center gap-2 group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Submit Another Vehicle
      </button>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-6 text-xs text-luxury-silver/50 pt-4">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure & Encrypted
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Privacy Protected
        </span>
      </div>
    </div>
  );
}
