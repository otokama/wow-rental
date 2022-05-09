import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CouponService {
    private URL = environment.URL;
    constructor(private http: HttpClient) {}

    getAllCoupons() {
        return this.http.get<any>(`${this.URL}/coupon/get/coupons`).pipe(map(res => {
            if (res.message === 'Success') {
                return res.data;
            }
        }));
    }

    addCoupon(coupon) {
        return this.http.post<any>(`${this.URL}/coupon/add/coupon`, coupon);
    }
}
