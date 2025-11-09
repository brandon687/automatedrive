import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function createSubmission(data) {
  console.log('Making request to:', API_BASE_URL + '/submissions');
  console.log('Request data:', data);
  
  try {
    const response = await api.post('/submissions', data);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);
    
    // Check what axios considers as success
    if (response.status >= 200 && response.status < 300) {
      console.log('Axios treats this as SUCCESS');
    } else {
      console.log('Axios treats this as ERROR');
    }
    
    return response.data;
  } catch (error) {
    console.error('Axios threw an error!');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    throw error;
  }
}

createSubmission({
  vin: "WBSMW9C50PCA63726",
  mileage: 4000,
  name: "brandon in",
  email: "inbrandon98@gmail.com",
  phone: "6613424394"
})
.then(data => {
  console.log('\n=== FINAL RESULT ===');
  console.log('Success! Data returned:', data);
  console.log('submissionId exists?', !!data.submissionId);
  console.log('ticketNumber exists?', !!data.ticketNumber);
})
.catch(error => {
  console.log('\n=== FINAL RESULT ===');
  console.log('Failed!', error.message);
});
