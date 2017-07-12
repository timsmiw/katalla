// code scraps
var passport = require('passport');
var router = require('express').Router();
var expressSession = require('express-session');
var user = require('connect-ensure-login');
var LocalStrategy = require('passport-local').Strategy;
var optional = require('optional');
var appEnv = require('cfenv').getAppEnv();
var cfEnvUtil = require('./cfenv-credsbylabel');
var request = require('request');
var Cloudant = require('cloudant');

var serviceRegex = /(cloudantNoSQLDB).*/;

var optionsCloudant = optional('./cloudant-credentials.json') || {
	appEnv : appEnv
};

// parse vcap using cfenv if available
if (optionsCloudant.appEnv && !optionsCloudant.credentials) {
	optionsCloudant.credentials = cfEnvUtil.getServiceCredsByLabel(
			optionsCloudant.appEnv, serviceRegex);
}
// try again with name
else if (optionsCloudant.appEnv && !optionsCloudant.credentials) {
	optionsCloudant.credentials = optionsCloudant.appEnv
			.getServiceCreds(serviceRegex);
}
console.log('Cloudant URL=' + optionsCloudant.credentials.url);



Cloudant(optionsCloudant.credentials.url, function(err, cloudant) {
		if (err) {
			console.log('Cloudant init error');
			return done(err);
		}
		var db = cloudant.db.use('banker');
		db.get(username, {
			revs_info : false
		}, function(err, body) {
			if (!err) {
				if (password === body.secret) {
					console.log(body._id + ' Successful login')
					return done(null, body._id);
				}
				console.log(body._id + ' Invalid password')
				return done(null, false);
			} else {
				console.log('Find "' + username + '" ' + err.msg);
				return done(null, false);
			}
		});
	});