import { Component, OnInit } from '@angular/core';
import { ReserveService } from '../_services/reserve.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../_models/vehicle';
import {BranchLocation} from '../_models/branch';
import {ReserveTimeService} from '../_services/reserve-time.service';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../_services/notification.service';
import {AuthService} from '../_services/auth.service';
import {first} from 'rxjs/operators';
import {VehicleType} from '../_models/vehicleType';
import {VehicleService} from '../_services/vehicle.service';
import {LocationService} from '../_services/location.service';
import {CouponService} from "../_services/coupon.service";
import {formatDate} from "@angular/common";

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
  secondaryPaymentForm: FormGroup;
  submitted = false;
  loading = false;
  totalPayment: number;
  splitPayment: boolean;
  vehicleTypes: Map<string, VehicleType>;
  constructor(private reserveService: ReserveService, private router: Router, private route: ActivatedRoute,
    private timeService: ReserveTimeService, private formBuilder: FormBuilder, private notif: NotificationService,
    private authService: AuthService, private vehicleService: VehicleService, private locationService: LocationService,
              private couponService: CouponService) {
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

  checkedSecondPayment() {
    this.splitPayment = !this.splitPayment;
    this.secondaryPaymentForm = this.formBuilder.group({
      paymentMethod: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]]}
    );
  }

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
      this.reserveForm = this.formBuilder.group({
        couponCode: ['', [Validators.pattern('^[a-zA-Z]+$')]],
        paymentMethod: ['', [Validators.required]],
        cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]]});
  }



  get f() {
    return this.reserveForm.controls;
  }

  get secondPaymentControl() {
    return this.secondaryPaymentForm.controls;
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

  validateCoupon() {
    if (this.couponCode) {
      this.couponService.validateCoupon(this.couponCode.toUpperCase()).subscribe(
          discount => {
            if (discount > 0) {
              this.couponValid = true;
              this.discPercentage =  discount;
              this.discAmount = discount * 0.01 * this.totalRate;
              this.discountedRate = this.totalRate - this.discAmount;
            } else {
              this.notif.showNotification('Coupon invalid', 'Dimiss', true);
              this.couponValid = false;
            }
          }, error => {this.notif.showNotification('Cannot fetch coupons', 'Dimiss', true);}
      )
    }
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.reserveForm.invalid) {
      console.log('form invalid');
      return;
    }
    if (this.splitPayment && this.secondaryPaymentForm.invalid) {
      console.log('secondary form invalid');
      return;
    }

    // Create payment info:
    let payment;
    let grandTotal;
    let unlimited;
    let coupon;
    let dailyLimit;
    if (this.unlimitedMile) {
      unlimited = 'Y';
      dailyLimit = '';
    } else {
      unlimited = 'N';
      dailyLimit = '100';
    }
    if (this.couponValid) {
      grandTotal = this.discountedRate;
      coupon = this.couponCode;
    } else {
      grandTotal = this.totalRate;
      coupon = '';
    }
    if (this.splitPayment) {
      payment = [{
        paymentMethod: this.reserveForm.value.paymentMethod,
        cardNumber: this.reserveForm.value.cardNumber,
        amount: grandTotal / 2,
        paymentDate: formatDate(new Date(new Date().getTime()), 'yyyy-MM-dd hh:mm', 'en-US')
      }, {
        paymentMethod: this.secondaryPaymentForm.value.paymentMethod,
        cardNumber: this.secondaryPaymentForm.value.cardNumber,
        amount: grandTotal / 2,
        paymentDate: formatDate(new Date(new Date().getTime()), 'yyyy-MM-dd hh:mm', 'en-US')
      }];
    } else {
      payment = [{
        paymentMethod: this.reserveForm.value.paymentMethod,
        cardNumber: this.reserveForm.value.cardNumber,
        amount: grandTotal,
        paymentDate: formatDate(new Date(new Date().getTime()), 'yyyy-MM-dd hh:mm', 'en-US'),
      }];
    }

    const reservation = {
      pickupDate: formatDate(this.pickUpDate, 'yyyy-MM-dd hh:mm', 'en-US'),
      dropOffDate: formatDate(this.dropOffDate, 'yyyy-MM-dd hh:mm', 'en-US'),
      startOdometer: '',
      endOdometer: '',
      dailyMileageLimit: dailyLimit,
      customerId: this.authService.currentUserValue.customerId,
      vehicleId: this.vehicle.vehicleId,
      pickupLocationId: this.pickUpLoc.locationId,
      dropOffLocationId: this.dropOffLoc.locationId,
      isUnlimited: unlimited,
      couponCode: coupon.toUpperCase(),
      payments: payment
    };

    this.reserveService.reserve(reservation).subscribe(
        data => {
          if (data) {
            this.notif.showNotification('Booking confirmed!', 'Dismiss', false);
          }
        }, error => {this.notif.showNotification('Booking failed', 'Dismiss', true);}
    )
  }



}
