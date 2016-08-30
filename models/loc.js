var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Loc = new Schema({
	name:String,
	lnglt:{lat:Number, lng:Number},
	holes:[String]	
});

module.exports = mongoose.model('Loc', Loc);
