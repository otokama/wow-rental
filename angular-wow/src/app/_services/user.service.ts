import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../_models/user';
import {RegisterIndividual} from '../_models/registerIndividual';
import {environment} from '../../environments/environment';
import {UpdateIndividual} from '../_models/updateIndividual';
import {UpdateEmployee} from "../_models/updateEmployee";
import {catchError, map} from "rxjs/operators";
import {stringify} from "querystring";

@Injectable({ providedIn: 'root' })
export class UserService {
  headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  });
  states: string[];
  private URL = environment.URL;
  constructor(private http: HttpClient) {
    this.states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho',
      'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts',
      'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
      'New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon',
      'Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
      'Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  }


  getStates(): string[]{
    return this.states;
  }

  registerIndividual(newIndividual: RegisterIndividual) {
    return this.http.post(`${this.URL}/customer/register`, newIndividual);
  }

  updateIndividual(update: UpdateIndividual) {
    return this.http.post<any>(`${this.URL}/customer/update/individual`, update)
        .pipe(map(res => {
          if (res.message === 'Success') {
            return res;
          }
        }), catchError(error => {
          return error;
        }));
  }

  updateEmployee(update: UpdateEmployee){
      console.log(update);
    return this.http.post<any>(`${this.URL}/employee/update`, update);
  }

}
