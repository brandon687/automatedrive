import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information
    console.error('[API Error]', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// VIN Decoder
export async function decodeVIN(vin: string) {
  const response = await api.get(`/vin/decode/${vin}`);
  return response.data;
}

// Create submission
export async function createSubmission(data: {
  vin: string;
  mileage: number;
  email?: string;
  phone?: string;
  name?: string;
}) {
  try {
    const response = await api.post('/submissions', data);
    console.log('[createSubmission] Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[createSubmission] Failed:', error.message);
    throw error;
  }
}

// Upload media files
export async function uploadMedia(submissionId: string, files: FormData) {
  const response = await api.post(`/submissions/${submissionId}/media`, files, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Get submission by ticket number
export async function getSubmission(ticketNumber: string) {
  const response = await api.get(`/submissions/${ticketNumber}`);
  return response.data;
}

// License Plate Lookup
export async function lookupLicensePlate(plateNumber: string, state: string) {
  const response = await api.post('/license-plate/lookup', { plateNumber, state });
  return response.data;
}

// Get US States
export async function getUSStates() {
  const response = await api.get('/license-plate/states');
  return response.data;
}

export default api;
