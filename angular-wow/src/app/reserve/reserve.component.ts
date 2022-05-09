import { Component, OnInit } from '@angular/core';
import { ReserveService } from '../_services/reserve.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../_models/vehicle';
import {BranchLocation} from '../_models/branch';
import {ReserveTimeService} from '../_services/reserve-time.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../_services/notification.service';
import {AuthService} from '../_services/auth.service';
import {first} from 'rxjs/operators';
import {VehicleType} from '../_models/vehicleType';
import {VehicleService} from '../_services/vehicle.service';
import {LocationService} from '../_services/location.service';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css']
})
export class ReserveComponent implements OnInit {
  vehicle: Vehicle;
  pickUpLoc: BranchLocation;
  pickUpDate: Date;
  dropOffLoc: BranchLocation;
  dropOffDate: Date;
  unlimitedMile: boolean;
  couponCode: string;
  couponValid: boolean;
  discPercentage: number;
  discAmount: number;
  duration: number;
  rentalRate: number;
  totalRate: number;
  discountedRate: number;
  reserveForm: FormGroup;
  submitted = false;
  loading = false;
  totalPayment: number;
  splitPayment: boolean;
  vehicleTypes: Map<string, VehicleType>;
  constructor(private reserveService: ReserveService, private router: Router, private route: ActivatedRoute,
    private timeService: ReserveTimeService, private formBuilder: FormBuilder, private notif: NotificationService,
    private authService: AuthService, private vehicleService: VehicleService, private locationService: LocationService) {
    this.route.queryParams.subscribe(params => {
      if (!params.pickUpLoc|| !params.pickUpDate || !params.dropOffLoc || !params.dropOffDate || !params.vehicleDetail
          || !this.authService.currentUserValue) {
        this.router.navigate(['/']);
      } else {
        this.initFields(params.pickUpLoc, params.pickUpDate, params.dropOffLoc, params.dropOffDate, params.vehicleDetail);
      }

    })
    this.couponValid = false;
    this.unlimitedMile = false;
    this.splitPayment = false;
    this.totalPayment = 1;
  }

  ngOnInit(): void {
    this.initForms();
  }

  // secondPayment($event) {
  //   if(event.checked)
  // }

  initFields(pickUpLoc, pickUpDate, dropOffLoc, dropOffDate, vin) {
    this.locationService.getBranchByID(pickUpLoc).subscribe(
        pickUpLocation => {
          if (pickUpLocation) {
            this.pickUpLoc = pickUpLocation;
          }
        }, error => {this.notif.showNotification('Cannot fetch location', 'Dismiss', true);}
    );
    this.pickUpDate = new Date(pickUpDate);
    this.locationService.getBranchByID(dropOffLoc).subscribe(
        dropOffLocation => {
          if (dropOffLocation) {
            this.dropOffLoc = dropOffLocation;
          }
        }, error => {this.notif.showNotification('Cannot fetch location', 'Dismiss', true);}
    );
    this.dropOffDate = new Date(dropOffDate);
    this.duration = this.timeService.getDuration(this.pickUpDate, this.dropOffDate);
    this.vehicleService.getVehicleById(vin).subscribe(
        vehicle => {
          if (vehicle) {
            this.vehicle = vehicle;
            this.rentalRate = this.vehicle.vehicleType.serviceRate * this.duration;
            this.totalRate = this.rentalRate + 50;
          }
        }, error => {this.notif.showNotification('Cannot fetch vehicle', 'Dismiss', true);}
    );
  }

  initForms() {
    if (this.splitPayment) {
      this.reserveForm = this.formBuilder.group({
        couponCode: ['', [Validators.pattern('^[a-zA-Z]+$')]],
        paymentMethod: ['', [Validators.required]],
        cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
        secondPaymentMethod: ['', [Validators.required]],
        secondCardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]]}
      );
    } else {
      this.reserveForm = this.formBuilder.group({
        couponCode: ['', [Validators.pattern('^[a-zA-Z]+$')]],
        paymentMethod: ['', [Validators.required]],
        cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]]
      });
    }
  }



  get f() {
    return this.reserveForm.controls;
  }

  validCoupon() {
    if (this.couponCode) {
      const discount = this.reserveService.validateCoupon(this.couponCode.toUpperCase());
      if (discount > 0) {
        this.couponValid = true;
        this.discPercentage =  discount;
        this.discAmount = discount * 0.01 * this.totalRate;
        this.discountedRate = this.totalRate - this.discAmount;
      } else {
        this.notif.showNotif('Invalid coupon', 'Dismiss');
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.unlimitedMile);
    // stop here if form is invalid
    if (this.reserveForm.invalid) {
      console.log('Error in onSubmit()');
      return;
    }
    // disable submit button until reservation has been submitted.
    // this.loading = true;
    // this.reserveService.


  }
}
