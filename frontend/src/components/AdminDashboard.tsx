import { useState, useEffect } from 'react';
import api from '../lib/api';
import APIManagement from './APIManagement';
import PricingAnalytics from './PricingAnalytics';

interface Submission {
  id: string;
  ticketNumber: string;
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  mileage: number;
  status: string;
  createdAt: string;
  submitter?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  media: Array<{
    id: string;
    type: string;
    filePath: string;
  }>;
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [shareModalSubmission, setShareModalSubmission] = useState<Submission | null>(null);
  const [shareableLink, setShareableLink] = useState<string>('');
  const [lightboxMedia, setLightboxMedia] = useState<{id: string; type: string; filePath: string;} | null>(null);
  const [activeTab, setActiveTab] = useState<'submissions' | 'apis'>('submissions');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/admin/submissions');
      setSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      forwarded: 'bg-blue-100 text-blue-800',
      quoted: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMediaUrl = (filePath: string) => {
    const cleanPath = filePath.replace(/^\/+/, '');
    return `http://localhost:3000/${cleanPath}`;
  };

  const openLightbox = (media: {id: string; type: string; filePath: string;}) => {
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

      // Create a download link
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

  const handleDownloadAll = async (submission: Submission) => {
    try {
      for (const media of submission.media) {
        await handleDownload(media.id, media.filePath);
        // Add a small delay between downloads to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Download all failed:', error);
      alert('Failed to download all files');
    }
  };

  const handleExport = async (submissionId: string) => {
    try {
      const response = await api.get(`/admin/submissions/${submissionId}/export`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : 'submission_export.zip';

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export submission');
    }
  };

  const handleShareOptions = async (submission: Submission) => {
    try {
      const response = await api.get(`/admin/submissions/${submission.id}/share`);
      setShareableLink(response.data.link);
      setShareModalSubmission(submission);
    } catch (error) {
      console.error('Failed to generate link:', error);
      alert('Failed to generate shareable link');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    alert('Link copied to clipboard!');
  };

  const handleShareWhatsApp = () => {
    const vehicle = `${shareModalSubmission?.year} ${shareModalSubmission?.make} ${shareModalSubmission?.model}`;
    const message = `Check out this vehicle submission for ${vehicle}:\n${shareableLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareSMS = () => {
    const vehicle = `${shareModalSubmission?.year} ${shareModalSubmission?.make} ${shareModalSubmission?.model}`;
    const message = `Check out this vehicle submission for ${vehicle}: ${shareableLink}`;
    const smsUrl = `sms:?&body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            {activeTab === 'submissions' ? `${submissions.length} total submissions` : 'Manage your API integrations'}
          </p>

          {/* Navigation Tabs */}
          <div className="mt-4 flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`pb-3 px-1 font-medium text-sm transition ${
                activeTab === 'submissions'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Submissions
            </button>
            <button
              onClick={() => setActiveTab('apis')}
              className={`pb-3 px-1 font-medium text-sm transition ${
                activeTab === 'apis'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              API Management
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Management Tab */}
        {activeTab === 'apis' && <APIManagement />}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {submissions.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Pending</div>
            <div className="mt-2 text-3xl font-semibold text-yellow-600">
              {submissions.filter((s) => s.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Forwarded</div>
            <div className="mt-2 text-3xl font-semibold text-blue-600">
              {submissions.filter((s) => s.status === 'forwarded').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Quoted</div>
            <div className="mt-2 text-3xl font-semibold text-green-600">
              {submissions.filter((s) => s.status === 'quoted').length}
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mileage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No submissions yet. Share the submission link to get started!
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {submission.ticketNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.year} {submission.make} {submission.model}
                      <div className="text-xs text-gray-500">{submission.vin}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.mileage.toLocaleString()} mi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.submitter?.name || 'N/A'}
                      {submission.submitter?.email && (
                        <div className="text-xs text-gray-400">
                          {submission.submitter.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleExport(submission.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Export as ZIP"
                        >
                          Export
                        </button>
                        <button
                          onClick={() => handleShareOptions(submission)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Share"
                        >
                          Share
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedSubmission.ticketNumber}
                  </h2>
                  <p className="text-gray-600">
                    {selectedSubmission.year} {selectedSubmission.make}{' '}
                    {selectedSubmission.model}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">VIN</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.vin}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Mileage</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSubmission.mileage.toLocaleString()} miles
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span
                    className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      selectedSubmission.status
                    )}`}
                  >
                    {selectedSubmission.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Pricing Analytics */}
              <div className="mb-6">
                <PricingAnalytics
                  submissionId={selectedSubmission.id}
                  vin={selectedSubmission.vin}
                  year={selectedSubmission.year}
                  make={selectedSubmission.make}
                  model={selectedSubmission.model}
                  mileage={selectedSubmission.mileage}
                />
              </div>

              {selectedSubmission.submitter && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Submitter Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Name:</strong> {selectedSubmission.submitter.name || 'N/A'}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {selectedSubmission.submitter.email || 'N/A'}
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> {selectedSubmission.submitter.phone || 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              {selectedSubmission.media.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      Media ({selectedSubmission.media.length} files)
                    </h3>
                    <button
                      onClick={() => handleDownloadAll(selectedSubmission)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Download All
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedSubmission.media.map((media) => (
                      <div key={media.id} className="border rounded-lg p-2 relative">
                        <p className="text-xs text-gray-600 mb-1 capitalize">{media.type.replace(/_/g, ' ')}</p>
                        {media.filePath.match(/\.(jpg|jpeg|png|gif|webp|heic)$/i) ? (
                          <div
                            className="relative w-full h-32 bg-gray-100 rounded overflow-hidden cursor-pointer group"
                            onClick={() => openLightbox(media)}
                          >
                            <img
                              src={getMediaUrl(media.filePath)}
                              alt={media.type}
                              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                              crossOrigin="anonymous"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2">
                                <svg className="w-4 h-4 text-gray-800" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : media.filePath.match(/\.(mp4|mov|avi|webm)$/i) ? (
                          <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                            <video
                              src={getMediaUrl(media.filePath)}
                              className="w-full h-full object-cover"
                              controls
                              crossOrigin="anonymous"
                            />
                          </div>
                        ) : (
                          <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              {media.type.includes('video') ? '🎥 Video' : '📷 Photo'}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => handleDownload(media.id, media.filePath)}
                          className="mt-2 w-full text-xs bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition-colors"
                          title="Download"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalSubmission && shareableLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Share Submission</h2>
              <button
                onClick={() => {
                  setShareModalSubmission(null);
                  setShareableLink('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              {shareModalSubmission.year} {shareModalSubmission.make}{' '}
              {shareModalSubmission.model}
            </p>

            {/* Shareable Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shareable Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleShareWhatsApp}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>Share via WhatsApp</span>
              </button>

              <button
                onClick={handleShareSMS}
                className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>Share via SMS</span>
              </button>

              <button
                onClick={() => handleExport(shareModalSubmission.id)}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8" />
                </svg>
                <span>Download as ZIP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-[70]"
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
          </>
        )}
      </div>
    </div>
  );
}
