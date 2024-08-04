const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} = require('../errors');
const User = require('../models/user');
const { attachCookieToResponse, createUserToken } = require('../utils');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  let { role } = req.body;
  if (role) {
    throw new BadRequestError('invalid credintial');
  }

  if (!name) {
    throw new BadRequestError('please provide name ');
  }
  if (!email) {
    throw new BadRequestError('please provide email ');
  }
  if (!password) {
    throw new BadRequestError('please provide password ');
  }

  const count = await User.countDocuments();
  if (count === 0) {
    role = 'admin';
  }
  console.log(count);
  const user = await User.create({ name, email, password });

  const token = createUserToken(user);

  attachCookieToResponse({ res, user: token });
  res.json({ token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  if (!email) {
    throw new BadRequestError('please provide email ');
  }
  if (!password) {
    throw new BadRequestError('please provide password ');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('There no such user');
  }

  const isPasswordcorrect = await user.comparePassword(password);

  if (!isPasswordcorrect) {
    throw new UnauthenticatedError('please provide correct password ');
  }

  const token = createUserToken(user);

  attachCookieToResponse({ res, user: token });

  res.json(token);
};

const logout = async (req, res) => {
  res
    .cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
      signed: true,
    })
    .send('user logged out ');
};

const registerSpecialUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userRole = req.user.role;

  if (!role) {
    throw new BadRequestError('please provide role ');
  }

  if (!name) {
    throw new BadRequestError('please provide name ');
  }
  if (!email) {
    throw new BadRequestError('please provide email ');
  }
  if (!password) {
    throw new BadRequestError('please provide password ');
  }

  const count = await User.countDocuments();
  if (count === 0) {
    role = 'admin';
  }

  if (userRole === 'admin' && role === 'manager') {
    throw new UnauthorizedError('admin can not create manager account ');
  }

  const user = await User.create({ name, email, password, role });

  const token = createUserToken(user);

  res.json({ token });
};

module.exports = { register, login, logout, registerSpecialUser };
