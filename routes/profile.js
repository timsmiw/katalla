/*	
 
 */

var express = require('express');
var router = express.Router();
var optional = require('optional');
var user = require('connect-ensure-login');
//var appEnv = require('cfenv').getAppEnv();
//var cfEnvUtil = require('./cfenv-credsbylabel');
var request = require('request');
//var Cloudant = require('cloudant');

//var serviceRegex = /(cloudantNoSQLDB).*/;

//var options = optional('./cloudant-credentials.json') || {
//	appEnv : appEnv
//};

// parse vcap using cfenv if available
//if (options.appEnv && !options.credentials) {
//	options.credentials = cfEnvUtil.getServiceCredsByLabel(options.appEnv,
//			serviceRegex);
//}
// try again with name
//else if (options.appEnv && !options.credentials) {
//	options.credentials = options.appEnv.getServiceCreds(serviceRegex);
//}

router.get('/', user.ensureLoggedIn('/login'), function(req, res, next) {
	var customer = req.user;
	var profileurl = "https://bian-node-red.mybluemix.net/profile/"
			+ customer;
	var params = {
		url : profileurl,
		method : 'GET',
		headers: {
		    'Cache-control': 'no-cache'
		  },
		timeout : 10000
	};

	request(params, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var result = JSON.parse(body);
			console.log('Profile=' + JSON.stringify(result));
			res.json(result.payload.appOutData.custdata);
		} else {
			console.log('Unable to get profile: ' + JSON.stringify(error));
			res.status(401).send('Unable to get profile.');
		}
	});
});

module.exports = router;