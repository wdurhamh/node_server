var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user:req.user});
});

router.get('/register', function(req,res){
	res.render('register',{});
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

router.get('/login', function(req,res){
	res.render('login', {user:req.user});
});

router.post('/login', passport.authenticate('local'), function(req,res){
	res.redirect('/');
});

router.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/ping', function(req,res){
	res.status(200).send('Nothing lasts forever that\'s the way it\'s got to be')
});

module.exports = router;
