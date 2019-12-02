const express = require('express');
const { loadAll, loadSpecific, calculateBalance } = require('./controller');

const routes = express.Router();

/**
 * @api {get} v1/contracts/ Get all contracts
 * @apiDescription Load all contracts from DB
 * @apiVersion 1.0.0
 * @apiName getContracts
 * @apiGroup contracts
 * @apiPermission public
 *
 * @apiParam  {String?}           sortBy   sorting results by a specific attribute
 * @apiParam  {String?=asc,desc}  orderBy  ordering results ascending or descending
 * @apiError (Bad Request 400)            ValidationError  Some parameters may contain invalid values
 * @apiError (Internal Server Error 500)  ServerError      Some unexpected error happened. Error message should be viewed in the response
 */
routes.route('/').get(loadAll);

/**
 * @api {get} v1/contracts/:hash Get contract
 * @apiDescription Load specific contract from DB
 * @apiVersion 1.0.0
 * @apiName getAddress
 * @apiGroup contract
 * @apiPermission public
 *
 * @apiParam  {String?}           sortBy   sorting results by a specific attribute
 * @apiParam  {String?=asc,desc}  orderBy  ordering results ascending or descending
 * @apiError (Bad Request 400)            ValidationError  Some parameters may contain invalid values
 * @apiError (Internal Server Error 500)  ServerError      Some unexpected error happened. Error message should be viewed in the response
 */
routes.route('/:hash').get(loadSpecific);

/**
 * @api {get} v1/contracts/balance/:hash Get contract balance
 * @apiDescription Calculate specific contract balance from DB
 * @apiVersion 1.0.0
 * @apiName getAddressBalance
 * @apiGroup contract
 * @apiPermission public
 *
 * @apiParam  {String?}           sortBy   sorting results by a specific attribute
 * @apiParam  {String?=asc,desc}  orderBy  ordering results ascending or descending
 * @apiError (Bad Request 400)            ValidationError  Some parameters may contain invalid values
 * @apiError (Internal Server Error 500)  ServerError      Some unexpected error happened. Error message should be viewed in the response
 */
routes.route('/balance/:hash').get(calculateBalance);

module.exports = routes;