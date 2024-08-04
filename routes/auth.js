const {
  register,
  login,
  logout,
  registerSpecialUser,
} = require('../controllers/auth');
const express = require('express');
const {
  authenticaiton,
  authrizePermistion,
} = require('../middleware/authentication');

const Router = express.Router();

Router.post('/register', register);
Router.post('/login', login);
Router.get('/', logout);
Router.post(
  '/registerSpecialUser',
  authenticaiton,
  authrizePermistion('manager'),
  registerSpecialUser
);

module.exports = Router;
