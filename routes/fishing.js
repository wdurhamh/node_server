var express = require('express');
var router = express.Router();
var path = require('path');
var Location = require('../models/loc');
var Hole = require('../models/hole');
var Fish = require('../models/fish');
var fs = require('fs');

var baseURL = '/home/ec2-user/gitrepos/node_server/';

router.get('/', function(req,res){
	
});

router.post('/trip', function(req,res){

});

router.post('/trip/:tripid', function(req,res){
	if(!req.params.tripid){
		
	}
});

router.get('/trip/:tripid', function(req,res){
        if(!tripid){
        	res.render('fish/trip')
        }
});

router.get('/loc', function(req,res){
	//get a list of all location names and ids
	Location.find({},function(err, locs){
		if(err){
			res.status(500).send('Unable to access locations');
		}
		else{
			res.setHeader('Content-Type', 'application/json');
			res.json(locs);
		}
	});	
});

//Endpoint to create a new body of water
router.post('/loc', function(req,res){
	//TODO - create new hole to stick in the holes collection
	Hole.create({
			name:req.body.name,
			lnglt:req.body.lnglt,
			bow:''
		},function(err, hole){
			if(err){
				console.log(err);
				res.status(500).send('Database error');
			}
			Location.create({
				name:req.body.name,
				lnglt:req.body.lnglt,
				holes:[hole._id]
			},function(err, loc){
				if(err){
					console.log(err);
					res.status(500).send('Database error');
				}
				else{
					console.log(loc);
					Hole.findOneAndUpdate({_id:hole._id}, {bow:loc._id}, function(err, doc){
						if(err){
							console.log(err);
							res.status(500).send('Databse error');
						}
						res.status(200).send("OK");
					});		
				}
			});
	});
});
//Endpoint to get a specific body of water's holes
router.get('/loc/:loc_id/holes', function(req,res){
	Hole.find({bow:req.params.loc_id},function(err,holes){
		if(err){
			console.log(err);
			res.status(500).send('Database error');
		}
		res.json(holes);
	});
});

//Endpoint to get all fish
router.get('/fish', function(req,res){
	Fish.find(function(err,fishes){
		if (err){
			console.log(err);
			res.status(500).send('Database error');
		}
		else{
			res.json(fishes);
		}
	});
});

//Endpoint to add a new fish
router.post('/fish', function(req, res){
	console.log(req.body);
	Fish.create({
		count:req.body.count,
		species:req.body.species,
		length:req.body.length,
		lure:req.body.lure,
		date:req.body.date,
		time:req.body.time,
		image:images,
		body_of_water:req.body.body_of_water,
		hole:req.body.hole,
		comment:req.body.comment	
	 },function(err,fish){
		if(err){
			console.log(err);
			res.status(500).send('Database error');
		}
		else{
			console.log(fish);
			res.status(200).send('OK');
		}
	});
});

//Endpoint to remove a specific fish
router.delete('/fish/:fish_id', function(req,res){
	Fish.remove({
            _id : req.params.fish_id
        }, function(err, fish) {
        	if (err){
			console.log(err);
			res.status(500).send('Database error');
		}
                res.status(200).send('OK');
	});

});

//Endpoint to upload images
router.post('/images', function(req,res){
	var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
        	console.log("Uploading: " + filename);
		fstream = fs.createWriteStream(baseURL + 'public/pics/fish_app/' + filename);
            	file.pipe(fstream);
            	fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.status(200).send('OK');           //where to go next
            });
	});
	
/*
	fs.readFile(req.files.file.path, function(err,data){
		var new_path = 'public/pics/fish_app/'+req.files.file.name;
		fs.writeFile(new_path, data, function(err){
			if (err){
				console.log(err);
				res.status(500).send('Could not upload images');
			}
			else{
				res.status(200).send("OK");
			}
		});
	});
*/
});

router.post('/fish/:fishid', function(req,res){
        console.log('TODO: implement fish post endpoint')
});

//Endpoint to get specfic fish information
router.get('/fish/:fishid', function(req,res){
        console.log('TODO: implement fish get endpoint')
});

router.post('/comment/:commentid', function(req,res){
        console.log('TODO: implement comment post endpoint')
});

router.get('/comment/:commentid', function(req,res){
        console.log('TODO: implement comment get endpoint')
});

module.exports = router;
