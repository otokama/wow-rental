import { Component, Inject } from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../_services/notification.service';
import {UserService} from '../../_services/user.service';


@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent {
  companyForm: FormGroup;
  couponForm: FormGroup;
  employeeForm: FormGroup;
  locationForm: FormGroup;
  corporateCustomerRegisterForm: FormGroup;
  vehicleForm: FormGroup;
  form: number;
  submitted: boolean;
  states = [];
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>, @Inject(MAT_DIALOG_DATA) data,
              private notif: NotificationService, private formBuilder: FormBuilder, private userService: UserService) {
    if (data.form === 0) {
      this.form = 0;
      this.initCompanyForm();
    } else if (data.form === 1) {
      this.form = 1;
      this.initCouponForm();
    } else if (data.form === 2) {
      this.form = 2;
      this.initLocationForm();
    } else if (data.form === 3) {
      this.form = 3;
      this.initCorporateForm();
    } else if (data.form === 4) {
      this.form = 4;
      this.initVehicleForm();
    } else if (data.form === 5) {
      this.form = 5;
      this.initEmployeeForm();
    } else {
      console.log('unknown form group');
      this.form = 6;
    }
    this.states = this.userService.getStates();
    this.submitted = false;
  }

  initCompanyForm() {

  }

  initCouponForm() {

  }

  initLocationForm() {
    this.locationForm = this.formBuilder.group({
      locationName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      street: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.maxLength(30)]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    });
  }

  get locationControl() {
    return this.locationForm.controls;
  }

  initCorporateForm() {

  }

  initVehicleForm() {

  }

  initEmployeeForm() {

  }

  submit(formNumber) {
    this.submitted = true;
  }

}
