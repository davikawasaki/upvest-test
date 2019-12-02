const mongoose = require('mongoose');

/**
 * Contract Schema
 * @private
 */
const contractSchema = new mongoose.Schema({
	hash: { type: String, unique : true, required : true, dropDups: true },
	from: { type: String },
	transactions: [String]
	// transactions: [{
	// 	hash: { type: String },
	// 	blockNumber: { type: String },
	// 	blockHash: { type: String },
	// 	to: { type: String },
	// 	from: { type: String },
	// 	input: { type: String },
	// 	balance: { type: String },
	// 	timestamp: { type: String },
	// 	type: { type: String },
	// }],
});

contractSchema.pre('save', function() { });
contractSchema.method({});
contractSchema.statics = {};

const model = mongoose.model('Contract', contractSchema);
module.exports = model;