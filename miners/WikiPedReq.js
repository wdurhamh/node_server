var Request  = rquire('request');
var APIEndpoint = "en.wikipedia.org/w/api.php"

function WikiPedReq(method, options){
	this._method = method;
	this._options = options;
	this.url = this.createURL();
	console.log(this.url);
}

WikiPedReq.prototype.createURL = function() {
	var queryString = "?action = " + this._options._action 
						+ "&titles=" + this._options._titles 
						+ "&format=" + this._options._format;
	//TODO - allow for additional parameters in q string
	return this.method + ":// "+ APIEndpoint + queryString;

};

WikiPedReq.prototype.sendRequest = function() {
	Request.post({url:this.url, json:post_data}, function(err,res, body){
		if (err){
			console.log(err);
		}
		else{
			console.log(res)
		};
	});

};

module.export = WikiPedReq;