var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Trip = new Schema({
	name:String
});

module.exports = mongoose.model('Trip', Trip);
