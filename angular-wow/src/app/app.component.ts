import {Component, OnInit, NgModule} from '@angular/core';
import {AuthService} from './_services/auth.service';
import {Router} from '@angular/router';
import {User} from './_models/user';
import {Role} from './_models/role';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoginComponent} from './login/login.component';
import {NotificationService} from './_services/notification.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'WOW';
  currentUser: User | null;
  name: string;
  private currentUserSubs: Subscription;
  constructor(  private router: Router,
                private authService: AuthService,
                private dialog: MatDialog,
                private notif: NotificationService
                ) {
  }

  ngOnInit() {
    this.currentUserSubs = this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.name = x.firstName;
    }, error => (console.log('logged out')));
  }

  get isEmployee() {
    return this.currentUser && (this.currentUser.role === Role.employee || this.currentUser.role === Role.manager);
  }

  get isUser() {
    return this.currentUser;
  }

  openLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    this.dialog.open(LoginComponent, dialogConfig);
  }


  logout() {
    this.authService.logout();
    this.notif.showNotif('You have been signed out.', 'Dismiss');
    this.router.navigate(['']);
  }

  get isEmpRoute() {
    return this.router.url.indexOf('/employee');
  }

  get isHome() {
    return this.router.url === '/';
  }

}
