import { Component, OnInit } from '@angular/core';
import {Role} from '../_models/role';
import {AuthService} from '../_services/auth.service';
import {User} from '../_models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';
import {NotificationService} from '../_services/notification.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  customerAccountForm: FormGroup;
  currentUser: User;
  submitted = false;
  states: string[];
  page: number;
  constructor(private authService: AuthService, private formBuilder: FormBuilder,private userService: UserService,
              private notification: NotificationService) {
    this.page = 0;
    this.states = this.userService.getStates();
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    // TODO: get user account detail:
    this.customerAccountForm = this.formBuilder.group({
      firstName: [this.currentUser.firstName, [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      middleName: ['', [Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: [this.currentUser.email, [Validators.required, Validators.email, Validators.maxLength(30)]],
      streetaddress: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.maxLength(30)]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      driverLicense: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      insureName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      insureNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]]
    });
  }
  get customerForm() {
    return this.customerAccountForm.controls; }

  get isEmployee() {
    return this.currentUser && this.currentUser.role === Role.employee;
  }

  switchPage(page) {
    this.page = page;
  }

  updateAccountInfo(){
    this.submitted = true;
  }
}
