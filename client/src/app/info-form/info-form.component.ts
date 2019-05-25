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

import { Component } from '@angular/core';
import { InfoService } from './info-form.service';
import { Info } from '../info';

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html'
})
export class InfoFormComponent {

  genders = ['M', 'F'];
  histories = ['Y', 'N'];
  smokers = ['Y', 'N'];
  confidence = 0;
  predictionLabel = ''

  // used to make the hidden div show up
  submitted = false;

  // dummy values we use to prime the form
  model = new Info(33, 'F', 'Y', 'Y', 125, 242, 24, 100, 85);

  // token used to make REST calls
  token = undefined;

  constructor(private infoService: InfoService) { }

  onSubmit() {
    this.submitted = true;

    this.infoService.getToken().subscribe(
      (tokenResponse) => {
        console.log('/token API return below:');
        console.log(tokenResponse);
        this.token = tokenResponse['token'];

        this.infoService.scoreInfo(this.model.age, this.model.gender, this.model.familyhistory,
          this.model.smoker, this.model.exercise, this.model.cholesterol, this.model.bmi,
          this.model.heartbeats, this.model.palpitations, this.token).subscribe(
          (scoreResponse) => {
            console.log('/score API return below:');
            console.log(scoreResponse);
            let confidencePercent = scoreResponse['values'][0][16][0] * 100;
            console.log(confidencePercent)
            this.confidence = Number.parseFloat(confidencePercent).toFixed(2);
            this.predictionLabel = scoreResponse['values'][0][18];
          }
        );

      }
    );

  }

  newInfo() {
    // dummy values used when the user clicks "Reset"
    this.model = new Info(0, '', '', '', 0, 0, 0, 0, 0);
  }

}
