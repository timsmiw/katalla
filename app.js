/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config();

var routes = require('./routes/index');
var customer = require('./routes/customer');
var resources = require('./routes/resources');
var profile = require('./routes/profile');
var offers = require('./routes/offers');
var insights = require('./routes/insights');
var alerts = require('./routes/alerts');
var details = require('./routes/details');
var translate = require('./routes/translate');
var transactions = require('./routes/transactions');
var text = require('./routes/text-speech');
var speech = require('./routes/speech-text');
var conversation = require('./routes/conversation');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));
app.use(cookieParser());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(__dirname + '/public'));
app.enable('trust proxy');

app.use('/', routes);
app.use('/customer', customer);
app.use('/resources', resources);
app.use('/profile', profile);
app.use('/offers', offers);
app.use('/insights', insights);
app.use('/alerts', alerts);
app.use('/details', details);
app.use('/translate', translate);
app.use('/transactions', transactions);
app.use('/text', text);
app.use('/speech', speech);
app.use('/conversation', conversation);

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;