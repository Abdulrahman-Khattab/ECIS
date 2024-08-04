const {
  createReview,
  getAllReview,
  getSingleReview,
  deleteReview,
  updateReview,
  getProductReview,
} = require('../controllers/review');

const express = require('express');
const {
  authenticaiton,
  authrizePermistion,
} = require('../middleware/authentication');

const Router = express.Router();

Router.get('/', authenticaiton, getAllReview);
Router.get('/:id', authenticaiton, getSingleReview);
Router.post('/:id', authenticaiton, createReview);
Router.delete('/:id', authenticaiton, deleteReview);
Router.patch('/:id', authenticaiton, updateReview);

module.exports = Router;
