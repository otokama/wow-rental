import { Component, Inject } from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../_services/notification.service';
import {UserService} from '../../_services/user.service';
import {LocationService} from "../../_services/location.service";


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
  vehicleClassForm: FormGroup;
  form: number;
  submitted: boolean;
  states = [];
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>, @Inject(MAT_DIALOG_DATA) data,
              private notif: NotificationService, private formBuilder: FormBuilder, private userService: UserService,
              private locationService: LocationService) {
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
      this.initCorporateCustomerForm();
    } else if (data.form === 4) {
      this.form = 4;
      this.initVehicleForm();
    } else if (data.form === 5) {
      this.form = 5;
      this.initEmployeeForm();
    } else if (data.form === 6) {
      this.form = 6;
      this.initVehicleClassForm();
    } else {
      console.log('Unknown form number');
    }
    this.states = this.userService.getStates();
    this.submitted = false;
  }

  initCompanyForm() {
    this.companyForm = this.formBuilder.group({
      registrationNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.maxLength(10)]],
      corporateName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      corporateDiscount: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.max(30), Validators.min(0)]]
    })
  }

  initCouponForm() {

  }

  initLocationForm() {
    this.locationForm = this.formBuilder.group({
      locationName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9- ]+$'), Validators.maxLength(30)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      street: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.maxLength(30)]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    });
  }

  get companyControl() {
    return this.companyForm.controls;
  }

  get locationControl() {
    return this.locationForm.controls;
  }

  get employeeControl() {
    return this.employeeForm.controls;
  }

  initCorporateCustomerForm() {

  }

  initVehicleForm() {
    // this.vehicleForm = this.formBuilder.group({
    //   vehicleId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{17}$')]],
    //   year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    //   brand: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
    //   model: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
    //   vehicleType: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(10)]],
    // })
  }

  initVehicleClassForm() {

  }

  initEmployeeForm() {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9/!%^&*()]+$'), Validators.minLength(6),
        Validators.maxLength(30)]]
    });
  }

  submit(formNumber) {
    this.submitted = true;
    if (formNumber === 0) {

    } else if (formNumber === 1) {

    } else if (formNumber === 2) {
      if (this.locationForm.invalid) {return;}
      this.locationService.addLocation(this.locationForm.value).subscribe(
          data => {
            if (data) {
              this.notif.showNotif('Added new location', 'Dismiss');
              this.dialogRef.close();
            }
          }, error => {this.notif.showNotif(error, 'error')}
      );
    } else if (formNumber === 3) {

    } else if (formNumber === 4) {

    } else if (formNumber === 5) {
      if (this.employeeForm.invalid) {return;}
      this.userService.registerEmployee(this.employeeForm.value).subscribe(
          data => {
            if (data) {
              this.notif.showNotif('Added new employee', 'Dismiss');
              this.dialogRef.close();
            }
          }, error => {this.notif.showNotif(error, 'error')}
      );
    } else if (formNumber === 6) {

    } else {
      console.log('unknown form');
    }
  }

}
