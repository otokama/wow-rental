import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BranchLocation} from '../_models/branch';
import {Vehicle} from '../_models/vehicle';
import {VehicleType} from '../_models/vehicleType';
import { VehicleFilter } from '../_models/vehiclefilter';
import {Coupon} from '../_models/coupon';
import {ReservationStatus} from "../_models/reservationStatus";
import {ReserveTimeService} from './reserve-time.service';
import {RentalService} from '../_models/rentalService';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';
import {map} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class ReserveService {
    private URL = environment.URL;
    branchLocation: BranchLocation[];
    vehicleTypes: VehicleType[];
    vehicles: Vehicle[];
    coupons: Coupon[];
    constructor(private timeService: ReserveTimeService, private authService: AuthService, private http: HttpClient) {


        this.coupons = [
            {
                code: 'BUDGET',
                discount: 5,
                validDate: new Date('2021-03-01'),
                expireDate: new Date('2025-03-01')
            },
            {
                code: 'ALAMO',
                discount: 10,
                validDate: new Date('2021-03-01'),
                expireDate: new Date('2025-03-01')
            },
            {
                code: 'ENTERPRISE',
                discount: 5,
                validDate: new Date('2021-03-01'),
                expireDate: new Date('2022-03-01')
            }
        ];

    }




    getVehicleReservable(carType: number[] | null, pickUpDate: Date, dropOffDate: Date,
                         pickUpLoc: number, dropOffLoc: number): Vehicle[] {
        // TODO: replace with API request for reservable vehicles.
        return this.vehicles;
    }


    // TODO: put this in coupon service.
    validateCoupon(coupon: string): number{
        let i;
        for (i = 0; i < this.coupons.length; ++i) {
            if (this.coupons[i].code === coupon) {
                if (this.timeService.isBetween(this.coupons[i].validDate,
                        this.coupons[i].expireDate, new Date((new Date().getTime())))){
                    return this.coupons[i].discount;
                } else {
                    return -1;
                }
            }
        }
        return -1;
    }

    processReservation(service) {
        let reservationStatus;
        if (service.endOdometer && service.startOdometer) {
            reservationStatus = ReservationStatus.dropOff;
        } else if (service.startOdometer && !service.endOdometer) {
            reservationStatus = ReservationStatus.pickedUp;
        } else if (!service.startOdometer && !service.endOdometer) {
            reservationStatus = ReservationStatus.pendingPickUp;
        } else {
            console.log('reservation status exception');
        }
        return {
            reservationId: service.reservationId,
            pickUpDate: new Date(service.pickupDate),
            dropOffDate: new Date(service.dropOffDate),
            pickUpLoc: service.pickupLocation.locationName,
            dropOffLoc: service.dropOffLocation.locationName,
            startOdo: service.startOdometer,
            endOdo: service.endOdometer,
            dailyMileageLimit: service.dailyMileageLimit,
            customerId: service.customer.id,
            firstName: service.customer.firstName,
            lastName: service.customer.lastName,
            insuranceCompany: service.customer.insuranceCompany,
            vehicleId: service.vehicle.vehicleId,
            vehicle: service.vehicle,
            make: service.vehicle.brand,
            model: service.vehicle.model,
            vehicleType: service.vehicle.vehicleType.vehicleType,
            serviceRate: service.vehicle.vehicleType.serviceRate,
            excessMileageFee: service.vehicle.vehicleType.excessMileageFee,
            status: reservationStatus
        };
    }

    processReservations(services) {
        if (!Array.isArray(services)){
            return [this.processReservation(services)];
        } else {
            const processedServices = [];
            let i;
            for (i = 0; i < services.length; ++i) {
                processedServices.push(this.processReservation(services[i]));
            }
            return processedServices;
        }
    }

    getAllReservationCustomer() {
        return this.http.get<any>(`${this.URL}/reservation/get/reservations`).pipe(map(res => {
            if (res.message === 'Success') {
                if (res.data) {
                    return this.processReservations(res.data);
                }
            }
        }));
    }

    getReservationByCustomer(customerId) {
        return this.http.get<any>(`${this.URL}/reservation/get/reservation?customerId=${customerId}`).pipe(map(res => {
            if (res.message === 'Success') {
                if (res.data) {
                    return this.processReservations(res.data);
                }
            }
        }));
    }

    reserve(service) {
        return this.http.post<any>(`${this.URL}/reservation/reserve/vehicle`, service);
    }

}
