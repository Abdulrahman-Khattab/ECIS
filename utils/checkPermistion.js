const { UnauthorizedError } = require('../errors');

const checkPermistion = (requestUser, resoruceUserId) => {
  if (requestUser.role === 'admin' || requestUser.role === 'manager') return;
  if (requestUser.userId === String(resoruceUserId)) return;

  throw new UnauthorizedError('not valid user ');
};

module.exports = checkPermistion;
