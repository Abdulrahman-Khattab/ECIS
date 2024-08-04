const User = require('../models/user');
const { checkPermistion } = require('../utils');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require('../errors');

const getAllUsers = async (req, res) => {
  const user = await User.find({}).select('-password');

  res.json(user);
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select('-password');
  if (!user) {
    throw new NotFoundError('There is no such user');
  }
  checkPermistion(req.user, user._id);

  res.json(user);
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  const updateObject = {};

  if (name) {
    updateObject.name = name;
  }
  if (email) {
    updateObject.email = email;
  }
  if (!updateObject) {
    throw new BadRequestError('Please provide name or email ');
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    updateObject
  );

  res.json(user);
};

const updateuserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword);

  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide all values ');
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordcorrect = await user.comparePassword(oldPassword);
  if (!isPasswordcorrect) {
    throw new UnauthorizedError('Please provide the right password');
  }

  user.password = newPassword;

  await user.save();

  res.json(user);
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select('-password');
  checkPermistion(req.user, user._id);

  res.json(user);
};

module.exports = {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateuserPassword,
};
