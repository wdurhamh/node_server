module.exports = {

isAuthenticated: function (req, res, next){
	if (req.user){
		return next();
	}
	
	res.redirect('/login');
},
apiAuth: function(req,res,next){
	if(req.user||req.method=='GET'||req.path=='/user/register'||req.path=='/user/login'){

		return next();
	}
	console.log(req.path);
	res.redirect('/login');
}
}
