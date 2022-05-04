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
  constructor(private reserveService: ReserveService, private router: Router, private route: ActivatedRoute,
    private timeService: ReserveTimeService, private formBuilder: FormBuilder, private notif: NotificationService,
    private authService: AuthService) {
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
    this.totalPayment = 1;
  }

  ngOnInit(): void {
    this.initForms();
  }

  initFields(pickUpLoc, pickUpDate, dropOffLoc, dropOffDate, vin) {
    this.vehicle = this.reserveService.getVehicleByVin(vin);
    this.pickUpLoc = this.reserveService.getBranchByID(pickUpLoc);
    this.pickUpDate = new Date(pickUpDate);
    this.dropOffLoc = this.reserveService.getBranchByID(dropOffLoc);
    this.dropOffDate = new Date(dropOffDate);
    this.duration = this.timeService.getDuration(this.pickUpDate, this.dropOffDate);
    this.rentalRate = this.duration*this.vehicle.vehicleType.serviceRate;
    this.totalRate = this.rentalRate + 50;
  }

  initForms() {
    this.reserveForm = this.formBuilder.group({
      couponCode: ['', [Validators.pattern('^[a-zA-Z]+$')]],
      paymentMethod: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]]
    })
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
