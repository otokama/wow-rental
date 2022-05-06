import { Component, OnInit } from '@angular/core';
import {Role} from '../_models/role';
import {AuthService} from '../_services/auth.service';
import {User} from '../_models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';
import {NotificationService} from '../_services/notification.service';
// TODO: integrate with backend
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  customerAccountForm: FormGroup;
  employeeAccountForm: FormGroup;
  credentials: FormGroup;
  currentUser: User;
  submittedCustomerAccountForm = false;
  submittedEmployeeAccountForm = false;
  submittedUpdateCredentialForm = false;
  states: string[];
  hide = true;
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
      customerID: [this.currentUser.customerID],
      firstName: [this.currentUser.firstName, [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      lastName: [this.currentUser.lastName, [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      middleName: ['', [Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: [this.currentUser.email, [Validators.required, Validators.email, Validators.maxLength(30)]],
      street: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.maxLength(30)]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      driverLicense: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      insuranceCompany: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      insuranceNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]]
    });
    this.employeeAccountForm = this.formBuilder.group({
      employeeID: [this.currentUser.employeeID],
      firstName: [this.currentUser.firstName, [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      lastName: [this.currentUser.lastName, [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      email: [this.currentUser.email, [Validators.required, Validators.email, Validators.maxLength(30)]]
    });
    this.credentials = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9/!%^&*()]+$'), Validators.minLength(6),
        Validators.maxLength(30)]],
      newPassword: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9/!%^&*()]+$'), Validators.minLength(6),
        Validators.maxLength(30)]]
    })
  }
  get customerForm() {
    return this.customerAccountForm.controls; }

  get employeeForm() {
    return this.employeeAccountForm.controls;
  }

  get credentialForm() {
    return this.credentials.controls;
  }

  get isEmployee() {
    return this.currentUser && (this.currentUser.role === Role.employee || this.currentUser.role === Role.manager);
  }

  switchPage(page) {
    this.page = page;
  }

  updateAccountInfo() {
    if (this.isEmployee) {
      this.submittedEmployeeAccountForm = true;
    } else {
      this.submittedCustomerAccountForm = true;
    }
  }

  updatePassword(){
    this.submittedUpdateCredentialForm = true;
    console.log('updating password.');
  }

}