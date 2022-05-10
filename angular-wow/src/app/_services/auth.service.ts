import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, retry} from 'rxjs';
import {User} from '../_models/user';

import {HttpClient} from '@angular/common/http';
import {Role} from '../_models/role';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {NotificationService} from "./notification.service";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private URL = environment.URL;

  constructor(private http: HttpClient, private notif: NotificationService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }



  // simulate server authentication:
  // login(email: string, password: string) {
  //   return new Observable(subscriber => {
  //
  //     if (email === 'employee@yahoo.com' && password === '123') {
  //       const user: User = {email, role: Role.employee, token: 'some_random_token', firstName: 'Employee', corporate: false};
  //
  //       localStorage.setItem('currentUser', JSON.stringify(user));
  //
  //       setTimeout(() => {
  //         subscriber.next('Logged in!');
  //         this.currentUserSubject.next(user);
  //       }, 2000);
  //     } else if (email === 'corporate@yahoo.com' && password === '123') {
  //       const user: User = {email, role: Role.customer, token: 'some_random_token', firstName: 'CorporateCustomer', corporate: true};
  //       localStorage.setItem('currentUser', JSON.stringify(user));
  //       //  notify all subscribers that user has logged in.
  //       setTimeout(() => {
  //         subscriber.next('Logged in!');
  //         this.currentUserSubject.next(user);
  //       }, 2000);
  //     }  else if (email === 'customer@yahoo.com' && password === '123') {
  //       const user: User = {email, role: Role.customer, token: 'some_random_token', firstName: 'Customer', corporate: false};
  //       localStorage.setItem('currentUser', JSON.stringify(user));
  //       //  notify all subscribers that user has logged in.
  //       setTimeout(() => {
  //         subscriber.next('Logged in!');
  //         this.currentUserSubject.next(user);
  //       }, 100);
  //     } else if (email === 'manager@yahoo.com' && password === '123') {
  //       const user: User = {email, role: Role.manager, token: 'some_random_token', firstName: 'Manager', corporate: false};
  //       localStorage.setItem('currentUser', JSON.stringify(user));
  //       //  notify all subscribers that user has logged in.
  //       setTimeout(() => {
  //         subscriber.next('Logged in!');
  //         this.currentUserSubject.next(user);
  //       }, 100);
  //     } else {
  //       setTimeout(() => {
  //         subscriber.error('Wrong Email address or password');
  //       }, 100);
  //     }
  //
  //   });
  //
  // }

  // network based authentication strategy.
  login(email: string, password: string, empLogin: boolean): Observable<any> {

    // Read more here: https://angular.io/guide/http
    return this.http.post<any>(`${this.URL}/customer/login`, { email, password })
      .pipe( map(res => {
        if (res.data && res.data.token) {
          localStorage.setItem('currentUser', JSON.stringify(res.data));
          this.currentUserSubject.next(res.data);
          return res.data;
        }}), catchError(error => {
          return error;
          })
      );
  }


    logout() {
    this.notif.showNotification('See you soon! ' + this.currentUserValue.firstName, 'Dismiss', false);
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify all subscribers that user has logged out.
    this.currentUserSubject.next(null);
  }


}
