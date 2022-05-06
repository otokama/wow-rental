import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AuthService} from '../../_services/auth.service';
import {NotificationService} from '../../_services/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-emp-login',
  templateUrl: './emp-login.component.html',
  styleUrls: ['./emp-login.component.css']
})
export class EmpLoginComponent implements OnInit {
  email: string;
  password: string;
  hide: boolean;
  fieldControl = new FormControl('', [Validators.required]);
  constructor(private authService: AuthService, private notif: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.hide = true;
  }

  enterKeyHandler(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.empLogin();
    }
  }

  empLogin() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password, false)
          .pipe(first())
          .subscribe(
              data => {
                if (data) {
                  this.router.navigate(['employee/home']);
                  this.notif.showNotif('Welcome, ' + this.authService.currentUserValue.firstName,
                      'Dismiss');
                }
              },
              error => {
                console.log('Error: ', error);
              });
    } else {
      this.notif.showNotif('Please enter Email and password.', 'Dismiss');
    }
  }

  getError() {
    if (this.fieldControl.hasError('required')) {
      return 'You must fill in this field.';
    }
  }

}
