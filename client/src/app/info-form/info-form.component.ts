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
  confidence = 0.0;
  attrition = 0.0;

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
      (response) => {
        console.log("/token API return below:");
        console.log(response)
        this.token = response['token']
      }
    );

    this.infoService.scoreInfo(this.model.age, this.model.gender, this.model.familyhistory,
      this.model.smoker, this.model.exercise, this.model.cholesterol, this.model.bmi,
      this.model.heartbeats, this.model.palpitations, this.token).subscribe(
      (response) => {
        console.log("/score API return below:");
        console.log(response);
        this.confidence = response['values'][0][11];
        this.attrition = response['values'][0][13];
      }
    );

  }

  newInfo() {
    // dummy values used when the user clicks "Reset"
    this.model = new Info(0, '', '', '', 0, 0, 0, 0, 0);
  }

}
