import { Component, OnInit } from '@angular/core';
import {Role} from '../_models/role';
import {AuthService} from '../_services/auth.service';
import {User} from '../_models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';
import {NotificationService} from '../_services/notification.service';
import {first} from "rxjs/operators";
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
  hide1 = true;
  hide2 = true;
  page: number;
  constructor(private authService: AuthService, private formBuilder: FormBuilder,private userService: UserService,
              private notification: NotificationService) {
    this.page = 0;
    this.states = this.userService.getStates();
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    // TODO: get user account detail:
    this.customerAccountForm = this.formBuilder.group({
      customerId: [this.currentUser.customerId],
      firstName: [this.currentUser.firstName, [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      lastName: [this.currentUser.lastName, [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      middleName: ['', [Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      street: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.maxLength(30)]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      driverLicense: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      insuranceCompany: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      insuranceNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]]
    });
    this.employeeAccountForm = this.formBuilder.group({
      employeeId: [this.currentUser.employeeId],
      firstName: [this.currentUser.firstName, [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      lastName: [this.currentUser.lastName, [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      middleName: ['', [Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
    });
    if (this.isEmployee) {
      this.credentials = this.formBuilder.group({
        employeeId: [this.currentUser.employeeId],
        currentPassword: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9/!%^&*()]+$'), Validators.minLength(6),
          Validators.maxLength(30)]],
        newPassword: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9/!%^&*()]+$'), Validators.minLength(6),
          Validators.maxLength(30)]]
      });
    } else {
      this.credentials = this.formBuilder.group({
        customerId: [this.currentUser.customerId],
        currentPassword: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9/!%^&*()]+$'), Validators.minLength(6),
          Validators.maxLength(30)]],
        newPassword: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9/!%^&*()]+$'), Validators.minLength(6),
          Validators.maxLength(30)]]
      });
    }
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
      if (this.employeeAccountForm.invalid){
        return;
      }
      this.userService.updateEmployee(this.employeeAccountForm.value).subscribe(
          data => {
            this.notification.showNotif('Account updated! Changes apply in next sign in.', 'Dismiss');
          }, error => {
            this.notification.showNotif(error, 'error');
            this.submittedEmployeeAccountForm = false;
          }
      )
    } else {
      this.submittedCustomerAccountForm = true;
      if (this.customerAccountForm.invalid) {
        return;
      }
      this.userService.updateIndividual(this.customerAccountForm.value).subscribe(
          data => {
            this.notification.showNotif('Account updated! Changes apply in next sign in.', 'Dismiss');
          }, error => {
            this.notification.showNotif(error, 'error');
            this.submittedCustomerAccountForm = false;
          }
      )
    }
  }

  updatePassword(){
    this.submittedUpdateCredentialForm = true;
    if (this.credentials.invalid) {
      return;
    }
    if (this.isEmployee) {
      this.userService.updateEmployeeCredential(this.credentials.value).subscribe(
          data => {
            this.notification.showNotif('Password changed! Changes apply in next sign in.', 'Dismiss');
          }, error => {
            this.notification.showNotif(error, 'error');
            this.submittedCustomerAccountForm = false;
          }
      );
    } else {
      this.userService.updateCustomerCredential(this.credentials.value).subscribe(
          data => {
            this.notification.showNotif('Password changed! Changes apply in next sign in.', 'Dismiss');
          }, error => {
            this.notification.showNotif(error, 'error');
            this.submittedCustomerAccountForm = false;
          }
      );
    }
  }

}
