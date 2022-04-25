import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BranchLocation} from '../_models/branch';
import {Vehicle} from '../_models/vehicle';
import {VehicleType} from '../_models/vehicleType';

@Injectable({ providedIn: 'root' })
export class ReserveService {
    branchLocation: BranchLocation[];
    vehicleTypes: VehicleType[];
    vehicles: Vehicle[];
    constructor() {
        this.branchLocation = [
            {
                id: 1,
                name: 'JFK - John F. Kennedy Intl.',
                street: 'John F. Kennedy International Airport',
                city: 'Jamaica',
                state: 'New York',
                zipcode: '11430',
                phone: '718-244-4444'
            },
            {
                id: 2,
                name: 'SFO - San Francisco Intl.',
                street: 'San Francisco International Airport',
                city: 'San Francisco',
                state: 'California',
                zipcode: '94128',
                phone: '800-435-9736'
            },
            {
                id: 3,
                name: 'ORD - O\'Hare Intl.',
                street: '10000 W O\'Hare Ave',
                city: 'Chicago',
                state: 'Illinois',
                zipcode: '60666',
                phone: '800-832-6352'
            },
            {
                id: 4,
                name: 'PHL - Philadelphia Intl.',
                street: '8500 Essington Ave',
                city: 'Philadelphia',
                state: 'Pennsylvania',
                zipcode: '19153',
                phone: '215-937-6937'
            },
            {
                id: 5,
                name: 'DFW - Dallas-Fort Worth Intl.',
                street: '2350 Global Dr',
                city: 'Euless',
                state: 'Texas',
                zipcode: '75261',
                phone: '972-574-1234'
            }
        ];

        this.vehicleTypes = [
            {
                typeID: 1,
                typeName: 'Sports',
                serviceRate: 220,
                excessRate: 30
            },
            {
                typeID: 2,
                typeName: 'Compact',
                serviceRate: 170,
                excessRate: 13
            },
            {
                typeID: 3,
                typeName: 'Mid-size',
                serviceRate: 182,
                excessRate: 18
            },
            {
                typeID: 4,
                typeName: 'Standard',
                serviceRate: 167,
                excessRate: 14
            },
            {
                typeID: 5,
                typeName: 'Full-size',
                serviceRate: 190,
                excessRate: 19
            },
            {
                typeID: 6,
                typeName: 'SUV',
                serviceRate: 199,
                excessRate: 25
            }
        ];

        this.vehicles = [
            {
                 VIN: '1ZVBP8AM9E5286586',
                 vehicleType: this.vehicleTypes[0],
                 year: 2013,
                 model: 'Mustang',
                 make: 'Ford',
                 tagNo: '13Mustang',
                 branchID: this.branchLocation[3]
            },
            {
                VIN: 'JM1BL1H35A1291014',
                vehicleType: this.vehicleTypes[1],
                year: 2010,
                model: 'MazdaSpeed3',
                make: 'Mazda',
                tagNo: 'SmokeSTI',
                branchID: this.branchLocation[4]
            },
            {
                VIN: '2C3CDXGJ8MH543885',
                vehicleType: this.vehicleTypes[3],
                year: 2015,
                model: 'Charger',
                make: 'Dodge',
                tagNo: 'UVM-2933',
                branchID: this.branchLocation[0]
            },
            {
                VIN: 'JF2GTACC9KH225699',
                vehicleType: this.vehicleTypes[5],
                year: 2018,
                model: 'CrossTrek',
                make: 'Subaru',
                tagNo: 'UBK-5936',
                branchID: this.branchLocation[2]
            },
            {
                VIN: '1N4BL4CV3MN341938',
                vehicleType: this.vehicleTypes[4],
                year: 2021,
                model: 'Altima',
                make: 'Nissan',
                tagNo: 'NOT-GTR',
                branchID: this.branchLocation[1]
            },
            {
                VIN: '4T1AZ1FB6LU044165',
                vehicleType: this.vehicleTypes[2],
                year: 2019,
                model: 'Avalon',
                make: 'Toyota',
                tagNo: 'UVK-9493',
                branchID: this.branchLocation[0]
            }
        ];

    }

    getAllBranchLocation(): BranchLocation[] {
        return this.branchLocation;
    }

    getBranchName(key: number): string {
        let i;
        for (i = 0; i < this.branchLocation.length; ++i) {
            if (this.branchLocation[i].id === key) {
                return this.branchLocation[i].name;
            }
        }
        return 'No such branch ID';
    }

    getVehicleReservable(carType: number, pickUpDate: Date, dropOffDate: Date, pickUpLoc: number, dropOffLoc: number) {

    }

}
