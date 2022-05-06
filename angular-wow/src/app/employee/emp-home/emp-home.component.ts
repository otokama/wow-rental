import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {User} from '../../_models/user';
import {Role} from '../../_models/role';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';

@Component({
  selector: 'app-emp-home',
  templateUrl: './emp-home.component.html',
  styleUrls: ['./emp-home.component.css']
})
export class EmpHomeComponent implements OnInit {
  currentUser: User;
  page: number;


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
    if (this.page === 0) {
      dialogConfig.data = {form: 2};
    } else if (this.page === 1) {
      dialogConfig.data = {form: 0};
    } else if (this.page === 2) {
      dialogConfig.data = {form: 3};
    } else if (this.page === 3) {
      dialogConfig.data = {form: 1};
    } else if (this.page === 5) {
      dialogConfig.data = {form: 4};
    } else if (this.page === 6) {
      dialogConfig.data = {form: 6};
    } else if (this.page === 7) {
      dialogConfig.data = {form: 5};
    }
    const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);
  }
}
