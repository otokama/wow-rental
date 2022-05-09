import { Component } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Coupon} from '../../_models/coupon';
import {NotificationService} from '../../_services/notification.service';
import {CouponService} from '../../_services/coupon.service';

@Component({
  selector: 'app-emp-coupon',
  templateUrl: './emp-coupon.component.html',
  styleUrls: ['../displayTable.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class EmpCouponComponent {

  coupons: Coupon[];
  displayColumns: string[] = ['Coupon Code', 'Valid Date', 'Expire Date', 'Discount %'];
  namingColumns: string[] = ['couponCode', 'startDate', 'expiredDate', 'discountPercentage'];
  expandedElement: Coupon | null;
  constructor(private couponService: CouponService, private notif: NotificationService) {
    this.fetchCoupon();
  }

  fetchCoupon() {
    this.couponService.getAllCoupons().subscribe(
        coupons => {
          this.coupons = coupons;
        }
    ), error => {this.notif.showNotification('Cannot fetch coupons', 'Dismiss', true)}
  }

  updateCoupon(coupon) {
    console.log(coupon);
  }

  deleteCoupon(coupon) {
    console.log(coupon);
  }
}
