import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('[API Request]', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('[API Response Success]', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error('[API Response Error]', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      } : 'No response',
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
  console.log('[createSubmission] Called with:', data);
  try {
    const response = await api.post('/submissions', data);
    console.log('[createSubmission] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[createSubmission] Error:', error);
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

export default api;
