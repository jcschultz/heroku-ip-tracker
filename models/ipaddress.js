var mongoose = require('./../db/mongoose');

var ipAddressSchema = mongoose.Schema({
	name: String,
	address: String
});

module.exports = mongoose.model('IpAddress', ipAddressSchema);