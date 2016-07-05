//api for users

//actual url's prefixed with "/api/users"
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');


router.post('/login', passport.authenticate('local'), function(req,res){
	res.redirect('/');
});


router.post('/register', function(req,res){
	Account.register(new Account({username:req.body.username}), req.body.password, function(err, account){
                console.log('In register callback');
		if (err) {
			console.log('printing error\n',err);
			return res.render('register', {account:account});
		}
		passport.authenticate('local')(req,res, function(){
			res.redirect('/');
		});
	});
});

module.exports = router;
