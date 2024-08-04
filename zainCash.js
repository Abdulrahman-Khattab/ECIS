const axios = require('axios');
const jwt = require('jsonwebtoken');

// ----------------- Order Details --------------------------
// The total price of your order in Iraqi Dinar only like 1000
// (if in dollar, multiply it by dollar-dinar exchange rate, like 1*1300=1300)
// Please note that it MUST BE MORE THAN 1000 IQD
const amount = 250;

// Type of service you provide, like 'Books', 'ecommerce cart', 'Hosting services', ...
const serviceType = 'A book';

// Order id, you can use it to help you in tagging transactions with your website IDs,
// if you have no order numbers in your website, leave it 1
// Variable Type is STRING, MAX: 512 chars
const orderId = '1';

// after a successful or failed order, the user will redirect to this url
const redirectionUrl = 'http://localhost:3000/';

// Your wallet phone number
const msisdn = '9647835077893';

// Your merchant ID is requested from ZainCash
const merchantId = '5ffacf6612b5777c6d44266f';

// Language for the ZainCash API
const language = 'en'; // Change this to your desired language

// Secret is requested from ZainCash
const secret = '$2y$10$hBbAZo2GfSSvyqAyV2SaqOfYewgYpfR1O19gIh4SqyGWdmySZYPuS';

// Building data
const data = {
  amount,
  serviceType,
  msisdn,
  orderId,
  redirectUrl: redirectionUrl,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
};

// Encoding Token
const newToken = jwt.sign(data, secret, { algorithm: 'HS256' });

const tUrl = 'https://test.zaincash.iq/transaction/init';
const rUrl = 'https://test.zaincash.iq/transaction/pay?id=';

// POSTing data to ZainCash API
const dataToPost = {
  token: newToken,
  merchantId,
  lang: language,
};

axios
  .post(tUrl, new URLSearchParams(dataToPost))
  .then((response) => {
    const transactionId = response.data.id;
    const newUrl = `${rUrl}${transactionId}`;
    console.log('Redirect URL:', newUrl);
    // Perform redirect or other actions as needed
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
