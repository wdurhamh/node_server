var express = require('express');
var router = express.Router();
var Location = require('../models/loc');
router.get('/', function(req,res){
	res.render('fish/fish_home',{});
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
			res.send(locs);
		}
	});	
});

router.post('/loc', function(req,res){
        console.log(req.body);
/*
        var loc = new Locaction(req.body);
	loc.save(function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log('Created new location', req.body);
		}
	});
**/
});


router.post('/fish/:fishid', function(req,res){
        console.log('TODO: implement fish post endpoint')
});

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
