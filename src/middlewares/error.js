const { Error } = require('../utils/api-response');
const { env } = require('../config/index');

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
// eslint-disable-next-line no-unused-vars
const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    errors: err.errors,
    message: err.message || 'Houston, we have a problem!',
    stack: err.stack,
  };

  if (env !== 'development') {
    delete response.stack;
  }
  if (err.status) {
    res.status(err.status);
  } else {
    res.status(500);
  }
  res.json(response);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
const notFound = (req, res) => {
  const err = new Error({
    message: 'Resource not found or not existent.',
    status: 404,
  });

  return handler(err, req, res);
};

module.exports = {
  handler,
  notFound
}