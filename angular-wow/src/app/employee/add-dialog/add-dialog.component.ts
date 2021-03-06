import { Component, Inject } from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../_services/notification.service';
import {UserService} from '../../_services/user.service';
import {LocationService} from '../../_services/location.service';
import {Router} from '@angular/router';
import {VehicleService} from '../../_services/vehicle.service';
import {BranchLocation} from "../../_models/branch";
import {VehicleType} from "../../_models/vehicleType";
import {error} from "protractor";
import {CorporateService} from "../../_services/corporate.service";
import {Company} from "../../_models/company";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {CouponService} from "../../_services/coupon.service";
import {ReserveTimeService} from "../../_services/reserve-time.service";
import {formatDate} from "@angular/common";


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
  company: Company[];
  branchLocations: BranchLocation[];
  vehicleClass: VehicleType[];
  form: number;
  submitted: boolean;
  states = [];
  validDate: Date | null;
  minDate: Date | null;
  minValidDate: Date | null;
  expireDate: Date | null;
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>, @Inject(MAT_DIALOG_DATA) data,
              private notif: NotificationService, private formBuilder: FormBuilder, private userService: UserService,
              private locationService: LocationService, private vehicleService: VehicleService, private corporateService: CorporateService,
              private router: Router, private couponService: CouponService, private timeService: ReserveTimeService) {
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
    this.minDate = new Date(new Date().getTime());
    this.minDate.setMonth(new Date().getMonth() - 1);
    this.submitted = false;
  }

  dateChange(event: MatDatepickerInputEvent<Date>, valid:boolean) {
    if (valid) {
      this.validDate = new Date(event.value);
    } else {
      this.expireDate = new Date(event.value);
    }
  }

  initCompanyForm() {
    this.companyForm = this.formBuilder.group({
      registrationNumber: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.maxLength(10)]],
      corporateName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9. ]+$'), Validators.maxLength(30)]],
      corporateDiscount: ['', [Validators.required, Validators.pattern('(?<=^| )\\d+(\\.\\d+)?(?=$| )|(?<=^| )\\.\\d+(?=$| )'),
        Validators.max(30), Validators.min(0)]]
    });
  }

  initCouponForm() {
    this.couponForm = this.formBuilder.group({
      couponCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.maxLength(30)]],
      discountPercentage: ['', [Validators.required, Validators.pattern('(?<=^| )\\d+(\\.\\d+)?(?=$| )|(?<=^| )\\.\\d+(?=$| )'),
        Validators.max(30), Validators.min(0)]]
    });
  }

  initLocationForm() {
    this.locationForm = this.formBuilder.group({
      locationName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-. ]+$'), Validators.maxLength(30)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      street: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9. ]+$'), Validators.maxLength(30)]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.maxLength(30)]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]]
    });
  }

  get corporateCustomerControl() {
    return this.corporateCustomerRegisterForm.controls;
  }

  get companyControl() {
    return this.companyForm.controls;
  }

  get couponControl() {
    return this.couponForm.controls;
  }

  get locationControl() {
    return this.locationForm.controls;
  }

  get employeeControl() {
    return this.employeeForm.controls;
  }

  get vehicleClassControl() {
    return this.vehicleClassForm.controls;
  }

  get vehicleControl() {
    return this.vehicleForm.controls;
  }

  initCorporateCustomerForm() {
    this.corporateService.getAllCorporate().subscribe(
        company => {
          if (company) {
            this.company = company;
          }
        }, error => {this.notif.showNotification('Cannot fetch company', 'Dismiss', true);}
    );
    this.corporateCustomerRegisterForm = this.formBuilder.group({

    });
  }

  initLocationAndVehicleTypes() {
    this.locationService.getAllBranchLocation().subscribe(
        locations => {
          if (locations) {
            this.branchLocations = locations;
          }
        }, error => {this.notif.showNotification('Cannot fetch locations', 'Dismiss', true);}
    );
    this.vehicleService.getAllVehicleClass().subscribe(
        vehicleClass => {
          if (vehicleClass) {
            this.vehicleClass = vehicleClass;
          }
        }, error => {this.notif.showNotification('Cannot fetch vehicle class', 'Dismiss', true);}
    );
  }

  initVehicleForm() {
    this.initLocationAndVehicleTypes();
    this.vehicleForm = this.formBuilder.group({
      vehicleId: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{17}$')]],
      vehicleTypeId: ['', [Validators.required]],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$'), Validators.min(1970), Validators.max(2022)]],
      brand: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      model: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      licensePlate: ['', [Validators.required, Validators.pattern('^[A-Z0-9]+$'), Validators.maxLength(10)]],
      locationId: ['', [Validators.required]]
    })
  }

  initVehicleClassForm() {
    this.vehicleClassForm = this.formBuilder.group({
      vehicleType: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$'), Validators.maxLength(30)]],
      serviceRate: ['', [Validators.required, Validators.pattern('(?<=^| )\\d+(\\.\\d+)?(?=$| )|(?<=^| )\\.\\d+(?=$| )'),
        Validators.min(1)]],
      excessMileageFee: ['', [Validators.required, Validators.pattern('(?<=^| )\\d+(\\.\\d+)?(?=$| )|(?<=^| )\\.\\d+(?=$| )'),
        Validators.min(1)]]
    });
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
      if (this.companyForm.invalid) {return;}
      this.corporateService.addCorporate(this.companyForm.value).subscribe(
          data => {
            if (data) {
              this.notif.showNotif('Added new company', 'Dismiss');
              this.dialogRef.close(data);
            }
          }, error => {this.notif.showNotification(error, 'Dismiss', true)}
      );
    } else if (formNumber === 1) {

      if (!this.validDate || !this.expireDate || (this.validDate > this.expireDate)) {
        this.notif.showNotification('Please select valid and expire date', 'Dismiss', true);
        return;
      }
      if (this.couponForm.invalid) {return;}
      const coupon = {
        couponCode: this.couponForm.value.couponCode,
        discountPercentage: this.couponForm.value.discountPercentage,
        startDate: formatDate(this.validDate, 'yyyy-MM-dd hh:mm', 'en-US') ,
        expiredDate: formatDate(this.expireDate, 'yyyy-MM-dd hh:mm', 'en-US')
      };
      this.couponService.addCoupon(coupon).subscribe(
          data => {
            if (data) {
              this.notif.showNotification('Added new coupon', 'Dismiss', false);
              this.dialogRef.close(data);
            }
          }, error => {this.notif.showNotification('Cannot add coupon', 'Dismiss', true);}
      )
    } else if (formNumber === 2) {
      if (this.locationForm.invalid) {return;}
      this.locationService.addLocation(this.locationForm.value).subscribe(
          data => {
            if (data) {
              this.notif.showNotif('Added new location', 'Dismiss');
              this.dialogRef.close(data);
            }
          }, error => {this.notif.showNotification(error, 'Dismiss', true)}
      );
    } else if (formNumber === 3) {

    } else if (formNumber === 4) {
      if (this.vehicleForm.invalid) {return;}

      this.vehicleService.addVehicle(this.vehicleForm.value).subscribe(
          data => {
            if (data) {
              this.notif.showNotification('Added new vehicle', 'Dismiss', false);
              this.dialogRef.close(data);
            }
          }, error => {this.notif.showNotification(error, 'Dismiss', true)}
      )
    } else if (formNumber === 5) {
      if (this.employeeForm.invalid) {return;}
      this.userService.registerEmployee(this.employeeForm.value).subscribe(
          data => {
            if (data) {
              this.notif.showNotif('Added new employee', 'Dismiss');
              this.dialogRef.close(data);
            }
          }, error => {this.notif.showNotification(error, 'Dismiss', true)}
      );
    } else if (formNumber === 6) {
      if (this.vehicleClassForm.invalid){return;}
      this.vehicleService.addVehicleClass(this.vehicleClassForm.value).subscribe(
          data => {
            if (data) {
              this.notif.showNotification('Added new vehicle class', 'Dismiss', false);
              this.dialogRef.close(data);
            }
          }, error => {this.notif.showNotification(error, 'Dismiss', true);}
      )
    } else {
      console.log('unknown form');
    }
  }

}
