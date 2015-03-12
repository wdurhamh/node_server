var fs = require('fs');
module.exports = {
getCities: function (prefix,callback){
	console.log(prefix);
	var list = fs.readFile('cities.dat.txt', function (err, data) {
  	if(err) throw err;
  	var matches = [];
  	cities = data.toString().split("\n");
  	for(var i = 0; i < cities.length; i++) {
	var result = cities[i].toLowerCase().search(prefix.toLowerCase()); 
	if(result == 0) {
		matches.push({city:cities[i]});
    	 	console.log(cities[i]);
 	 }
       }
      callback( matches );
        });
    }
};

