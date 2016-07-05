module.exports = {

isAuthenticated: function (req, res, next){
	if (req.user.authenticated){
		return next();
	}
	
	res.redirect('/');
}
}
