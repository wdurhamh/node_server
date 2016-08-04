var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Fish = new Schema({
	count:Number,
	species:String,
	length:Number,
	lure:String,
	date:String,
	time:String,
	images:[String],//paths to images in public folder
	body_of_water:String,
	hole:String,//fishing hole, body of water associated with each fishing hole can be looked up
	comment:String
});

module.exports = mongoose.model('Fish', Fish);
