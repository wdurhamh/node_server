var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Trip = new Schema({
	date:String,
	time:String,
	temp:String,
	weather:String,
	water_conditions:String,
	lake_id:Number
});

module.exports = mongoose.model('Trip', Trip);
