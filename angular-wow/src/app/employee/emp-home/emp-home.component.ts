import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {User} from '../../_models/user';
import {Role} from '../../_models/role';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';
import {EmpLocationComponent} from "../emp-location/emp-location.component";

@Component({
  selector: 'app-emp-home',
  templateUrl: './emp-home.component.html',
  styleUrls: ['./emp-home.component.css']
})
export class EmpHomeComponent implements OnInit {
  currentUser: User;
  page: number;
  @ViewChild(EmpLocationComponent, { static: false }) LocationComponent: EmpLocationComponent;

  constructor(public dialog: MatDialog, private authService: AuthService) {
    this.currentUser = this.authService.currentUserValue;
    this.page = 0;
  }

  ngOnInit(): void {
  }


  switchPage(page) {
    this.page = page;
  }

  get isManager() {
    return this.currentUser.role === Role.manager;
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '450px';
    if (this.page === 0) { // location
      dialogConfig.data = {form: 2};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.LocationComponent.fetchLocation();
        }
      })
    } else if (this.page === 1) { // company
      dialogConfig.data = {form: 0};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);
    } else if (this.page === 2) { // corporate customer
      dialogConfig.data = {form: 3};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    } else if (this.page === 3) { // coupon
      dialogConfig.data = {form: 1};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    } else if (this.page === 5) { // vehicle
      dialogConfig.data = {form: 4};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    } else if (this.page === 6) { // vehicle class
      dialogConfig.data = {form: 6};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    } else if (this.page === 7) { // employee
      dialogConfig.data = {form: 5};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    }

  }
}
