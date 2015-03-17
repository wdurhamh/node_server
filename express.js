var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');
var rest = require('./rest.js');
var url = require('url');
var app = express();
app.use(bodyParser());

var basicAuth = require('basic-auth-connect');
  var auth = basicAuth(function(user, pass) {
    return((user ==='cs360')&&(pass === 'test'));
  });

var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
  };
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);

app.use('/', express.static('./html', {maxAge: 60*60*1000}));

app.get('/getCity', function (req, res) {
	var urlObj = url.parse(req.url, true, false);
	var prefix  = urlObj.query["q"];
        if(prefix!=""){
                console.log(urlObj);
                rest.getCities(prefix,function(result){
                        var json = JSON.stringify(result);
                        res.writeHead(200);
                        res.end(json);

                });
        }

  });

app.get('/submit_comment', function (req, res) {
    console.log(req.user);
    console.log("Remote User");
    console.log(req.remoteUser);
    console.log("In POST comment route");
    console.log(req.body);
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


});
app.post('/submit_comment',auth, function (req, res) {

    console.log("In comment route");
    console.log(req.user);
    console.log("Remote User");
    console.log(req.remoteUser);
    console.log("In POST comment route");
    console.log(req.body);
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
});
