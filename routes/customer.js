/*	
 
 */


var express = require('express');
var router = express.Router();
var optional = require('optional');
var user = require('connect-ensure-login');
var appEnv = require('cfenv').getAppEnv();
var cfEnvUtil = require('./cfenv-credsbylabel');
var request = require('request');
var Cloudant = require('cloudant');

var serviceRegex = /(cloudantNoSQLDB).*/;

var options = optional('./cloudant-credentials.json') || {
    appEnv: appEnv
};

// parse vcap using cfenv if available
if (options.appEnv && !options.credentials) {
    options.credentials = cfEnvUtil.getServiceCredsByLabel(options.appEnv, serviceRegex);
}
// try again with name
else if (options.appEnv && !options.credentials) {
    options.credentials = options.appEnv.getServiceCreds(serviceRegex);
}

router.get('/:customer', function (req, res, next) {
    var customer = req.params.customer;

    Cloudant(options.credentials.url, function (err, cloudant) {
        if (err) {
            res.status(500).send({
                status: 500,
                message: 'Cloudant error failed to initialize'
            });
        } else {
            var response = {
                customer: {},
                status: 200,
                message: 'ok'
            };
            var db = cloudant.db.use('banker');
            db.get(customer, {
                include_docs: true
            }, function (err, data) {
                if (!err && data) {
                	response.customer = data
                    res.json(response);
                } else {
                    res.status(500).send({
                        status: 500,
                        message: 'Cloudant error reading database'
                    });
                }
            });
        }
    });
});

module.exports = router;