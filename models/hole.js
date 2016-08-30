var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Hole = new Schema({
	name:String,
	bow:String,
	lnglt:{lat:Number,lng:Number}
});

module.exports = mongoose.model('Hole', Hole);
