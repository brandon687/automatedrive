import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { decodeVIN, createSubmission, uploadMedia } from '../lib/api';
import StepIndicator from './StepIndicator';
import VehiclePreviewCard from './VehiclePreviewCard';
import PremiumMediaUpload from './PremiumMediaUpload';
import ValueEstimateDisplay from './ValueEstimateDisplay';
import LuxurySuccessModal from './LuxurySuccessModal';

interface SubmissionFormData {
  vin: string;
  mileage: number;
  condition: string;
  email: string;
  phone: string;
  name: string;
  notes?: string;
}

interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
}

const steps = [
  { number: 1, title: 'VIN Entry', subtitle: 'Vehicle Identification' },
  { number: 2, title: 'Details', subtitle: 'Vehicle Condition' },
  { number: 3, title: 'Photography', subtitle: 'Professional Images' },
  { number: 4, title: 'Contact', subtitle: 'Stay Connected' },
  { number: 5, title: 'Complete', subtitle: 'Review & Submit' },
];

export default function LuxurySubmissionForm() {
  const [step, setStep] = useState(1);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [isDecodingVIN, setIsDecodingVIN] = useState(false);
  const [vinError, setVinError] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<Record<string, File>>({});
  const [showConcierge, setShowConcierge] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<SubmissionFormData>();

  const watchedMileage = watch('mileage');
  const watchedCondition = watch('condition');

  // Handle VIN decode
  const handleVINDecode = async () => {
    const vin = getValues('vin');
    if (!vin || vin.length !== 17) {
      setVinError('VIN must be exactly 17 characters');
      return;
    }

    setIsDecodingVIN(true);
    setVinError(null);

    try {
      const response = await decodeVIN(vin);
      setVehicleInfo(response.data);

      // Smooth transition with animation
      setTimeout(() => {
        setStep(2);
      }, 600);
    } catch (error: any) {
      setVinError(error.response?.data?.error || 'Failed to decode VIN. Please verify and try again.');
    } finally {
      setIsDecodingVIN(false);
    }
  };

  // Create submission mutation
  const submissionMutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: (data) => {
      if (!data.submissionId || !data.ticketNumber) {
        console.error('Missing required fields in response:', data);
        return;
      }
      setSubmissionId(data.submissionId);
      setTicketNumber(data.ticketNumber);
      setStep(3);
    },
    onError: (error: any) => {
      console.error('Submission error:', error);
    },
  });

  // Upload media mutation
  const mediaMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      uploadMedia(id, formData),
    onSuccess: () => {
      setStep(5);
    },
  });

  // Handle details submission
  const onSubmitDetails = (data: SubmissionFormData) => {
    setStep(4);
  };

  // Handle contact & final submission
  const onSubmitFinal = (data: SubmissionFormData) => {
    submissionMutation.mutate({
      vin: data.vin,
      mileage: data.mileage,
      email: data.email,
      phone: data.phone,
      name: data.name,
    });
  };

  // Handle media upload
  const handleMediaSubmit = () => {
    if (!submissionId) return;

    const formData = new FormData();
    Object.entries(mediaFiles).forEach(([key, file]) => {
      formData.append(key, file);
    });

    mediaMutation.mutate({ id: submissionId, formData });
  };

  const requiredPhotos = [
    'front',
    'rear',
    'driver_side',
    'passenger_side',
    'steering_wheel',
    'front_seat',
    'back_seat',
  ];

  const allRequiredPhotosUploaded = requiredPhotos.every((type) => mediaFiles[type]);

  // Estimate value based on vehicle info (mock calculation)
  const getEstimatedValue = () => {
    if (!vehicleInfo) return null;

    // Mock value calculation - replace with actual API call
    const baseValues: Record<string, number> = {
      'Ford Raptor R': 109000,
      'Aston Martin DBX': 200000,
      'BMW M4': 75000,
    };

    const vehicleName = `${vehicleInfo.make} ${vehicleInfo.model}`;
    const baseValue = baseValues[vehicleName] || 50000;

    // Adjust for mileage and condition
    const mileageAdjustment = watchedMileage ? (watchedMileage / 1000) * -50 : 0;
    const conditionMultiplier = {
      excellent: 1.0,
      good: 0.95,
      fair: 0.85,
      poor: 0.7,
    }[watchedCondition] || 0.9;

    const estimatedValue = (baseValue + mileageAdjustment) * conditionMultiplier;

    return {
      low: Math.round(estimatedValue * 0.92),
      high: Math.round(estimatedValue * 1.05),
      confidence: watchedMileage && watchedCondition ? 'high' : 'medium',
    };
  };

  return (
    <div className="min-h-screen bg-luxury-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse"></div>
          <span className="text-luxury-gold text-sm font-medium tracking-widest uppercase">
            Premium Vehicle Trading
          </span>
          <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-luxury-platinum mb-3 tracking-tight">
          DealerTrade Concierge
        </h1>
        <p className="text-luxury-silver text-lg max-w-2xl mx-auto">
          Your vehicle deserves our exclusive dealer network. Experience the finest offers, delivered with discretion.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={step} />

        {/* Form Content */}
        <div className="luxury-card mt-8 animate-fade-in">
          {/* Step 1: VIN Entry */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-luxury-platinum mb-3">
                  Begin Your Journey
                </h2>
                <p className="text-luxury-silver">
                  Enter your Vehicle Identification Number to unlock an exclusive valuation
                </p>
              </div>

              <div className="max-w-xl mx-auto space-y-6">
                <div>
                  <label className="luxury-label">
                    Vehicle Identification Number
                  </label>
                  <input
                    {...register('vin', {
                      required: 'VIN is required',
                      minLength: { value: 17, message: 'VIN must be 17 characters' },
                      maxLength: { value: 17, message: 'VIN must be 17 characters' },
                    })}
                    type="text"
                    maxLength={17}
                    className="luxury-input text-center text-2xl tracking-wider"
                    placeholder="1HGBH41JXMN109186"
                    onChange={(e) => {
                      setValue('vin', e.target.value.toUpperCase());
                      setVinError(null);
                    }}
                  />
                  <p className="mt-2 text-sm text-luxury-silver/70 text-center">
                    Located on your dashboard, door jamb, or registration
                  </p>
                  {errors.vin && (
                    <p className="mt-2 text-sm text-red-400 text-center">{errors.vin.message}</p>
                  )}
                  {vinError && (
                    <p className="mt-2 text-sm text-red-400 text-center">{vinError}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVINDecode}
                  disabled={isDecodingVIN}
                  className="luxury-button-primary w-full"
                >
                  {isDecodingVIN ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="luxury-spinner"></div>
                      Decoding Vehicle...
                    </span>
                  ) : (
                    'Continue'
                  )}
                </button>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-luxury-charcoal-light/20">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-luxury-charcoal-light/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-xs text-luxury-silver">Secure & Encrypted</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-luxury-charcoal-light/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-xs text-luxury-silver">Verified Dealers</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-luxury-charcoal-light/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-xs text-luxury-silver">Best Offers</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Details */}
          {step === 2 && (
            <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-luxury-platinum mb-3 text-center">
                  Vehicle Specifications
                </h2>
                <p className="text-luxury-silver text-center mb-6">
                  Provide accurate details to maximize your valuation
                </p>

                {/* Vehicle Preview */}
                {vehicleInfo && (
                  <VehiclePreviewCard vehicleInfo={vehicleInfo} />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="luxury-label">
                    Current Mileage *
                  </label>
                  <div className="relative">
                    <input
                      {...register('mileage', {
                        required: 'Mileage is required',
                        min: { value: 0, message: 'Mileage must be positive' },
                      })}
                      type="number"
                      className="luxury-input"
                      placeholder="25,000"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-silver/50 text-sm">
                      miles
                    </span>
                  </div>
                  {errors.mileage && (
                    <p className="mt-1 text-sm text-red-400">{errors.mileage.message}</p>
                  )}
                </div>

                <div>
                  <label className="luxury-label">
                    Vehicle Condition *
                  </label>
                  <select
                    {...register('condition', { required: 'Condition is required' })}
                    className="luxury-input"
                  >
                    <option value="">Select condition</option>
                    <option value="excellent">Excellent - Like new, pristine</option>
                    <option value="good">Good - Well maintained, minor wear</option>
                    <option value="fair">Fair - Normal wear, some repairs needed</option>
                    <option value="poor">Poor - Significant wear or damage</option>
                  </select>
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-400">{errors.condition.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="luxury-label">
                  Additional Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  className="luxury-input min-h-[100px]"
                  placeholder="Notable features, recent service, modifications, or special history..."
                ></textarea>
                <p className="mt-1 text-xs text-luxury-silver/70">
                  Mention any premium packages, recent maintenance, or unique features
                </p>
              </div>

              {/* Value Estimate Preview */}
              {watchedMileage && watchedCondition && vehicleInfo && (
                <ValueEstimateDisplay estimate={getEstimatedValue()} />
              )}

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="luxury-button-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="luxury-button-primary flex-1"
                >
                  Continue to Photography
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Media Upload */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-luxury-platinum mb-3">
                  Professional Photography
                </h2>
                <p className="text-luxury-silver">
                  High-quality images significantly increase dealer interest and offer values
                </p>
              </div>

              <PremiumMediaUpload
                mediaFiles={mediaFiles}
                setMediaFiles={setMediaFiles}
                requiredPhotos={requiredPhotos}
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="luxury-button-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!allRequiredPhotosUploaded}
                  className="luxury-button-primary flex-1"
                >
                  Continue to Contact
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {step === 4 && (
            <form onSubmit={handleSubmit(onSubmitFinal)} className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-luxury-platinum mb-3">
                  Stay Connected
                </h2>
                <p className="text-luxury-silver">
                  How should our concierge team contact you with exclusive offers?
                </p>
              </div>

              <div className="max-w-xl mx-auto space-y-6">
                <div>
                  <label className="luxury-label">
                    Full Name *
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="luxury-input"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="luxury-label">
                    Email Address *
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="luxury-input"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="luxury-label">
                    Phone Number *
                  </label>
                  <input
                    {...register('phone', { required: 'Phone is required' })}
                    type="tel"
                    className="luxury-input"
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                  )}
                  <p className="mt-1 text-xs text-luxury-silver/70">
                    For time-sensitive offers and expedited communication
                  </p>
                </div>

                {/* Privacy Assurance */}
                <div className="bg-luxury-charcoal-light/10 border border-luxury-charcoal-light/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-luxury-platinum">Privacy Guaranteed</p>
                      <p className="text-xs text-luxury-silver mt-1">
                        Your information is never sold. Only verified dealers in our exclusive network will see your vehicle details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="luxury-button-secondary flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submissionMutation.isPending}
                  className="luxury-button-primary flex-1"
                >
                  {submissionMutation.isPending ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="luxury-spinner"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Submit to Dealers'
                  )}
                </button>
              </div>

              {submissionMutation.isError && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center">
                  <p className="text-red-400 text-sm font-medium">
                    Unable to submit at this time. Please try again.
                  </p>
                </div>
              )}
            </form>
          )}

          {/* Step 5: Success */}
          {step === 5 && ticketNumber && (
            <LuxurySuccessModal
              ticketNumber={ticketNumber}
              vehicleInfo={vehicleInfo}
            />
          )}
        </div>

        {/* Concierge Contact Button */}
        {!showConcierge && step < 5 && (
          <button
            onClick={() => setShowConcierge(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-luxury-gold hover:bg-luxury-gold-light rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group z-50"
            aria-label="Contact Concierge"
          >
            <svg className="w-7 h-7 text-luxury-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="absolute right-full mr-4 bg-luxury-charcoal-light text-luxury-platinum text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Concierge Assistance
            </span>
          </button>
        )}

        {/* Concierge Modal */}
        {showConcierge && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="luxury-card max-w-lg w-full relative">
              <button
                onClick={() => setShowConcierge(false)}
                className="absolute top-6 right-6 text-luxury-silver hover:text-luxury-platinum transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-luxury-gold/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-2xl font-display font-bold text-luxury-platinum mb-2">
                    Concierge Service
                  </h3>
                  <p className="text-luxury-silver">
                    Need assistance? Our luxury vehicle specialists are here to help.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <a
                    href="tel:+15551234567"
                    className="luxury-button-primary w-full inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call: (555) 123-4567
                  </a>

                  <a
                    href="mailto:concierge@dealertrade.com"
                    className="luxury-button-secondary w-full inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Us
                  </a>
                </div>

                <p className="text-xs text-luxury-silver/70 pt-4">
                  Available Monday - Saturday, 9 AM - 7 PM EST
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
