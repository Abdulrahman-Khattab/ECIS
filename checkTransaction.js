const axios = require('axios');
const jwt = require('jsonwebtoken');

// Import credentials from credentials.js

const msisdn = '9647835077893';
const secret = '$2y$10$hBbAZo2GfSSvyqAyV2SaqOfYewgYpfR1O19gIh4SqyGWdmySZYPuS';
const merchantid = '5ffacf6612b5777c6d44266f';

// ----------------- Request Details --------------------------
// The ID for the transaction you want to check
const id = '65b104002b4e1d94b97f2cc0';

// Building data
const data = {
  id,
  msisdn,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
};

// Encoding Token
const newToken = jwt.sign(data, secret, { algorithm: 'HS256' });

// Check if test or production mode
const rUrl = 'https://test.zaincash.iq/transaction/get';

// POST data to ZainCash API
const dataToPost = {
  token: newToken,
  merchantId: merchantid,
};

axios
  .post(rUrl, new URLSearchParams(dataToPost))
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
