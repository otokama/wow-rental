import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../_models/user';

import {HttpClient} from '@angular/common/http';
import {Role} from '../_models/role';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // simulate server authentication:
  login(username: string, password: string) {
    // In the future we will do server authentication here. For now we will simulate it.
    return new Observable(subscriber => {

      if (username === 'employee' && password === '123') {
        const user: User = {username, role: Role.employee, token: 'some_random_token'};

        localStorage.setItem('currentUser', JSON.stringify(user));
        //  notify all subscribers that user has logged in.


        setTimeout(() => {
          subscriber.next('Logged in!');
          this.currentUserSubject.next(user);
        }, 100);
      } else if (username === 'customer' && password === '123') {
        const user: User = {username, role: Role.customer, token: 'some_random_token'};
        localStorage.setItem('currentUser', JSON.stringify(user));
        //  notify all subscribers that user has logged in.
        setTimeout(() => {
          subscriber.next('Logged in!');
          this.currentUserSubject.next(user);
        }, 100);
      } else {
        setTimeout(() => {
          subscriber.error('Wrong username or password');
        }, 100);
      }

    });

  }


  // login(username: string, password: string): Observable<any> {
  //   // Changed to network based authentication strategy.
  //
  //   // Read more here: https://angular.io/guide/http
  //   return this.http.post<any>(`http://localhost:3030/user/authenticate`, { username, password })
  //     .pipe(map(user => {
  //
  //       if (user && user.token) {
  //
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //         this.currentUserSubject.next(user);
  //       }
  //
  //       return user;
  //     }));
  // }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify all subscribers that user has logged out.
    this.currentUserSubject.next(null);
  }


}
