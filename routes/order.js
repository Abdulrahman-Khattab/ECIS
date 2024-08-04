const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  updateOrder,
  handle_redircet,
  checkTransactionInfo,
  getOrdersDependOnDatesAndAnalyzeInfo,
  createOrderFromCashir,
} = require('../controllers/order');
const {
  authenticaiton,
  authrizePermistion,
} = require('../middleware/authentication');

const express = require('express');

const Router = express.Router();

Router.get(
  '/',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'owner', 'manager'),
  getAllOrders
);
Router.post('/', authenticaiton, createOrder);
Router.post(
  '/createOrderFromCashir',
  authenticaiton,
  authrizePermistion('operator', 'admin', 'manager'),
  createOrderFromCashir
);
Router.get('/getCurrentUserOrder', authenticaiton, getCurrentUserOrder);
Router.get(
  '/getOrders',
  authenticaiton,
  authrizePermistion('admin', 'manager'),
  getOrdersDependOnDatesAndAnalyzeInfo
);
Router.get('/getPaymentStatus', authenticaiton, handle_redircet);
Router.get(
  '/checkTransactionInfo/:id',
  checkTransactionInfo,
  authenticaiton,
  authrizePermistion('admin', 'manager')
);
Router.get('/:id', authenticaiton, getSingleOrder);
Router.patch('/:id', authenticaiton, updateOrder);

module.exports = Router;
