import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { decodeVIN, createSubmission, uploadMedia, lookupLicensePlate, getUSStates } from '../lib/api';
import MediaUpload from './MediaUpload';
import SuccessModal from './SuccessModal';

interface SubmissionFormData {
  vin: string;
  mileage: number;
  email: string;
  phone: string;
  name: string;
}

interface VehicleInfo {
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
}

export default function SubmissionForm() {
  const [step, setStep] = useState(1);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [isDecodingVIN, setIsDecodingVIN] = useState(false);
  const [vinError, setVinError] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<Record<string, File>>({});
  const [inputMethod, setInputMethod] = useState<'vin' | 'plate'>('vin');
  const [plateNumber, setPlateNumber] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [usStates, setUsStates] = useState<Array<{ code: string; name: string }>>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<SubmissionFormData>();

  // Load US states on mount
  useEffect(() => {
    async function loadStates() {
      try {
        const response = await getUSStates();
        setUsStates(response.data);
      } catch (error) {
        console.error('Failed to load states:', error);
      }
    }
    loadStates();
  }, []);

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
      setStep(2);
    } catch (error: any) {
      setVinError(error.response?.data?.error || 'Failed to decode VIN');
    } finally {
      setIsDecodingVIN(false);
    }
  };

  // Handle License Plate lookup
  const handlePlateLookup = async () => {
    if (!plateNumber || !selectedState) {
      setVinError('Please enter license plate number and select state');
      return;
    }

    setIsDecodingVIN(true);
    setVinError(null);

    try {
      const response = await lookupLicensePlate(plateNumber, selectedState);
      if (response.success && response.data) {
        // Set VIN and vehicle info
        setValue('vin', response.data.vin);
        setVehicleInfo({
          year: response.data.year,
          make: response.data.make,
          model: response.data.model,
          trim: response.data.trim
        });
        setStep(2);
      }
    } catch (error: any) {
      setVinError(error.response?.data?.error || 'License plate not found. Please try entering VIN manually.');
    } finally {
      setIsDecodingVIN(false);
    }
  };

  // Create submission mutation
  const submissionMutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: (data) => {
      console.log('[SubmissionForm] Mutation success, data:', data);
      if (!data.submissionId || !data.ticketNumber) {
        console.error('[SubmissionForm] Missing required fields in response:', data);
        return;
      }
      setSubmissionId(data.submissionId);
      setTicketNumber(data.ticketNumber);
      setStep(3);
    },
    onError: (error: any) => {
      console.error('[SubmissionForm] Mutation error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    },
  });

  // Upload media mutation
  const mediaMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      uploadMedia(id, formData),
    onSuccess: () => {
      setStep(4); // Show success screen
    },
  });

  // Handle form submission
  const onSubmit = (data: SubmissionFormData) => {
    submissionMutation.mutate({
      vin: data.vin,
      mileage: data.mileage,
      email: data.email,
      phone: data.phone,
      name: data.name,
    });
  };

  // Handle media upload
  const handleMediaUpload = () => {
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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-20 h-1 ${
                    step > s ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            VIN
          </span>
          <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Details
          </span>
          <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Photos
          </span>
          <span className={step >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Done
          </span>
        </div>
      </div>

      {/* Step 1: VIN or License Plate Entry */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Enter Vehicle Information
            </h2>
            <p className="text-gray-600">
              Choose your preferred method to identify your vehicle
            </p>
          </div>

          {/* Toggle between VIN and License Plate */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setInputMethod('vin');
                setVinError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                inputMethod === 'vin'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              VIN Number
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMethod('plate');
                setVinError(null);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                inputMethod === 'plate'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              License Plate
            </button>
          </div>

          {/* VIN Input */}
          {inputMethod === 'vin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Identification Number (VIN)
              </label>
              <input
                {...register('vin', {
                  required: inputMethod === 'vin' ? 'VIN is required' : false,
                  minLength: { value: 17, message: 'VIN must be 17 characters' },
                  maxLength: { value: 17, message: 'VIN must be 17 characters' },
                })}
                type="text"
                maxLength={17}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="1HGBH41JXMN109186"
                onChange={(e) => {
                  setValue('vin', e.target.value.toUpperCase());
                  setVinError(null);
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                Find your VIN on dashboard, door jamb, or registration
              </p>
              {errors.vin && (
                <p className="mt-1 text-sm text-red-600">{errors.vin.message}</p>
              )}
            </div>
          )}

          {/* License Plate Input */}
          {inputMethod === 'plate' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Plate Number
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => {
                    setPlateNumber(e.target.value.toUpperCase());
                    setVinError(null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  placeholder="ABC1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setVinError(null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {usStates.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500">
                We'll automatically look up your VIN from the license plate
              </p>
            </div>
          )}

          {vinError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{vinError}</p>
            </div>
          )}

          <button
            type="button"
            onClick={inputMethod === 'vin' ? handleVINDecode : handlePlateLookup}
            disabled={isDecodingVIN}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isDecodingVIN
              ? (inputMethod === 'vin' ? 'Decoding VIN...' : 'Looking up plate...')
              : 'Continue'}
          </button>
        </div>
      )}

      {/* Step 2: Vehicle Details & Contact Info */}
      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Vehicle Details
            </h2>
            {vehicleInfo && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-lg font-medium text-blue-900">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </p>
                {vehicleInfo.trim && (
                  <p className="text-sm text-blue-700">{vehicleInfo.trim}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Mileage *
            </label>
            <input
              {...register('mileage', {
                required: 'Mileage is required',
                min: { value: 0, message: 'Mileage must be positive' },
              })}
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50000"
            />
            {errors.mileage && (
              <p className="mt-1 text-sm text-red-600">{errors.mileage.message}</p>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Contact Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submissionMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {submissionMutation.isPending ? 'Submitting...' : 'Continue'}
            </button>
          </div>

          {submissionMutation.isError && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="font-semibold mb-1">Failed to submit. Please try again.</p>
              <p className="text-xs">
                {submissionMutation.error instanceof Error
                  ? submissionMutation.error.message
                  : 'An unexpected error occurred. Please check the console for details.'}
              </p>
            </div>
          )}
        </form>
      )}

      {/* Step 3: Media Upload */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Upload Photos
            </h2>
            <p className="text-gray-600">
              Take clear photos from all angles. Better photos = better quotes!
            </p>
          </div>

          <MediaUpload
            mediaFiles={mediaFiles}
            setMediaFiles={setMediaFiles}
            requiredPhotos={requiredPhotos}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Pro tip:</strong> Upload a video walkthrough for an even better
              quote! Show the exterior, interior, and any special features.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleMediaUpload}
              disabled={!allRequiredPhotosUploaded || mediaMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {mediaMutation.isPending
                ? 'Uploading...'
                : `Submit (${Object.keys(mediaFiles).length} files)`}
            </button>
          </div>

          {mediaMutation.isError && (
            <p className="text-sm text-red-600 text-center">
              Failed to upload media. Please try again.
            </p>
          )}
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && ticketNumber && (
        <SuccessModal
          ticketNumber={ticketNumber}
          vehicleInfo={vehicleInfo}
        />
      )}
    </div>
  );
}
