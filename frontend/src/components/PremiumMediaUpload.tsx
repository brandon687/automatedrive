import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface MediaUploadProps {
  mediaFiles: Record<string, File>;
  setMediaFiles: React.Dispatch<React.SetStateAction<Record<string, File>>>;
  requiredPhotos: string[];
}

const photoLabels: Record<string, string> = {
  front: 'Front View',
  rear: 'Rear View',
  driver_side: 'Driver Side',
  passenger_side: 'Passenger Side',
  steering_wheel: 'Dashboard & Interior',
  front_seat: 'Front Seats',
  back_seat: 'Rear Seats',
};

const photoGuidance: Record<string, string> = {
  front: '45-degree angle, show full front fascia',
  rear: '45-degree angle, show full rear and taillights',
  driver_side: 'Full side profile, wheels visible',
  passenger_side: 'Full side profile, wheels visible',
  steering_wheel: 'Instrument cluster, infotainment, controls',
  front_seat: 'Seat condition, console, door panels',
  back_seat: 'Rear seat condition and legroom',
};

interface UploadedFile {
  file: File;
  preview: string;
  assignedTo?: string;
}

export default function PremiumMediaUpload({
  mediaFiles,
  setMediaFiles,
  requiredPhotos,
}: MediaUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showAssignment, setShowAssignment] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Handle bulk file upload
  const handleBulkDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    const videoFiles = acceptedFiles.filter(file => file.type.startsWith('video/'));

    // Create preview URLs for images
    const newFiles: UploadedFile[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Auto-assign video
    if (videoFiles.length > 0) {
      setMediaFiles(prev => ({
        ...prev,
        video: videoFiles[0],
      }));
    }

    setShowAssignment(true);
  }, [setMediaFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleBulkDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.heic', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  // Assign file to a category
  const assignFile = useCallback((fileIndex: number, category: string) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles[fileIndex] = { ...newFiles[fileIndex], assignedTo: category };
      return newFiles;
    });

    setMediaFiles(prev => ({
      ...prev,
      [category]: uploadedFiles[fileIndex].file,
    }));
  }, [uploadedFiles, setMediaFiles]);

  // Remove file
  const removeFile = useCallback((fileIndex: number) => {
    const file = uploadedFiles[fileIndex];
    if (file.assignedTo) {
      setMediaFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[file.assignedTo!];
        return newFiles;
      });
    }
    URL.revokeObjectURL(file.preview);
    setUploadedFiles(prev => prev.filter((_, i) => i !== fileIndex));
  }, [uploadedFiles, setMediaFiles]);

  // Get available categories (not yet assigned)
  const getAvailableCategories = (currentAssignment?: string) => {
    const assigned = new Set(uploadedFiles.map(f => f.assignedTo).filter(Boolean));
    return requiredPhotos.filter(cat => cat === currentAssignment || !assigned.has(cat));
  };

  const uploadedCount = requiredPhotos.filter((type) => mediaFiles[type]).length;
  const hasVideo = !!mediaFiles.video;
  const allRequiredUploaded = uploadedCount === requiredPhotos.length;
  const progressPercentage = (uploadedCount / requiredPhotos.length) * 100;

  return (
    <div className="space-y-6">
      {/* Photography Guide */}
      <button
        type="button"
        onClick={() => setShowGuide(!showGuide)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-luxury-charcoal-light/20 border border-luxury-charcoal-light/30 hover:border-luxury-gold/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium text-luxury-platinum">
            Photography Guidelines - Get Better Offers
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-luxury-silver transition-transform ${showGuide ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showGuide && (
        <div className="bg-luxury-charcoal-light/20 border border-luxury-charcoal-light/30 rounded-xl p-6 space-y-4 animate-slide-down">
          <h4 className="text-lg font-semibold text-luxury-platinum mb-4">
            Professional Photo Tips
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-luxury-gold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Do This
              </h5>
              <ul className="text-xs text-luxury-silver space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold mt-0.5">•</span>
                  <span>Shoot in natural daylight (morning or late afternoon)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold mt-0.5">•</span>
                  <span>Clean vehicle thoroughly before photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold mt-0.5">•</span>
                  <span>Use 45-degree angles for exterior shots</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold mt-0.5">•</span>
                  <span>Capture all scratches, dents, or wear honestly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-luxury-gold mt-0.5">•</span>
                  <span>Include all premium features and upgrades</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium text-red-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Avoid This
              </h5>
              <ul className="text-xs text-luxury-silver space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Dark, indoor, or nighttime photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Blurry, shaky, or poorly focused images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Cluttered backgrounds or messy interiors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Extreme angles or cropped sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Hiding damage or problem areas</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-luxury-gold/10 border border-luxury-gold/20 rounded-lg p-3 mt-4">
            <p className="text-xs text-luxury-gold font-medium">
              Pro Tip: A video walkthrough can increase offers by 15-20%. Show the exterior, interior,
              engine bay, and demonstrate all features.
            </p>
          </div>
        </div>
      )}

      {/* Main Upload Zone */}
      {!showAssignment && (
        <div
          {...getRootProps()}
          className={`
            relative overflow-hidden border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-300 group
            ${
              isDragActive
                ? 'border-luxury-gold bg-luxury-gold/10 scale-[1.02]'
                : 'border-luxury-charcoal-light/30 hover:border-luxury-gold/50 bg-luxury-charcoal-light/5'
            }
          `}
        >
          <input {...getInputProps()} accept="image/*,video/*" capture="environment" />

          <div className="relative z-10 space-y-6">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-12 h-12 text-luxury-charcoal"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <div>
              <p className="text-2xl font-display font-bold text-luxury-platinum mb-3">
                {isDragActive ? 'Release to Upload' : 'Upload Your Photos'}
              </p>
              <p className="text-base text-luxury-silver mb-2">
                Upload all {requiredPhotos.length} required photos at once
              </p>
              <p className="text-sm text-luxury-silver/70">
                Tap to select or drag & drop multiple files
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-luxury-silver/70">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                JPG, PNG, HEIC
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video up to 500MB
              </span>
            </div>
          </div>

          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/0 via-luxury-gold/5 to-luxury-gold/0 -skew-x-12 animate-shine opacity-0 group-hover:opacity-100" />
        </div>
      )}

      {/* File Assignment Interface */}
      {showAssignment && uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-luxury-platinum">
              Assign Photos to Categories
            </h3>
            <button
              type="button"
              onClick={() => setShowAssignment(false)}
              className="text-sm text-luxury-gold hover:text-luxury-gold-light font-medium transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedFiles.map((uploadedFile, index) => (
              <div
                key={index}
                className={`
                  relative overflow-hidden rounded-xl p-4 transition-all duration-300
                  ${
                    uploadedFile.assignedTo
                      ? 'bg-luxury-gold/10 border-2 border-luxury-gold/30'
                      : 'bg-luxury-charcoal-light/20 border-2 border-luxury-charcoal-light/30'
                  }
                `}
              >
                <div className="flex gap-4">
                  <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-luxury-charcoal-light/30">
                    <img
                      src={uploadedFile.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {uploadedFile.assignedTo && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-luxury-gold rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-luxury-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <p className="text-xs text-luxury-silver/70 truncate">
                      {uploadedFile.file.name}
                    </p>

                    <select
                      value={uploadedFile.assignedTo || ''}
                      onChange={(e) => assignFile(index, e.target.value)}
                      className="luxury-input text-sm py-2"
                    >
                      <option value="">Select category...</option>
                      {getAvailableCategories(uploadedFile.assignedTo).map((cat) => (
                        <option key={cat} value={cat}>
                          {photoLabels[cat]}
                        </option>
                      ))}
                    </select>

                    {uploadedFile.assignedTo && photoGuidance[uploadedFile.assignedTo] && (
                      <p className="text-xs text-luxury-gold/70">
                        {photoGuidance[uploadedFile.assignedTo]}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-luxury-charcoal-light/30 to-luxury-charcoal-light/10 border border-luxury-charcoal-light/30 p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-luxury-platinum">
              Upload Progress
            </span>
            <span className="text-sm font-bold text-luxury-gold">
              {uploadedCount} / {requiredPhotos.length}
            </span>
          </div>
          <div className="h-2 bg-luxury-charcoal-light/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Category Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {requiredPhotos.map((type) => (
            <div
              key={type}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300
                ${
                  mediaFiles[type]
                    ? 'bg-luxury-gold/10 border border-luxury-gold/30'
                    : 'bg-luxury-charcoal-light/10 border border-luxury-charcoal-light/20'
                }
              `}
            >
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                ${mediaFiles[type] ? 'bg-luxury-gold' : 'bg-luxury-charcoal-light/30'}
              `}>
                {mediaFiles[type] ? (
                  <svg className="w-3 h-3 text-luxury-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-luxury-silver/30" />
                )}
              </div>
              <span className={`text-sm ${mediaFiles[type] ? 'text-luxury-gold font-medium' : 'text-luxury-silver/70'}`}>
                {photoLabels[type]}
              </span>
            </div>
          ))}
        </div>

        {/* Video Status */}
        <div className="pt-4 border-t border-luxury-charcoal-light/20">
          <div className={`
            flex items-center gap-3 px-3 py-2 rounded-lg
            ${hasVideo ? 'bg-luxury-gold/10 border border-luxury-gold/30' : 'bg-luxury-charcoal-light/10 border border-luxury-charcoal-light/20'}
          `}>
            <div className={`
              w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
              ${hasVideo ? 'bg-luxury-gold' : 'bg-luxury-charcoal-light/30'}
            `}>
              {hasVideo ? (
                <svg className="w-3 h-3 text-luxury-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-luxury-silver/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <span className={`text-sm ${hasVideo ? 'text-luxury-gold font-medium' : 'text-luxury-silver/70'}`}>
                Optional Video Walkthrough {hasVideo && `(${(mediaFiles.video!.size / 1024 / 1024).toFixed(1)} MB)`}
              </span>
              {hasVideo && (
                <p className="text-xs text-luxury-gold/70 mt-0.5">
                  +15% expected offer increase
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {allRequiredUploaded && (
          <div className="mt-4 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg p-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-luxury-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-luxury-gold">
                  All Required Photos Uploaded
                </p>
                <p className="text-xs text-luxury-silver/70 mt-0.5">
                  Ready to submit to our dealer network
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add more files button when in assignment mode */}
      {showAssignment && (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-luxury-gold/30 rounded-xl p-6 text-center cursor-pointer hover:border-luxury-gold hover:bg-luxury-gold/5 transition-all group"
        >
          <input {...getInputProps()} accept="image/*,video/*" capture="environment" />
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm text-luxury-gold font-medium group-hover:text-luxury-gold-light transition-colors">
              Add more photos or video
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
