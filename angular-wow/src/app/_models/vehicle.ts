import { VehicleType } from './vehicleType'
import {BranchLocation} from './branch';

export class Vehicle {
    VIN: string;
    vehicleType: VehicleType;
    year: number;
    model: string;
    make: string;
    tagNo: string;
    branchID: BranchLocation;
}
