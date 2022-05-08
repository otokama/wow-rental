import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class VehicleService {
    private URL = environment.URL;
    constructor(private http: HttpClient) {}

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
