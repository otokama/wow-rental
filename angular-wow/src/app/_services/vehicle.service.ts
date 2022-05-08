import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class VehicleService {
    private URL = environment.URL;
    constructor(private http: HttpClient) {}

    getAllVehicleClass() {
        return this.http.get<any>(`${this.URL}/vehicle/types`).pipe(map(res => {
            if (res.message === 'Success') {
                return res.data;
            }
        }));
    }

    addVehicleClass(){}

    updateVehicleClass(){}

    deleteVehicleClass(){}
}
