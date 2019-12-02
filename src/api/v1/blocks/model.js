const mongoose = require('mongoose');

/**
 * Block Schema
 * @private
 */
const blockSchema = new mongoose.Schema({
	number: { type: String, unique : true, required : true, dropDups: true },
	hash: { type: String, unique : true, required : true, dropDups: true },
	isMainChain: { type: Boolean },
	nonce: { type: String },
	miner: { type: String },
	difficulty: { type: String },
	totalDifficulty: { type: String },
	size: { type: String },
	gasLimit: { type: String },
	gasUsed: { type: String },
	transactions: [String],
  timestamp: { type: String },
	extraData: { type: String },
	uncles: [String],
	// logs_bloom: { type: String },
	// sha3_uncles: { type: String },
	// state_root: { type: String },
	// receipts_root: { type: String },
});

blockSchema.pre('save', function() {});
blockSchema.method({});
blockSchema.statics = {};

const model = mongoose.model('Block', blockSchema);
module.exports = model;