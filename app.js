/*
 * Copyright 2019 IBM All Rights Reserved.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 // BASE SETUP
// =============================================================================
var path        = require('path');
var bodyParser 	= require('body-parser');
var express    	= require('express');
var request 	= require('request');
var btoa        = require('btoa');


var app        	= express(); // define our app using express


var port = (process.env.PORT || 3000);


// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var env = { baseURL: '', apikey: '', instance_id: '' };
var token = null;
var scoringHref = null;
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var service = {};
if (services['pm-20']) {
   service = services['pm-20'][0];
}
var credentials = service.credentials;

/* the credentials are of the form ...
	"credentials": {
		"apikey": "xxx",
		"iam_apikey_description": "Auto-generated for binding 123",
		"iam_apikey_name": "pm-20-dsx",
		"iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Writer",
		"iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/123::serviceid:ServiceId-123",
		"instance_id": "123",
		"url": "https://us-south.ml.cloud.ibm.com"
	},
*/


if (credentials !== null) {
	// use env.baseURL for calling WML APIs only. Do not use it for IAM auth. Use (https://iam.cloud.ibm.com) for IAM auth instead.
	env.baseURL = credentials.url;
	env.apikey = credentials.apikey;
	env.instance_id = credentials.instance_id;
	var options = {
		url: 'https://iam.cloud.ibm.com/identity/token',
		headers: { "Content-Type"  : "application/x-www-form-urlencoded",
					"Authorization" : "Basic " + btoa('bx:bx') },
		body: "apikey=" + credentials.apikey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey",
		method: 'POST'
	};
	request(options, function(err, res, body) {
		if (err) {
			console.log('Error from GET to retrieve token ' + err);
			return;
		}
		token = JSON.parse(body).access_token;
		console.log('Got an IAM token');
		var opts = {
			url: env.baseURL + '/v3/wml_instances/' + env.instance_id + '/deployments',
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			},
			json: true
		};
		request(opts, function(err, res, body) {
			if (err) {
				console.log('Error from GET to retrieve scoring href ' + err);
				return;
			}

			for (i = 0; i < body.resources.length; i++) {
				if (body.resources[i].entity.published_model.name == 'Heart Failure Prediction Model') {
					scoringHref = body.resources[i].entity.scoring_url;
					env.published_model_id = body.resources[i].entity.published_model.guid;
					env.deployment_id = body.resources[i].metadata.guid;
					console.log('Found Heart Failure Deployment Model');
					break;
					}
			}
			if (!scoringHref) {
				console.log('Error: Did not find Heart Failure Deployment Model');
			}
		});
	});
}

// Only  URL paths prefixed by /score will be handled by our router
var rootPath = '/score';

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 	// get an instance of the express Router

// configure router to use bodyParser()
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


// middleware to use for all requests
router.use(function(req, res, next) {
 	next(); // make sure we go to the next routes and don't stop here
});

// env request
// Echoes the URL and access key of the scoring service - useful for debugging
router.get('/', function(req, res) {
	res.json(env);
});

// score request
// Calls the PM Service instance
router.post('/', function(req, res) {

	if (!token || !scoringHref) {
		res.status(503).send('Service unavailable');
		return;
	}

console.log('=== SCORE ===');
console.log('  URI  : ' + scoringHref);
console.log('  Input: ' + JSON.stringify(req.body.input));
console.log(' ');
	try {
		var opts = {
			url: scoringHref,
			method: "POST",
			headers: {
			   Authorization: 'Bearer ' + token
			},
			// The following query parameters are not used when scoring against a WML Model
			//qs: { instance_id: env.instance_id, deployment_id: env.deployment_id, published_model_id: env.published_model_id },
			json: req.body.input
		};
		request(opts, function(err, r, body) {
			if (err) {
			   res.status(500).send(err);
			}
			else {
				console.log('Reply from scoring ' + body);
                res.json(body);
			}

		});

	} catch (e) {
		console.log('Score exception ' + JSON.stringify(e));
		var msg = '';
		if (e instanceof String) {
			msg = e;
		} else if (e instanceof Object) {
		  msg = JSON.stringify(e);
		}
		res.status(200);
		return res.end(JSON.stringify({
			flag: false,
			message: msg
		}));
	}

	process.on('uncaughtException', function (err) {
    console.log(err);
	});
});

// Register Service routes and SPA route ---------------

// all of our service routes will be prefixed with rootPath
app.use(rootPath, router);


// SPA AngularJS application served from the root
app.use(express.static(path.join(__dirname, 'public')));

// START THE SERVER with a little port reminder when run on the desktop
// =============================================================================
app.listen(port);
console.log('App started on port ' + port);
