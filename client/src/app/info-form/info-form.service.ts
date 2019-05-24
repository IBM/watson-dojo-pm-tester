import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class InfoService {

    constructor(private http: HttpClient) { }

    wml_instance = 'a7ea00ba-abd1-4516-838e-fe298495a427';
    wml_deployment = '13cbddfd-69ad-4d1d-8234-a26f29d3f715';

    wml_service_credentials_url = 'https://us-south.ml.cloud.ibm.com';
    wml_service_credentials_username = '8b9b89e0-aaa5-4fcd-8a5d-b0d8c85c5152';
    wml_service_credentials_password = '26de7ff9-7bb6-45ce-b311-d0b14061748f';
    wml_api_key = 'SPUIW7odR8YWYSJ5ij_3PgzD77Z59K4A9GIJcnfwU_xb';

    getToken() {
        var tokenUrl = this.wml_service_credentials_url + '/v3/identity/token';
        var tokenHeader = 'Basic ' + btoa((this.wml_service_credentials_username + ':' + this.wml_service_credentials_password));

        var httpOptions = {
            headers: new HttpHeaders({
                'Authorization': tokenHeader,
                'Content-Type': 'application/json;charset=UTF-8',
            })
        };

        return this.http.get(tokenUrl, httpOptions);
    }

    scoreInfo(age, gender, familyhistory, smoker, exercise, cholesterol, bmi, heartbeats, palpitations, token) {
        var scoring_url = this.wml_service_credentials_url + "/v3/wml_instances/" + this.wml_instance + "/deployments/" + this.wml_deployment + "/online";
        var tokenHeader = 'Bearer ' + token;

        var payload_array = {
            fields:  ["AVGHEARTBEATSPERMIN","PALPITATIONSPERDAY","CHOLESTEROL","BMI","AGE","SEX","FAMILYHISTORY","SMOKERLAST5YRS","EXERCISEMINPERWEEK"],
            values: [[ heartbeats, palpitations, cholesterol, bmi, age, gender, familyhistory, smoker, exercise ]]
        };
        var payload = JSON.stringify(payload_array);
        console.log(payload);

        var httpOptions = {
            headers: new HttpHeaders({
                'Authorization': tokenHeader,
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json',
            })
        };

        return this.http.post(scoring_url, payload, httpOptions);
    }
}
