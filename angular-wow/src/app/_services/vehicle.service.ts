import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {VehicleType} from "../_models/vehicleType";
import {VehicleInfo} from "../_models/vehicleinfo";

@Injectable({ providedIn: 'root' })
export class VehicleService {
    private URL = environment.URL;
    constructor(private http: HttpClient) {}

    getVehicleTypeMapper(): Map<string, VehicleType> {
        const mapper = new Map<string, VehicleType>();
        this.getAllVehicleClass().subscribe(
            vehicleTypes => {
                let i;
                for (i = 0; i < vehicleTypes.length; ++i) {
                    mapper.set(vehicleTypes[i].vehicleTypeId, vehicleTypes[i]);
                }
                return mapper;
            }
        )
        return;
    }

    getAllVehicleInfo() {
        return this.http.get<any>(`${this.URL}/vehicle/get/vehicles`).pipe(map(res => {
            if (res.message === 'Success') {
                const vehicles = res.data;
                const vehiclesInfo: VehicleInfo[] = [];
                let i;
                for (i = 0; i < vehicles.length; ++i) {
                    const newInfo: VehicleInfo = {
                        vehicleId: vehicles[i].vehicleId,
                        year: vehicles[i].year,
                        model: vehicles[i].model,
                        brand: vehicles[i].brand,
                        licensePlate: vehicles[i].licensePlate,
                        vehicleTypeName: vehicles[i].vehicleType.vehicleType,
                        locationName: vehicles[i].location.locationName
                    };
                    vehiclesInfo.push(newInfo);
                }
                return vehiclesInfo;
            }
        }));
    }

    getAllVehicle() {
        return this.http.get<any>(`${this.URL}/vehicle/get/vehicles`).pipe(map(res => {
            if (res.message === 'Success') {
                return res.data;
            }
        }));
    }

    getVehicleById(vehicleId) {
        return this.http.get<any>(`${this.URL}/vehicle/get/vehicle/by/vehicleId?vehicleId=${vehicleId}`)
            .pipe(map(res => {
                if (res.message === 'Success') {
                    return res.data;
                }
            }));
    }

    getVehicleByLocation(locationId) {
        return this.http.get<any>(`${this.URL}/vehicle/get/vehicle/by/locationId?locationId=${locationId}`)
            .pipe(map(res => {
                if (res.message === 'Success') {
                    return res.data;
                }
            }));
    }

    addVehicle(vehicle) {
        return this.http.post<any>(`${this.URL}/vehicle/add/vehicle`, vehicle);
    }


    getAllVehicleClass() {
        return this.http.get<any>(`${this.URL}/vehicle/get/types`).pipe(map(res => {
            if (res.message === 'Success') {
                return res.data;
            }
        }));
    }

    addVehicleClass(vehicleTye){
        return this.http.post(`${this.URL}/vehicle/add/type`, vehicleTye);
    }

    updateVehicleClass(vehicleType){
        return this.http.post(`${this.URL}/vehicle/update/type`, vehicleType);
    }

    deleteVehicleClass(vehicleTypeId){
        return this.http.delete(`${this.URL}/vehicle/delete/type?vehicleTypeId=${vehicleTypeId}`);
    }
}
