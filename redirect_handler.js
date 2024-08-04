const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

// Import credentials from credentials.js

const secret = '$2y$10$hBbAZo2GfSSvyqAyV2SaqOfYewgYpfR1O19gIh4SqyGWdmySZYPuS';
/* ------------------------------------------------------------------------------
  Notes about $redirection_url: 
  in this url, the api will add a new parameter (token) to its end like:
  https://example.com/redirect.php?token=XXXXXXXXXXXXXX
  */

app.use(express.json());

app.get('/', (req, res) => {
  if (req.query.token) {
    console.log(req.query.token);
    // Decode the token using this Node.js code:
    const result = jwt.verify(req.query.token, secret, {
      algorithms: ['HS256'],
    });
    console.log(result);

    // To check for the status of the transaction, use result.status
    if (result.status === 'success') {
      // Successful transaction
      console.log('Successful transaction');
      /*
      result will be like this example:
      {
        status: 'success',
        orderid: 'Bill12345',
        id: '58650f0f90c6362288da08cf',
        iat: 1483018052,
        exp: 1483032452
      }
      */
    }

    if (result.status === 'failed') {
      // Failed transaction and its reason
      const reason = result.msg;
      console.log('Failed transaction:', reason);
      /*
      result will be like this example:
      {
        status: 'failed',
        msg: 'Invalid credentials for requester',
        orderid: 'Bill12345',
        id: '58650ca990c6362288da08c8',
        iat: 1483017397,
        exp: 1483020997
      }
      */
    }
  } else {
    // Cancelled transaction (if he clicked "Cancel and go back")
    // NO TOKEN HERE
    console.log('Cancelled transaction');
  }

  res.send('Transaction processed');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
