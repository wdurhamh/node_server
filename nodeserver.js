var fs = require('fs');
var http = require('http');
var rest = require('./rest.js');
var url = require('url');
var ROOT_DIR = "html/";

http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
  console.log("servicing request");
  if(urlObj.pathname.indexOf("getCity")!= -1){
	var prefix  = urlObj.query["q"];  	
  	if(prefix!=""){
		console.log(urlObj);
		rest.getCities(prefix,function(result){
	 		var json = JSON.stringify(result);
		        res.writeHead(200);
		        res.end(json);
	
		});
	}
  }
  else if(urlObj.pathname.indexOf("submit_comment")!= -1){
	console.log("Got Comment request");
	if(req.method === "POST"){
		 var jsonData = "";
      		 req.on('data', function (chunk) {
    		 jsonData += chunk;
      			});
      		req.on('end', function () {
        		var reqObj = JSON.parse(jsonData);
        		console.log(reqObj);
        		console.log("Name: "+reqObj.Name);
        		console.log("Comment: "+reqObj.Comment);
			var MongoClient = require('mongodb').MongoClient;
        		MongoClient.connect("mongodb://localhost/weather", function(err, db) {
          			if(err) throw err;
          			db.collection('comments').insert(reqObj,function(err, records) {
            				console.log("Record added as "+records[0]._id);
          			});
        		});
		});
		res.writeHead(200);
		res.end();
	}
	else if(req.method === "GET"){
		// Read all of the database entries and return them in a JSON array
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect("mongodb://localhost/weather", function(err, db) {
			if(err) throw err;
			db.collection("comments", function(err, comments){
				if(err) throw err;
				comments.find(function(err, items){
					items.toArray(function(err, itemArr){
						console.log("Document Array: ");
						console.log(itemArr);
						res.writeHead(200);
						res.end(JSON.stringify(itemArr));
					});
				});
			});
		});
	}
   }
  else{
 	fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
 		if (err) {
      			res.writeHead(404);
      			res.end(JSON.stringify(err));
      			return;
    		}
		res.writeHead(200);
		res.end(data);
  	});
  }
}).listen(80);

