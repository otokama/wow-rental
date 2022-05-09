import { VehicleType } from './vehicleType'
import {BranchLocation} from './branch';

export interface Vehicle {
    vehicleId: string;
    vehicleType: VehicleType;
    year: number;
    model: string;
    brand: string;
    licensePlate: string;
    location: BranchLocation;
}
