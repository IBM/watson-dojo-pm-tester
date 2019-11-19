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

var bdadaysPMTester = angular.module("bdadaysPMTester", ['ui.bootstrap', 'sampleSrv']);

var	AppCtrl	=	['$scope',	'dialogServices', 'dataServices',
function AppCtrl($scope,	dialogServices, dataServices)	{


	// init UI data model

	$scope.p = { AGE: '44',	SEX:'F', FAMILYHISTORY:'Y', SMOKERLAST5YRS: 'Y', EXERCISEMINPERWEEK: '125', CHOLESTEROL: '242', BMI: '24', AVGHEARTBEATSPERMIN: '100', PALPITATIONSPERDAY: '85'  };

	$scope.score = function()	{
		dataServices.getScore($scope.p)
		.then(
			function(rtn) {
				if (rtn.status == 200){
					// success
					if (rtn.data.errors === undefined)
						$scope.showResults(rtn.data);
				    else
					   $scope.showError(rtn.data.errors[0].message);
				} else {
					// http failure
					$scope.showError(rtn.data.message);
				}
			},
			function(reason) {
				$scope.showError(reason);
			}
		);
	}

	$scope.showResults = function(rspHeader, rspData) {
		dialogServices.resultsDlg(rspHeader, rspData).result.then();
	}

	$scope.showError = function(msgText) {
		dialogServices.errorDlg("Error", msgText).result.then();
	}
}]

// This controller handles the results of the call to the ML Service
var	ResultsCtrl = ['$scope',	'$modalInstance',	'rspHeader', 'rspData', function ResultsCtrl($scope,	$modalInstance, rspHeader, rspData) {

	console.log("response from API")
	console.log(rspData)

	var formattedData = [];

	formattedData.push(rspData.values[0][4].toString()); // AGE
	formattedData.push(rspData.values[0][5]); // SEX
	if (rspData.values[0][6] == 'Y') // FAMILYHISTORY
	   formattedData.push('Yes');
    else
	   formattedData.push('No');

	if (rspData.values[0][7] == 'Y') //SMOKERLAST5YRS
	   formattedData.push('Yes');
    else
	   formattedData.push('No');

    formattedData.push(rspData.values[0][8].toString()); // EXERCISEMINPERWEEK
	formattedData.push(rspData.values[0][2].toString()); // CHOLESTEROL
	formattedData.push(rspData.values[0][3].toString()); // BMI
	formattedData.push(rspData.values[0][0].toString()); // AVGHEARTBEATSPERMIN
	formattedData.push(rspData.values[0][1].toString()); // PALPITATIONSPERDAY
	if (rspData.values[0][17] == 1)  // PREDICTION
	   formattedData.push('Yes');
    else
	   formattedData.push('No');

   // Format confidence
    if (rspData.values[0][17] == 1)  // CONFIDENCE
       confidence = (rspData.values[0][15][1] * 100).toFixed(2) + '%';
    else
	   confidence = (rspData.values[0][15][0] * 100).toFixed(2) + '%';

	formattedData.push(confidence);

	console.log('confidence is ' + confidence);

	$scope.rspData = [];
	$scope.rspHeader = rspHeader;


	$scope.rspData.push(formattedData);

	$scope.cancel	=	function() {
		$modalInstance.dismiss();
	}
}]

// This controller handles errors returned from the  call to the PM Service
var	ErrorCtrl = ['$scope',	'$modalInstance',	'msgTitle',	'message',
function ErrorCtrl($scope,	$modalInstance,	msgTitle,	message) {

	$scope.msgTitle	=	msgTitle;
	$scope.message = message;

	$scope.cancel	=	function() {
		$modalInstance.dismiss();
	}
}]

bdadaysPMTester.controller("AppCtrl",	AppCtrl);
bdadaysPMTester.controller("ResultsCtrl", ResultsCtrl);
bdadaysPMTester.controller("ErrorCtrl", ErrorCtrl);


