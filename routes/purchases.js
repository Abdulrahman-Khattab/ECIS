const {
  getAllPurchases,
  createPurchases,
  deletePurchases,
  updatePurchases,
  getSinglePurchases,
  getSinglePurchasesByCompany,
  getSinglePurchasesByDate,
} = require('../controllers/purchases');

const {
  authenticaiton,
  authrizePermistion,
} = require('../middleware/authentication');

const express = require('express');

const Router = express.Router();

Router.get(
  '/',
  authenticaiton,
  authrizePermistion('admin', 'manager'),
  getAllPurchases
);

Router.post(
  '/',
  authenticaiton,
  authrizePermistion('admin', 'manager'),
  createPurchases
);

Router.get(
  '/:id',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'owner', 'manager'),
  getSinglePurchases
);

Router.get(
  '/:date',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'owner', 'manager'),
  getSinglePurchasesByDate
);

Router.get(
  '/:company/search',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'owner', 'manager'),
  getSinglePurchasesByCompany
);

Router.patch(
  '/:id',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'manager'),
  updatePurchases
);

Router.delete(
  '/:id',
  authenticaiton,
  authrizePermistion('admin', 'accountant', 'manager'),
  deletePurchases
);

module.exports = Router;
