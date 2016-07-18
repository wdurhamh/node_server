var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Fish = new Schema({
	species:String,
	length:Number,
	weight:Number,
	image:String,
	lure:String,
	water_type, String,
//water type: shallow, drop off deep, eddie, etc..
	trip_id:Number,
	loc_id:Number,
	user_id:Number
});

module.exports = mongoose.model('Fish', Fish);
