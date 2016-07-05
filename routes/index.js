var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  if (req.user){
    res.render('home');
  }
  else{
  	res.render('index');
  }
});

router.get('/register', function(req,res){
	res.render('register',{});
});

router.get('/login', function(req,res){
	res.render('login', {user:req.user});
});

router.get('/logout', function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/ping', function(req,res){
	res.status(200).send('Nothing lasts forever that\'s the way it\'s got to be')
});

module.exports = router;
