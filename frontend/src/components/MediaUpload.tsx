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
  steering_wheel: 'Steering Wheel',
  front_seat: 'Front Seat',
  back_seat: 'Back Seat',
};

interface UploadedFile {
  file: File;
  preview: string;
  assignedTo?: string;
}

export default function MediaUpload({
  mediaFiles,
  setMediaFiles,
  requiredPhotos,
}: MediaUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showAssignment, setShowAssignment] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Main Upload Zone */}
      {!showAssignment && (
        <div
          {...getRootProps()}
          className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all active:scale-98 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-blue-400 bg-gradient-to-br from-gray-50 to-white hover:shadow-lg'
          }`}
        >
          <input {...getInputProps()} accept="image/*,video/*" capture="environment" />
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 mb-2">
                Upload All Photos & Video
              </p>
              <p className="text-base text-gray-600 mb-1">
                Upload all {requiredPhotos.length} photos + optional video at once
              </p>
              <p className="text-sm text-gray-500">
                {isDragActive ? 'Drop files here!' : '📸 Tap to select or drag & drop multiple files'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>✓ Images: JPG, PNG, HEIC</span>
              <span>•</span>
              <span>✓ Video: MP4, MOV (max 500MB)</span>
            </div>
          </div>
        </div>
      )}

      {/* File Assignment Interface */}
      {showAssignment && uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Assign Photos to Categories</h3>
            <button
              type="button"
              onClick={() => {
                setShowAssignment(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              + Upload More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedFiles.map((uploadedFile, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 ${
                  uploadedFile.assignedTo
                    ? 'border-green-400 bg-green-50'
                    : 'border-orange-300 bg-orange-50'
                }`}
              >
                <div className="flex gap-4">
                  <img
                    src={uploadedFile.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg shadow"
                  />
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-medium text-gray-600">
                      {uploadedFile.file.name}
                    </p>
                    <select
                      value={uploadedFile.assignedTo || ''}
                      onChange={(e) => assignFile(index, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category...</option>
                      {getAvailableCategories(uploadedFile.assignedTo).map((cat) => (
                        <option key={cat} value={cat}>
                          {photoLabels[cat]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
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
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">Required Photos</p>
            <p className="text-2xl font-bold text-blue-600">
              {uploadedCount} / {requiredPhotos.length}
            </p>
          </div>
          {allRequiredUploaded && (
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          )}
        </div>

        {/* Category Checklist */}
        <div className="grid grid-cols-2 gap-2">
          {requiredPhotos.map((type) => (
            <div
              key={type}
              className={`flex items-center gap-2 text-sm ${
                mediaFiles[type] ? 'text-green-700 font-medium' : 'text-gray-500'
              }`}
            >
              {mediaFiles[type] ? '✓' : '○'} {photoLabels[type]}
            </div>
          ))}
        </div>

        {/* Video Status */}
        <div className="pt-3 border-t border-gray-200">
          <div className={`flex items-center gap-2 text-sm ${hasVideo ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
            {hasVideo ? '✓' : '○'} Optional Video {hasVideo && `(${(mediaFiles.video!.size / 1024 / 1024).toFixed(2)} MB)`}
          </div>
        </div>
      </div>

      {/* Add more files button when in assignment mode */}
      {showAssignment && (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <input {...getInputProps()} accept="image/*,video/*" capture="environment" />
          <p className="text-sm text-blue-600 font-medium">+ Click to add more photos or video</p>
        </div>
      )}
    </div>
  );
}
