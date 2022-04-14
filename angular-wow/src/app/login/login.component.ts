import { Component, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';
import {NotificationService} from '../_services/notification.service';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html' ,
  styleUrls: ['login.component.css']})

export class LoginComponent {
  error = '';
  username: string;
  password: string;
  loginForm: FormGroup;
  fieldControl = new FormControl('', [Validators.required]);
  constructor(
     public dialogRef: MatDialogRef<LoginComponent>,
     @Inject(MAT_DIALOG_DATA) data,
     private router: Router,
     private authService: AuthService,
     private notif: NotificationService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(
          '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,63}$',
      ), ]),
      password: new FormControl('', [Validators.required, Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
      )])
    });

  }


  getError() {
    if (this.fieldControl.hasError('required')) {
      return 'You must fill in this field.';
    }
  }

  login() {
    if (this.username && this.password) {
    }
  }


  register() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


