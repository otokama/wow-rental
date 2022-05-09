import { VehicleType } from './vehicleType'
import {BranchLocation} from './branch';

export class Vehicle {
    vehicleId: string;
    vehicleTypeId: string;
    year: number;
    model: string;
    brand: string;
    licensePlate: string;
    locationId: string;
}
