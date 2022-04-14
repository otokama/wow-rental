import {Component, NgModule} from '@angular/core';
import {AuthService} from './_services/auth.service';
import {Router} from '@angular/router';
import {User} from './_models/user';
import {Role} from './_models/role';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginComponent} from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WOW';
  currentUser: User;


  constructor(  private router: Router,
                private authService: AuthService,
                private dialog: MatDialog
                ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  get isEmployee() {
    return this.currentUser && this.currentUser.role === Role.employee;
  }

  get isCustomer() {
    return this.currentUser;
  }

  openLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '300px';
    dialogConfig.data = {};
    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);
    // TODO: authenticate user with auth service
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }



}
