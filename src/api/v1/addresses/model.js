const mongoose = require('mongoose');

/**
 * Address Schema
 * @private
 */
const addressSchema = new mongoose.Schema({
	hash: { type: String, unique : true, required : true, dropDups: true },
	transactions: [String],
	balance: { type: String },
	timestamp: { type: String },
});

addressSchema.pre('save', function() { });
addressSchema.method({});
addressSchema.statics = {};

const model = mongoose.model('Address', addressSchema);
module.exports = model;