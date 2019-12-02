const express = require('express');
const { loadAll, loadSpecific } = require('./controller');

const routes = express.Router();

/**
 * @api {get} v1/transactions/ Get all transactions
 * @apiDescription Load all transactions from DB
 * @apiVersion 1.0.0
 * @apiName getTransactions
 * @apiGroup Transactions
 * @apiPermission public
 *
 * @apiParam  {String?}           sortBy   sorting results by a specific attribute
 * @apiParam  {String?=asc,desc}  orderBy  ordering results ascending or descending
 * @apiError (Bad Request 400)            ValidationError  Some parameters may contain invalid values
 * @apiError (Internal Server Error 500)  ServerError      Some unexpected error happened. Error message should be viewed in the response
 */
routes.route('/').get(loadAll);

/**
 * @api {get} v1/transactions/:hash Get block
 * @apiDescription Load specific block from DB
 * @apiVersion 1.0.0
 * @apiName getBlock
 * @apiGroup Transactions
 * @apiPermission public
 *
 * @apiParam  {String?}           from     start date for search window
 * @apiParam  {String?}           to       end date for search window
 * @apiParam  {String?}           sortBy   sorting results by a specific attribute
 * @apiParam  {String?=asc,desc}  orderBy  ordering results ascending or descending
 * @apiError (Bad Request 400)            ValidationError  Some parameters may contain invalid values
 * @apiError (Internal Server Error 500)  ServerError      Some unexpected error happened. Error message should be viewed in the response
 */
routes.route('/:hash').get(loadSpecific);

module.exports = routes;