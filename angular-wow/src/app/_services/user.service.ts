import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../_models/user';
import {RegisterIndividual} from '../_models/registerIndividual';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

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


}
