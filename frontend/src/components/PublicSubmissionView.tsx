import { useState, useEffect } from 'react';
import { useParams } from './useParams';
import api from '../lib/api';

interface Media {
  id: string;
  type: string;
  filePath: string;
  mimeType?: string;
}

interface Submission {
  id: string;
  ticketNumber: string;
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  mileage: number;
  status: string;
  createdAt: string;
  media: Media[];
  submitter?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export default function PublicSubmissionView() {
  const { ticketNumber } = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxMedia, setLightboxMedia] = useState<Media | null>(null);

  useEffect(() => {
    if (ticketNumber) {
      fetchSubmission();
    }
  }, [ticketNumber]);

  const fetchSubmission = async () => {
    try {
      const response = await api.get(`/submissions/${ticketNumber}`);
      console.log('Submission data:', response.data);
      console.log('Media files:', response.data.media);
      setSubmission(response.data);
    } catch (error: any) {
      console.error('Failed to fetch submission:', error);
      setError('Submission not found');
    } finally {
      setLoading(false);
    }
  };

  const getMediaUrl = (filePath: string) => {
    // Backend serves static files from /uploads
    // filePath is already like "uploads/front-xxx.jpg"
    const cleanPath = filePath.replace(/^\/+/, '');
    return `http://localhost:3000/${cleanPath}`;
  };

  const openLightbox = (media: Media) => {
    setLightboxMedia(media);
  };

  const closeLightbox = () => {
    setLightboxMedia(null);
  };

  const handleDownload = async (mediaId: string, filePath: string) => {
    try {
      const filename = filePath.split('/').pop() || 'download';
      const response = await api.get(`/submissions/media/${mediaId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Submission Not Found</h1>
          <p className="text-gray-600 mb-6">
            The submission you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">DealerTrade</h1>
          <p className="text-gray-600">Vehicle Submission Details</p>
        </header>

        {/* Submission Card */}
        <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-600 text-white p-6">
            <h2 className="text-3xl font-bold mb-2">
              {submission.year} {submission.make} {submission.model}
            </h2>
            <p className="text-blue-100">Ticket: {submission.ticketNumber}</p>
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">VIN</h3>
                <p className="text-lg text-gray-900">{submission.vin}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Mileage</h3>
                <p className="text-lg text-gray-900">
                  {submission.mileage.toLocaleString()} miles
                </p>
              </div>
              {submission.trim && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Trim</h3>
                  <p className="text-lg text-gray-900">{submission.trim}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Submitted</h3>
                <p className="text-lg text-gray-900">
                  {new Date(submission.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Media Gallery */}
            {submission.media.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Media Gallery ({submission.media.length} files)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {submission.media.map((media) => (
                    <div key={media.id} className="border rounded-lg p-2 group relative">
                      <p className="text-xs text-gray-600 mb-2 font-medium capitalize">
                        {media.type.replace(/_/g, ' ')}
                      </p>
                      {media.filePath.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i) ? (
                        <div
                          className="relative w-full h-48 bg-gray-100 rounded overflow-hidden cursor-pointer group"
                          onClick={() => openLightbox(media)}
                        >
                          <img
                            src={getMediaUrl(media.filePath)}
                            alt={media.type}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                            crossOrigin="anonymous"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3">
                              <svg className="w-6 h-6 text-gray-800" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : media.filePath.match(/\.(mp4|mov|avi|webm)$/i) ? (
                        <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                          <video
                            src={getMediaUrl(media.filePath)}
                            className="w-full h-full object-cover"
                            controls
                            crossOrigin="anonymous"
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            {media.type.includes('video') ? '🎥 Video' : '📷 Photo'}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => handleDownload(media.id, media.filePath)}
                        className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center">
            <p className="text-gray-600 text-sm">
              This is a secure link to view your vehicle submission.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Powered by DealerTrade
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          >
            <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div className="max-w-7xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            {lightboxMedia.filePath.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i) ? (
              <img
                src={getMediaUrl(lightboxMedia.filePath)}
                alt={lightboxMedia.type}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                crossOrigin="anonymous"
              />
            ) : lightboxMedia.filePath.match(/\.(mp4|mov|avi|webm)$/i) ? (
              <video
                src={getMediaUrl(lightboxMedia.filePath)}
                className="max-w-full max-h-[90vh] rounded-lg"
                controls
                autoPlay
                crossOrigin="anonymous"
              />
            ) : null}

            <div className="mt-4 text-center">
              <p className="text-white text-sm capitalize mb-2">
                {lightboxMedia.type.replace(/_/g, ' ')}
              </p>
              <button
                onClick={() => handleDownload(lightboxMedia.id, lightboxMedia.filePath)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
