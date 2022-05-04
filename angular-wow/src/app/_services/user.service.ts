
import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {User} from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {

  states: string[];

  constructor(private http: HttpClient) {
    this.states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho',
      'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts',
      'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
      'New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon',
      'Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
      'Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  }


  // TODO:Change all to dummy backend
  getAll() {
     return this.http.get<User[]>(`http://localhost:3030/user/allusers`);
  }

  getStates(): string[]{
    return this.states;
  }

  register(user: User) {
    return this.http.post(`http://localhost:3030/user/register`, user);
  }


}
