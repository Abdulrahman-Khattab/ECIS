const {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateuserPassword,
} = require('../controllers/user');
const {
  authenticaiton,
  authrizePermistion,
} = require('../middleware/authentication');

const express = require('express');

const Router = express.Router();

Router.get(
  '/',
  authenticaiton,
  authrizePermistion('admin', 'owner', 'manager'),
  getAllUsers
);
Router.get('/currentUser', authenticaiton, getCurrentUser);
Router.patch('/updateUser', authenticaiton, updateUser);
Router.patch('/updatePassword', authenticaiton, updateuserPassword);
Router.get('/:id', authenticaiton, getSingleUser);

module.exports = Router;
