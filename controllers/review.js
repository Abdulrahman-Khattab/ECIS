const Review = require('../models/review');
const Product = require('../models/product');
const { NotFoundError, BadRequestError } = require('../errors');
const checkPermistion = require('../utils/checkPermistion');
const review = require('../models/review');

const createReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError('there no such product in db');
  }

  req.body.user = req.user.userId;
  req.body.product = product._id;

  const review = await Review.create(req.body);

  res.json(review);
};

const getAllReview = async (req, res) => {
  const reviews = await Review.find({}).populate('user').populate('product');

  if (!reviews) {
    throw new NotFoundError('There is not review in db');
  }

  res.json(reviews);
};

const getSingleReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id })
    .populate('user')
    .populate('product');

  res.json(review);
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });

  if (!review) {
    throw new NotFoundError('There is no such review');
  }

  const deletedReview = await Review.findOneAndDelete({ _id: id });
  res.json({ msg: 'Review has been deleted successfully', deletedReview });
};

const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const { id } = req.params;

  if (!rating || !title || !comment) {
    throw new BadRequestError('Please provide all value ');
  }

  const review = await Review.findOne({ _id: id, user: req.user.userId });

  if (!review) {
    throw new NotFoundError('Review not found');
  }

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.json({ msg: 'Review updated successfully ', review });
};

const getProductReview = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError('Product Does not exist');
  }

  const review = await Review.find({ product: product._id });

  if (!review) {
    throw new NotFoundError('There is no review for this product ');
  }

  res.json({ review, numOfReview: review.length });
};

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  deleteReview,
  updateReview,
  getProductReview,
};
