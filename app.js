var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var busboy = require('connect-busboy');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var fish = require('./routes/fishing')
var Auth = require('./routes/auth_check');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

//Session shiz. not sure if this is necessary
//TODO - figure out what all this means
app.use(require('express-session')({
	secret:'sew_kewl',
	resave: false,
	saveUninitialized: false
}));

//Passport setups
app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
//TODO - add GOOGLE OAUTH
//NEED TO SET UP AN ACTUAL SERVRE SOMEWHERE, get a domainname
/**
passport.usre(new GoogleStrategy(){
    clientId: #####,
    clientSecret: #####,
    callbackURL: ######,
    passReqToCallBack: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
});
**/
//mongoose config
mongoose.connect('mongodb://localhost/web_server');
app.use('/api',Auth.apiAuth);
app.use('/api/fish', fish);
app.use('/api/user', users);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(80);

module.exports = app;
