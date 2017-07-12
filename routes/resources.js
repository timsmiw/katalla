/*	
 * Copyright IBM Corp. 2016
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author Steven Atkin
 */

var optional = require('optional');
var appEnv = require('cfenv').getAppEnv();
var gpClient = require('g11n-pipeline').getClient(
  optional('./g11n-credentials.json')   // if it exists, use local-credentials.json
    || {appEnv: appEnv}                  // otherwise, the appEnv
);
var express = require('express');
var router = express.Router();


// No need to authenticate getting the resources for the app
router.get('/', function(req, res, next) {
  var myResources = gpClient.bundle(req.query.resource);
  myResources.getStrings({ languageId: req.query.language}, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            var myStrings = result.resourceStrings;
            res.json(myStrings);
        }
    });
});

module.exports = router;
