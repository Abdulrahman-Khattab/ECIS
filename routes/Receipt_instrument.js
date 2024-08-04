const {
  getAllReceipt_instrument,
  getSingleReceipt_instrument,
  createReceipt_instrument,
  updateReceipt_instrument,
  deleteReceipt_instrument,
  getSingleReceipt_instrumentByCompany,
  getSingleReceipt_instrumentByDate,
} = require('../controllers/Receipt_instrument');
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
  getAllReceipt_instrument
);

Router.post(
  '/',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'manager'),
  createReceipt_instrument
);

Router.get(
  '/:id',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'owner', 'manager'),
  getSingleReceipt_instrument
);

Router.get(
  '/:date',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'owner', 'manager'),
  getSingleReceipt_instrumentByDate
);

Router.get(
  '/:company/search',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'owner', 'manager'),
  getSingleReceipt_instrumentByCompany
);

Router.delete(
  '/:id',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'manager'),
  deleteReceipt_instrument
);

Router.patch(
  '/:id',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'manager'),
  updateReceipt_instrument
);

module.exports = Router;
