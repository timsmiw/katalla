/*	

 */
var passport = require('passport');
var router = require('express').Router();
var expressSession = require('express-session');
var user = require('connect-ensure-login');
var LocalStrategy = require('passport-local').Strategy;
var optional = require('optional');
var appEnv = require('cfenv').getAppEnv();
var cfEnvUtil = require('./cfenv-credsbylabel');
var request = require('request');
var openwhisk = require('openwhisk');
const paramsModel = { 'messageType': 'CSC_DN',
		'callingServiceDomain': 'CustomerWorkbench',
		'callingServiceOperation': '',
		'instruction': '',
		'httpReqType': 'POST', 
		'payload': {'appInData': {}}
};
var options = {
		api: 'https://openwhisk.ng.bluemix.net/api/v1/',
		namespace: 'CSC-BIAN-PNC_Dev',
		api_key: '02bbff7a-e3d1-4a3d-b415-677b460dcea4:vd5x8swlYCXPDk99EhFTC7aJDy9cvnsaVDcH0IdA8wtfCISDL9JhnTLtWiOlXz7i'
};

var ow = openwhisk(options);

const loginName = "ContactHandler_executeCustomerContactOperatingSession";
const sessionName = "EBranchOperations_executeEBranchOperatingSession";
var blocking = true;

router.use(expressSession({
	secret : process.env.SESSION_SECRET,
	resave : 'false',
	saveUninitialized : 'false'
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy({passReqToCallback: true}, function(req, username, password, done) {
	var name = loginName;
	var params = paramsModel;
	blocking = true;
	params.payload.appInData = {'timestamp': new Date().toISOString(), 'hostname': req.hostname, 'application': process.env.APPLID, 'session': req.session.id, 'user': username, 'secret': password};
	ow.actions.invoke({name, blocking, params}).then(result => {
		console.log('result=' + JSON.stringify(result));
		var appResp = result.response.result.payload.appOutData;
		console.log('login resp=' + JSON.stringify(appResp));
		if (appResp.status === "OK") {
			console.log('Successful login, user=' + username);
			return done(null, username);
		} else { 
			console.log('Authentication failure: user=' + username + ';status=' + appResp.status);
			return done(null, false);
		}
	}).catch(err => {
		console.log('Authentication failure: user=' + username + ';error=' + JSON.stringify(err));
		return done(null, false);
	})
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

router.get('/login', function(req, res) {
	var name = sessionName;
	var params = paramsModel;
	blocking = false;
	params.payload.appInData = {'timestamp': new Date().toISOString(), 'hostname': req.hostname, 'application': process.env.APPLID, 'ip': req.ip, 'session': req.session.id, 'agent': req.get('User-Agent')};
	ow.actions.invoke({name, blocking, params}).then(result => {
		console.log('Session response=' + JSON.stringify(result));
	}).catch(err => {
		console.log('DN Error; name=' + name + ';error=' + JSON.stringify(err));
	})
	res.render('login', {
		'defusername': req.query.username
	});
});

router.post('/login', passport.authenticate('local', {
	failureRedirect : '/login'
}), function(req, res) {
	res.redirect('/');
});

router.get('/failure', function(req, res) {
	res.send('login failed');
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

/* GET home page. */
router.get('/', user.ensureLoggedIn('/login'), function(req, res, next) {
	console.log('Request from user=' + JSON.stringify(req.user));
	res.render('index');
});

module.exports = router;