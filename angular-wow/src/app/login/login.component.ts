import { Component, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';
import {NotificationService} from '../_services/notification.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html' ,
  styleUrls: ['login.component.css']})

export class LoginComponent {
  error = '';
  email: string;
  password: string;
  hide: boolean;
  fieldControl = new FormControl('', [Validators.required]);
  constructor(
     public dialogRef: MatDialogRef<LoginComponent>,
     @Inject(MAT_DIALOG_DATA) data,
     private router: Router,
     private authService: AuthService,
     private notif: NotificationService
  ) {
    this.hide = true;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }


  getError() {
    if (this.fieldControl.hasError('required')) {
      return 'You must fill in this field.';
    }
  }

  login() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password, false)
          .pipe(first())
          .subscribe(
              data => {
                if (data) {
                  this.dialogRef.close();
                  if (this.router.url.indexOf('/search') < 0) {
                    this.router.navigate(['/']);
                  }
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



  onNoClick(): void {
    this.dialogRef.close();
  }

  enterKeyHandler(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.login();
    }
  }
}


