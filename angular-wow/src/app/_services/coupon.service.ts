import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {formatDate} from "@angular/common";
import {ReserveTimeService} from "./reserve-time.service";

@Injectable({ providedIn: 'root' })
export class CouponService {
    private URL = environment.URL;
    constructor(private http: HttpClient, private reserveTimeService: ReserveTimeService) {}

    getAllCoupons() {
        return this.http.get<any>(`${this.URL}/coupon/get/coupons`).pipe(map(res => {
            if (res.message === 'Success') {
                const coupons = res.data;
                let i;
                for (i=0; i < coupons.length; ++i) {
                    coupons[i].startDate = formatDate(coupons[i].startDate, 'yyyy-MM-dd', 'en-US');
                    coupons[i].expiredDate = formatDate(coupons[i].expiredDate, 'yyyy-MM-dd', 'en-US');
                }
                return coupons;
            }
        }));
    }

    addCoupon(coupon) {
        return this.http.post<any>(`${this.URL}/coupon/add/coupon`, coupon);
    }

    validateCoupon(coupon) {
        return this.http.get<any>(`${this.URL}/coupon/get/coupons`).pipe(map(res => {
            if (res.message === 'Success') {
                const coupons = res.data;
                let i;
                for (i = 0; i < coupons.length; ++i) {
                    if (coupon === coupons[i].couponCode.toUpperCase()) {

                        if (this.reserveTimeService.isBetween(new Date(coupons[i].startDate),
                            new Date(coupons[i].expiredDate), new Date(new Date().getTime()))) {
                            return coupons[i].discountPercentage;
                        }
                    }
                }
                return -1;
            }
        }));
    }

}
