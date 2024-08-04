const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
  getSingleProductByBarCode,
} = require('../controllers/product');

//const { createProductNoRefactor } = require('../test');

const { getProductReview } = require('../controllers/review');

const {
  authenticaiton,
  authrizePermistion,
} = require('../middleware/authentication');

const express = require('express');
const Router = express.Router();

Router.get('/', getAllProducts);

// Test mode
/*Router.post(
  '/createProductNoRefactor',
  authenticaiton,
  authrizePermistion('admin', 'manager'),
  createProductNoRefactor
); */

Router.get(
  '/barcode/:barcode',
  authenticaiton,
  authrizePermistion('admin', 'operator', 'manager', 'owner', 'accountant'),
  getSingleProductByBarCode
);

Router.get('/:id', getSingleProduct);
Router.post(
  '/',
  authenticaiton,
  authrizePermistion('admin', 'operator', 'accountant', 'owner', 'manager'),
  createProduct
);
Router.delete(
  '/:id',
  authenticaiton,
  authrizePermistion('admin', 'operator', 'accountant', 'manager'),
  deleteProduct
);
Router.patch(
  '/:id',
  authenticaiton,
  authrizePermistion('admin', 'operator', 'accountant', 'owner', 'manager'),
  updateProduct
);
Router.patch(
  '/:id/uploadImage',
  authenticaiton,
  authrizePermistion('admin', 'operator', 'accountant', 'owner', 'manager'),
  uploadImage
);

Router.get('/:id/productReview', authenticaiton, getProductReview);

module.exports = Router;
