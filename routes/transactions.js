/*	
 
 */


var express = require('express');
var router = express.Router();
var request = require('request');


router.get('/:account', function(req, res, next) {
  var account = req.params.account;	
  var transactionurl = "https://bian-node-red.mybluemix.net/account/" + account +"/transactions";

  
  var params = {
    url: transactionurl,
    qs: { 
      coid: req.query.coid,
      accounttype: req.query.accounttype
    },
    method: 'GET',
    timeout: 10000
  };

  request(params, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            result.transaction.forEach(function (value) {
				if (value.trandesc) {
				  value.tranmemo = value.trandesc}
            });
            res.json(result);
        } 
        else {
            console.log('Unable to get transactions: ' + JSON.stringify(error));
            res.status(401).send('Unable to get transactions.');
        }
    });

});

module.exports = router;
