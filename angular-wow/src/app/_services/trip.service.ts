import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Trip} from '../_models/trip';

@Injectable({ providedIn: 'root' })
export class TripService {

    trips: Trip[];

    constructor() {
        this.trips = [
            {
                pickUpLocation: 'DFW Intl. Airport',
                dropOffLocation: 'DFW Intl. Airport',
                pickUpDate: new Date('2021-04-23'),
                dropOffDate: new Date('2021-05-01'),
                vehicleMake: 'Ford',
                vehicleModel: 'Edge',
                vehicleYear: 2017,
                mileage: 190,
                totalCharge: 500
            },
            {
                pickUpLocation: 'JFK Intl. Airport',
                dropOffLocation: 'JFK Intl. Airport',
                pickUpDate: new Date('2022-01-02'),
                dropOffDate: new Date('2022-01-09'),
                vehicleMake: 'Mazda',
                vehicleModel: 'Mazdaspeed3',
                vehicleYear: 2014,
                mileage: 135,
                totalCharge: 450
            },
            {
                pickUpLocation: 'DFW Intl. Airport',
                dropOffLocation: 'JFK Intl. Airport',
                pickUpDate: new Date('2022-05-02'),
                dropOffDate: new Date('2022-05-12'),
                vehicleMake: 'Chevrolet',
                vehicleModel: 'Tahoe',
                vehicleYear: 2019,
                mileage: 0,
                totalCharge: 800
            },
            {
                pickUpLocation: 'PHL Intl. Airport',
                dropOffLocation: 'JFK Intl. Airport',
                pickUpDate: new Date('2022-07-12'),
                dropOffDate: new Date('2022-07-30'),
                vehicleMake: 'Dodge',
                vehicleModel: 'Challenger',
                vehicleYear: 2018,
                mileage: 0,
                totalCharge: 1200
            }
        ];
    }


}
