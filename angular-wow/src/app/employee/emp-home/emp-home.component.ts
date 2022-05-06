import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {User} from '../../_models/user';
import {Role} from '../../_models/role';

@Component({
  selector: 'app-emp-home',
  templateUrl: './emp-home.component.html',
  styleUrls: ['./emp-home.component.css']
})
export class EmpHomeComponent implements OnInit {
  currentUser: User;
  page: number;


  constructor(private authService: AuthService) {
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



}
