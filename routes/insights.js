/**
 * http://usejsdoc.org/
 */
var express = require('express');
var router = express.Router();
var user = require('connect-ensure-login');
var openwhisk = require('openwhisk');

const paramsModel = { 'messageType': 'CSC_DN',
		'callingServiceDomain': 'ContactDialog',
		'callingServiceOperation': 'executeCustomerContactSessionProcedure',
		'instruction': '',
		'httpReqType': 'GET', 
		'payload': {'appInData': {}}
};
var options = {
		api: 'https://openwhisk.ng.bluemix.net/api/v1/',
		namespace: 'CSC-BIAN-PNC_Dev',
		api_key: '02bbff7a-e3d1-4a3d-b415-677b460dcea4:vd5x8swlYCXPDk99EhFTC7aJDy9cvnsaVDcH0IdA8wtfCISDL9JhnTLtWiOlXz7i'
};

var ow = openwhisk(options);

const insightsName = "CustomerBehavioralInsights_retrieveCustomerBehavioralAnalysis";
var blocking = true;
router.get('/', user.ensureLoggedIn('/login'), function(req, res) {
	var name = insightsName;
	var params = paramsModel;
	blocking = true;
	params.payload.appInData = {'user': req.user};
	ow.actions.invoke({name, blocking, params}).then(result => {
		var appResp = result.response.result.payload.appOutData;
		console.log('Insights response=' + JSON.stringify(appResp));
		res.json(appResp);
	}).catch(err => {
		console.log('DN Error; name=' + name + ';error=' + JSON.stringify(err));
		res.status(401).send('Unable to get insights.');
	});
});
module.exports = router;