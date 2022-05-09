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
        // this.branchLocation = [
        //     {
        //         locationId: 1,
        //         locationName: 'JFK - John F. Kennedy Intl.',
        //         street: 'John F. Kennedy International Airport',
        //         city: 'Jamaica',
        //         state: 'New York',
        //         zipcode: '11430',
        //         phoneNumber: '718-244-4444'
        //     },
        //     {
        //         locationId: 2,
        //         locationName: 'SFO - San Francisco Intl.',
        //         street: 'San Francisco International Airport',
        //         city: 'San Francisco',
        //         state: 'California',
        //         zipcode: '94128',
        //         phoneNumber: '800-435-9736'
        //     },
        //     {
        //         locationId: 3,
        //         locationName: 'ORD - O\'Hare Intl.',
        //         street: '10000 W O\'Hare Ave',
        //         city: 'Chicago',
        //         state: 'Illinois',
        //         zipcode: '60666',
        //         phoneNumber: '800-832-6352'
        //     },
        //     {
        //         locationId: 4,
        //         locationName: 'PHL - Philadelphia Intl.',
        //         street: '8500 Essington Ave',
        //         city: 'Philadelphia',
        //         state: 'Pennsylvania',
        //         zipcode: '19153',
        //         phoneNumber: '215-937-6937'
        //     },
        //     {
        //         locationId: 5,
        //         locationName: 'DFW - Dallas-Fort Worth Intl.',
        //         street: '2350 Global Dr',
        //         city: 'Euless',
        //         state: 'Texas',
        //         zipcode: '75261',
        //         phoneNumber: '972-574-1234'
        //     }
        // ];
        //
        // this.vehicleTypes = [
        //     {
        //         vehicleTypeId: 1,
        //         vehicleType: 'Sports',
        //         serviceRate: 220,
        //         excessMileageFee: 30
        //     },
        //     {
        //         vehicleTypeId: 2,
        //         vehicleType: 'Compact',
        //         serviceRate: 170,
        //         excessMileageFee: 13
        //     },
        //     {
        //         vehicleTypeId: 3,
        //         vehicleType: 'Mid-size',
        //         serviceRate: 182,
        //         excessMileageFee: 18
        //     },
        //     {
        //         vehicleTypeId: 4,
        //         vehicleType: 'Standard',
        //         serviceRate: 167,
        //         excessMileageFee: 14
        //     },
        //     {
        //         vehicleTypeId: 5,
        //         vehicleType: 'Full-size',
        //         serviceRate: 190,
        //         excessMileageFee: 19
        //     },
        //     {
        //         vehicleTypeId: 6,
        //         vehicleType: 'SUV',
        //         serviceRate: 199,
        //         excessMileageFee: 25
        //     }
        // ];
        //
        // this.vehicles = [
        //     {
        //          VIN: '1ZVBP8AM9E5286586',
        //          vehicleType: this.vehicleTypes[0],
        //          year: 2013,
        //          model: 'Mustang',
        //          make: 'Ford',
        //          tagNo: '13Mustang',
        //          mileage: 8100,
        //          branchID: this.branchLocation[3]
        //     },
        //     {
        //         VIN: 'JM1BL1H35A1291014',
        //         vehicleType: this.vehicleTypes[1],
        //         year: 2010,
        //         model: 'MazdaSpeed3',
        //         make: 'Mazda',
        //         tagNo: 'SmokeSTI',
        //         mileage: 13000,
        //         branchID: this.branchLocation[4]
        //     },
        //     {
        //         VIN: '2C3CDXGJ8MH543885',
        //         vehicleType: this.vehicleTypes[3],
        //         year: 2015,
        //         model: 'Charger',
        //         make: 'Dodge',
        //         tagNo: 'UVM-2933',
        //         mileage: 12000,
        //         branchID: this.branchLocation[0]
        //     },
        //     {
        //         VIN: 'JF2GTACC9KH225699',
        //         vehicleType: this.vehicleTypes[5],
        //         year: 2018,
        //         model: 'CrossTrek',
        //         make: 'Subaru',
        //         tagNo: 'UBK-5936',
        //         mileage: 4031,
        //         branchID: this.branchLocation[2]
        //     },
        //     {
        //         VIN: '1N4BL4CV3MN341938',
        //         vehicleType: this.vehicleTypes[4],
        //         year: 2021,
        //         model: 'Altima',
        //         make: 'Nissan',
        //         tagNo: 'NOT-GTR',
        //         mileage: 8482,
        //         branchID: this.branchLocation[1]
        //     },
        //     {
        //         VIN: '4T1AZ1FB6LU044165',
        //         vehicleType: this.vehicleTypes[2],
        //         year: 2019,
        //         model: 'Avalon',
        //         make: 'Toyota',
        //         tagNo: 'UVK-9493',
        //         mileage: 49231,
        //         branchID: this.branchLocation[0]
        //     },
        //     {
        //         VIN: '1G1YA2D43M5114844',
        //         vehicleType: this.vehicleTypes[0],
        //         year: 2021,
        //         model: 'Corvette',
        //         make: 'Chevrolet',
        //         tagNo: 'UVK-1149',
        //         mileage: 39492,
        //         branchID: this.branchLocation[4]
        //     },
        //     {
        //         VIN: '1C4BJWFG1GL209558',
        //         vehicleType: this.vehicleTypes[5],
        //         year: 2016,
        //         model: 'Wrangler',
        //         make: 'Jeep',
        //         tagNo: 'WRB-3391',
        //         mileage: 11021,
        //         branchID: this.branchLocation[2]
        //     }
        // ];

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

    private processReservations(services) {
        const processedServices = [];
        let i;
        for (i = 0; i < services.length; ++i) {
            let reservationStatus;
            if (services[i].endOdometer && services[i].startOdometer) {
                reservationStatus = ReservationStatus.dropOff;
            } else if (services[i].startOdometer && !services[i].endOdometer) {
                reservationStatus = ReservationStatus.pickedUp;
            } else if (!services[i].startOdometer && !services[i].endOdometer) {
                reservationStatus = ReservationStatus.pendingPickUp;
            } else {
                console.log('status exception');
            }
            const service = {
                reservationId: services[i].reservationId,
                pickUpDate: new Date(services[i].pickupDate),
                dropOffDate: new Date(services[i].dropOffDate),
                pickUpLoc: services[i].pickupLocation.locationName,
                dropOffLoc: services[i].dropOffLocation.locationName,
                startOdo: services[i].startOdometer,
                endOdo: services[i].endOdometer,
                dailyMileageLimit: services[i].dailyMileageLimit,
                customerId: services[i].customer.id,
                firstName: services[i].customer.firstName,
                lastName: services[i].customer.lastName,
                insuranceCompany: services[i].customer.insuranceCompany,
                vehicleId: services[i].vehicle.vehicleId,
                make: services[i].vehicle.brand,
                model: services[i].vehicle.model,
                vehicleType: services[i].vehicle.vehicleType.vehicleType,
                serviceRate: services[i].vehicle.vehicleType.serviceRate,
                excessMileageFee: services[i].vehicle.vehicleType.excessMileageFee,
                status: reservationStatus
                };
            processedServices.push(service);
        }
        return processedServices;
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

    reserve(service) {
        return this.http.post<any>(`${this.URL}/reservation/reserve/vehicle`, service);
    }

}
