import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function createSubmission(data) {
  const response = await api.post('/submissions', data);
  return response.data;
}

// Test the submission
createSubmission({
  vin: "WBSMW9C50PCA63726",
  mileage: 4000,
  name: "brandon in",
  email: "inbrandon98@gmail.com",
  phone: "6613424394"
})
.then(data => {
  console.log('SUCCESS:', JSON.stringify(data, null, 2));
  console.log('submissionId:', data.submissionId);
  console.log('ticketNumber:', data.ticketNumber);
})
.catch(error => {
  console.error('ERROR:', error.message);
  if (error.response) {
    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);
  }
});
