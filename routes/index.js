var express = require('express');
var router = express.Router();
var Auth = require('./auth_check');
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  if (req.user){
    res.render('home');
  }
  else{
  	res.render('index', {isIndex:true});
  }
});

router.get('/about', function(req,res,next){
	res.render('about', {});
});

router.get('/register', function(req,res){
	res.render('register',{});
});

router.get('/login',function(req,res){
        console.log('Because we have been here before');
	res.render('login', {user:req.user});
});

router.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/ping', function(req,res){
	res.status(200).send('All delighted people raise your hands!');
});

router.get('/fishing', function(req,res){
        res.render('fish/fish_home',{});
});

router.get('/fish/trip', Auth.isAuthenticated, function(req,res){
	res.render('fish/trip',{});
});

router.get('/fish/record', Auth.isAuthenticated, function(req,res){
	res.sendfile('./public/fish_app/index.html');
});

router.get('/port', function(req,res){
	res.render('port/port_home',{isIndex:true});
});

router.get('/port/cultcompt', function(req,res){
	res.render('port/cultcomp',{});
});

router.get('/port/crit', function(req,res){
	res.render('port/crit', {});
});

router.get('/port/life',function(req,res){
	res.render('port/personal',{});
});

router.get('/port/lang', function(req,res){
	res.render('port/lang_compt',{});
});


module.exports = router;
