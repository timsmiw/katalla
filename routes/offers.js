/*	
 
 */

var express = require('express');
var router = express.Router();
var optional = require('optional');
var user = require('connect-ensure-login');
var request = require('request');


router.get('/', user.ensureLoggedIn('/login'), function(req, res, next) {
	var customer = req.user;
	var offersurl = "https://bian-node-red.mybluemix.net/offers/"
			+ customer + '?lat=' + req.query.lat + '&lon=' + req.query.lon + '&lang=' + req.query.lang;
			console.log('->' + offersurl);	
	var params = {
		url : offersurl,
		method : 'GET',
		headers: {
		    'Cache-control': 'no-cache'
		  },
		timeout : 10000
	};

	request(params, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var result = JSON.parse(body);
			console.log('->' + JSON.stringify(result));
			res.json(result);
		} else {
			console.log('Unable to get profile: ' + JSON.stringify(error));
			res.status(401).send('Unable to get offers.');
		}
	});
});

module.exports = router;