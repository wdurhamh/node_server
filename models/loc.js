var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Loc = new Schema({
	name:String,
	elevation:Number,
	depth:Number,
	longitude:Number,
	latitude:Number,
	description:String	
});

module.exports = mongoose.model('Loc', Loc);
