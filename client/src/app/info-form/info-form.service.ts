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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class InfoService {

    constructor(private http: HttpClient) { }

    wmlUserName = '***';
    wmlPassword = '***';
    wmlApiKey = '***';
    wmlInstance = '***';
    wmlDeployment = '***';

    getToken() {
        const tokenUrl = '/v3/identity/token';
        const tokenHeader = 'Basic ' + btoa((this.wmlUserName + ':' + this.wmlPassword));

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: tokenHeader,
                'Content-Type': 'application/json;charset=UTF-8',
            })
        };

        return this.http.get(tokenUrl, httpOptions);
    }

    scoreInfo(age, gender, familyhistory, smoker, exercise, cholesterol, bmi, heartbeats, palpitations, token) {
        const scoringURL = '/v3/wml_instances/' + this.wmlInstance + '/deployments/' + this.wmlDeployment + '/online';
        const tokenHeader = 'Bearer ' + token;

        const payloadArray = {
            fields:  ['AVGHEARTBEATSPERMIN', 'PALPITATIONSPERDAY', 'CHOLESTEROL', 'BMI',
                      'AGE', 'SEX', 'FAMILYHISTORY', 'SMOKERLAST5YRS', 'EXERCISEMINPERWEEK'],
            values: [[ Number(heartbeats), Number(palpitations), Number(cholesterol), Number(bmi),
                Number(age), gender, familyhistory, smoker, Number(exercise) ]]
        };
        const payload = JSON.stringify(payloadArray);
        console.log(payload);

        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: tokenHeader,
                'Content-Type': 'application/json;charset=UTF-8',
                Accept: 'application/json',
            })
        };

        return this.http.post(scoringURL, payload, httpOptions);
    }
}
