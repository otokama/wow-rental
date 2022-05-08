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
        return this.http.get<any>(`${this.URL}/branch/get/locations`)
            .pipe(map(res => {
                if (res.message === 'Success') {
                    return res.data;
                }
            }))
    }

    getBranchByID(locationID) {
        return this.http.get<any>(`${this.URL}/branch/get/location?locationId=${locationID}`)
            .pipe(map(res => {
                if (res.message === 'Success') {
                    return res.data;
                }
            }))
    }

    addLocation(location) {
        return this.http.post(`${this.URL}/branch/add/location`, location);
    }


}
