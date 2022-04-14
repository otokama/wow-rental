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
  username: string;
  password: string;
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
  }


  getError() {
    if (this.fieldControl.hasError('required')) {
      return 'You must fill in this field.';
    }
  }

  login() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password)
          .pipe(first())
          .subscribe(
              data => {
                this.notif.showNotif( 'Welcome!  ' + this.username, 'Dismiss');
                this.dialogRef.close();
              },
              error => {
                this.error = error;
                // show a snackbar to user
                this.notif.showNotif(this.error, 'Dismiss');
                console.log('Error', error);
              });
    } else {
      this.notif.showNotif('Please enter username and password.', 'Dismiss');
    }
  }


  register() {
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


