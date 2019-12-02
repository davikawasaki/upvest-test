const mongoose = require('mongoose');

/**
 * Transaction Schema
 * @private
 */
const transactionSchema = new mongoose.Schema({
	hash: { type: String, unique : true, required : true, dropDups: true },
	blockHash: { type: String },
	blockNumber: { type: Number },
	to: { type: String },
	from: { type: String },
	input: { type: String },
	gas: { type: String },
	nonce: { type: String },
	value: { type: String },
	gasPrice: { type: String },
	gasPrice: { type: String },
	balance: { type: String },
	type: { type: String },  // in (enter money), out (money out), self (zero)
	// type: { type: String },
	timestamp: { type: Date },
});

transactionSchema.pre('save', function() {});
transactionSchema.method({});
transactionSchema.statics = {};

const model = mongoose.model('Transaction', transactionSchema);
module.exports = model;