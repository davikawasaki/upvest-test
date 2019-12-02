const express = require('express');
const transactionRoutes = require('./transactions/routes');
const contractRoutes = require('./contracts/routes');
const blockRoutes = require('./blocks/routes');
const addressRoutes = require('./addresses/routes');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send({ online: true }));
/**
 * GET v1/docs
 */
// router.use('/docs', static('docs'));
/**
 * GET v1/public
 */
// router.use('/public', static('public'));
/**
 * GET v1/transactions
 */
router.use('/transactions', transactionRoutes);
/**
 * GET v1/contracts
 */
router.use('/contracts', contractRoutes);
/**
 * GET v1/blocks
 */
router.use('/blocks', blockRoutes);
/**
 * GET v1/addresses
 */
router.use('/addresses', addressRoutes);

module.exports = router;