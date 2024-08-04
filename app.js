const express = require('express');
require('dotenv').config();
const connectDB = require('./db/connect');
const cookieParser = require('cookie-parser');
const fileUploader = require('express-fileupload');
const cros = require('cors');
require('express-async-errors');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const reviewRouter = require('./routes/review');
const orderRouter = require('./routes/order');
const purchasesRouter = require('./routes/purchases');
const Receipt_instrument_Router = require('./routes/Receipt_instrument');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUploader());
app.use(
  cros({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// static
app.use(express.static('public'));

//Routes
app.use('/shop/v1/api/auth', authRouter);
app.use('/shop/v1/api/user', userRouter);
app.use('/shop/v1/api/products', productRouter);
app.use('/shop/v1/api/reviews', reviewRouter);
app.use('/shop/v1/api/order', orderRouter);
app.use('/shop/v1/api/purchases', purchasesRouter);
app.use('/shop/v1/api/Receipt_instrument', Receipt_instrument_Router);
// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.URL);
    app.listen(5000, () => {
      console.log('app listen to port 5000 ');
    });
  } catch (error) {
    console.log(error);
  }
};
start();
