/**
  *
  * main() will be invoked when you Run This Action.
  * 
  * @param OpenWhisk actions accept a single parameter,
  *        which must be a JSON object.
  *
  * @return which must be a JSON object.
  *         It will be the output of this action.
  *
  *
  * ServiceDomain_ServiceOperation is ContactHandler_executeCustomerContactOperatingSession
  * Cloudant Table is contacthandler_controlsrecords
  */
//Load the request module
var request = require('request');

function main(params) {
console.log('-----------------params ----------------');
console.log(params);

  var options = {"headers":{"Accept": "application/json","Content-Type": "application/json"}};

  switch(params.messageType) {

	case "CSC_DN":
	  options.url = "https://bian-node-red.mybluemix.net/authenticatelogin";
      options.method = params.httpReqType;
	  options.json = params.payload.appInData;
      break;

    case "SAP IDoc":
      options.url = "http://somewhereInAnSAPapi";
      options.method = params.payload.httpReqType;
      options.json = params.payload.appInData;
      break;

    case "SWIFT MT":
      options.url = "http://http://somewhereInAPIconnectThatHasaMockedupDNapiThatHandlesSwiftMT-MessageType";
      options.method = params.payload.httpReqType;
      options.json = params.payload.appInData;
      break;

    // add case here

    default:
	  options.url = "http://somewhereInAPIconnectThatHasaMockedupDNapiThatHandlesAnUnknown-MessageType";
	  options.method = "POST";
	  options.json = params;
  }

	var optionsForCloudant = {
	  url: 'https://f50b2ad7-05b5-4d35-9a49-1f9d1421c23a-bluemix:9c4c32aef17b54514b96765287295a8901e31a5ebeb7b299cff20f76418b0971@f50b2ad7-05b5-4d35-9a49-1f9d1421c23a-bluemix.cloudant.com/contacthandler_controlsrecords',
	  method: 'POST',
	  headers:{'Accept': 'application/json','Content-Type': 'application/json'},
	  json: params
	};
return new Promise((resolve, reject) => {
        request(options, function(error, response, body) {
            if (error) {
                // TODO
                // Add more error handling
                console.log('-------- IN Error OF REQUEST-----------');
                console.log('Error=' + JSON.stringify(error));
                reject(error);
            }
            else {
            	//A try is used since it is possible to get a response that is not JSON
            	try{
            	    switch (response.statusCode) {
				        case 200:
				            break;
			            case 403:
			                break;
		                case 404:
			                break;
			            default:
			                reject(response);
				    };
    				params.payload.appOutData = body;
    				console.log('OpenBank Call ok');
					console.log('Body retunred from call:' + JSON.stringify(body));
    				request(optionsForCloudant, function(error, response, body){
				 		if(error) {
				 				console.log('Error during Cloudant call: ' + error);
					    	    //logging options used to produce error
					    	    console.log('Data that caused error:' + optionsForCloudant);
					    	    reject(error);
					    	} else {
					    		console.log('Cloudant called successfully.');
					    		obj = body;
					    		// Important - THIS resolve is the function return, NOT the return below. 
					    		// We need to make sure this passes back the original message for the next item in the node red flow. 
					        	resolve(params);
					    	}
					    });

					//resolve(params);

				}catch(e){
    				//report the error
    				console.log('BAD data. This is not a json object ERROR:' + e);
    				console.log(body);
    				reject(e);
				}
            }
        });
    });

};
