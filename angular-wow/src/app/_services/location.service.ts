import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BranchLocation} from '../_models/branch';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LocationService {
    private URL = environment.URL;
    constructor(private http: HttpClient) {
    }

    getAllBranchLocation() {
        return this.http.get<any>(`${this.URL}/vehicle/locations`)
            .pipe(map(res => {
                if (res.message === 'Success') {
                    return res.data;
                }
            }))
    }

    // TODO: get location by ID
    getBranchByID(locationID: number) {
        return this.http.get<any>(`${this.URL}/vehicle/getLocationByID/${locationID}`)
    }

    addLocation(location) {
        console.log(location);
        return this.http.post(`${this.URL}/vehicle/add/location`, location);
    }


}
