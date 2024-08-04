const Product = require('../models/product');
const Order = require('../models/order');
const { NotFoundError, BadRequestError } = require('../errors');
const { checkPermistion } = require('../utils');
const notFound = require('../middleware/not-found');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const createOrder = async (req, res) => {
  const { items: cartItems } = req.body;
  if (!cartItems || !cartItems.length) {
    throw new BadRequestError('please provide cartItems');
  }

  let cartTotal = [];
  let subTotal = 0;
  let paymetIntentURL = null;

  for (const item of cartItems) {
    const product = await Product.findOne({ _id: item.id });
    if (!product) {
      throw new NotFoundError('there no such product in database');
    }

    console.log(product.sellPrice);

    const singleOrder = {
      name: product.name,
      price: product.sellPrice,
      amount: item.amount,
      image: product.image,
      product: product._id,
    };

    cartTotal = [...cartTotal, singleOrder];

    subTotal = subTotal + product.sellPrice * item.amount;
  }

  const total = subTotal;

  const order = await Order.create({
    subtotal: subTotal,
    total: total,
    orderItems: cartTotal,
    user: req.user.userId,
    clientSecret: 'fakeSecret',
  });

  // PAYMENT INTENT FUNCTION

  // ----------------- Order Details --------------------------
  // The total price of your order in Iraqi Dinar only like 1000
  // (if in dollar, multiply it by dollar-dinar exchange rate, like 1*1300=1300)
  // Please note that it MUST BE MORE THAN 1000 IQD
  const amount = total * 1500;

  // Type of service you provide, like 'Books', 'ecommerce cart', 'Hosting services', ...
  const serviceType = 'E-COMMERCE';

  // Order id, you can use it to help you in tagging transactions with your website IDs,
  // if you have no order numbers in your website, leave it 1
  // Variable Type is STRING, MAX: 512 chars

  const orderId = order._id.toString();
  console.log(orderId);

  // after a successful or failed order, the user will redirect to this url
  const redirectionUrl =
    'http://localhost:5000/shop/v1/api/order/getPaymentStatus';

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

  await axios
    .post(tUrl, new URLSearchParams(dataToPost))
    .then((response) => {
      const transactionId = response.data.id;
      const newUrl = `${rUrl}${transactionId}`;
      console.log(newUrl);
      paymetIntentURL = newUrl;
      // Perform redirect or other actions as needed
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });

  console.log(paymetIntentURL);

  res.json({ msg: 'Order created successfully', order, paymetIntentURL });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  if (!orders) {
    throw new NotFoundError('There is no order has been issued yet');
  }

  res.json({ orders });
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new NotFoundError('There is no such order in database');
  }

  checkPermistion(req.user, order.user);
  res.json({ order });
};

const getCurrentUserOrder = async (req, res) => {
  const order = await Order.find({ user: req.user.userId });

  if (!order) {
    throw new NotFoundError("you don't have any order yet");
  }

  res.json(order);
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, paymentIntent } = req.body;

  if (!status) {
    throw new BadRequestError('Please provide status');
  }

  const order = await Order.findOne({ _id: id });

  if (!order) {
    throw new NotFoundError('There is such order in database');
  }

  order.paymentIntentId = paymentIntent;

  order.status = status;

  await order.save();
  res.json(order);
};

const handle_redircet = async (req, res) => {
  const secret = '$2y$10$hBbAZo2GfSSvyqAyV2SaqOfYewgYpfR1O19gIh4SqyGWdmySZYPuS';
  if (req.query.token) {
    console.log(req.query.token);
    // Decode the token using this Node.js code:
    const result = jwt.verify(req.query.token, secret, {
      algorithms: ['HS256'],
    });
    console.log(result);

    const orderInfo = await Order.findOneAndUpdate(
      { _id: result.orderid },
      {
        status: result.status,
        paymentIntentId: result.id,
      },
      {
        trim: true,
        runValidators: true,
      }
    );

    if (!orderInfo) {
      throw new NotFoundError('there no such order in database');
    }

    console.log(orderInfo);

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

  res.redirect('http://localhost:3000/');
};

const checkTransactionInfo = async (req, res) => {
  const msisdn = '9647835077893';
  const secret = '$2y$10$hBbAZo2GfSSvyqAyV2SaqOfYewgYpfR1O19gIh4SqyGWdmySZYPuS';
  const merchantid = '5ffacf6612b5777c6d44266f';

  // ----------------- Request Details --------------------------
  // The ID for the transaction you want to check
  const { id } = req.params;

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

  try {
    const response = await axios.post(rUrl, new URLSearchParams(dataToPost));
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrdersDependOnDatesAndAnalyzeInfo = async (req, res) => {
  const { orderYear, orderMonth, orderDay } = req.query;
  const orderQuery = {};
  if (orderYear) {
    orderQuery.orderYear = orderYear;
  }
  if (orderMonth) {
    orderQuery.orderMonth = orderMonth;
  }
  if (orderDay) {
    orderQuery.orderDay = orderDay;
  }

  try {
    const [orders, totalRevenue] = await Promise.all([
      Order.aggregate([
        { $match: orderQuery },
        { $unwind: '$orderItems' },
        {
          $group: {
            _id: '$orderItems.product',
            productName: { $first: '$orderItems.name' },
            totalQuantity: { $sum: '$orderItems.amount' },
            totalRvenuePerItem: {
              $sum: { $multiply: ['$orderItems.price', '$orderItems.amount'] },
            },
          },
        },
      ]),
      Order.aggregate([
        { $match: orderQuery },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
      ]),
    ]);

    const result = {
      orders,
      totalRevenue: totalRevenue,
    };

    res.json(result).status(200);
  } catch (err) {
    console.error('Error fetching and aggregating orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createOrderFromCashir = async (req, res) => {
  const { items: cartItems } = req.body;
  console.log(cartItems);

  if (!cartItems || !cartItems.length) {
    throw new BadRequestError('please provide cartItems');
  }

  let cartTotal = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const product = await Product.findOne({ _id: item._id });
    if (!product) {
      throw new NotFoundError('there no such product in database');
    }

    console.log(product.sellPrice);

    const singleOrder = {
      name: product.name,
      price: product.sellPrice,
      amount: item.amount,
      image: product.image,
      product: product._id,
    };

    cartTotal = [...cartTotal, singleOrder];

    subTotal = subTotal + product.sellPrice * item.amount;
  }

  const total = subTotal;

  const order = await Order.create({
    subtotal: subTotal,
    total: total,
    orderItems: cartTotal,
    user: req.user.userId,
    clientSecret: 'fakeSecret',
    status: 'success',
  });

  res.json({ msg: 'Order created successfully', order });
};

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  updateOrder,
  handle_redircet,
  checkTransactionInfo,
  getOrdersDependOnDatesAndAnalyzeInfo,
  createOrderFromCashir,
};
