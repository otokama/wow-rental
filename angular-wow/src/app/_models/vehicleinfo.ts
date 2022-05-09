import {VehicleType} from './vehicleType';
import {BranchLocation} from './branch';

export interface VehicleInfo {
    vehicleId: string;
    year: number;
    model: string;
    brand: string;
    licensePlate: string;
    vehicleTypeName: string;
    locationName: string;
}

