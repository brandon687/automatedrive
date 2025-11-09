const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.post('/submissions', {
  vin: "WBSMW9C50PCA63726",
  mileage: 4000,
  name: "brandon in",
  email: "inbrandon98@gmail.com",
  phone: "6613424394"
})
.then(response => {
  console.log('SUCCESS!');
  console.log('Status:', response.status);
  console.log('Data:', response.data);
  console.log('Has submissionId?', 'submissionId' in response.data);
  console.log('Has ticketNumber?', 'ticketNumber' in response.data);
})
.catch(error => {
  console.log('ERROR!');
  console.log('Message:', error.message);
  console.log('Code:', error.code);
  if (error.response) {
    console.log('Response status:', error.response.status);
    console.log('Response data:', error.response.data);
  }
});
