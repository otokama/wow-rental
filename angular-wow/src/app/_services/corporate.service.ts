import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CorporateService {
    private URL = environment.URL;
    constructor(private http: HttpClient) {}

    getAllCorporate() {
        return this.http.get<any>(`${this.URL}/corporate/get/corporates`).pipe(map(res => {
            if (res.message === 'Success') {
                return res.data;
            }
        }));
    }

    addCorporate(corporate) {
        return this.http.post<any>(`${this.URL}/corporate/add/corporate`, corporate);
    }

    updateCorporate(corporate) {
        return this.http.post(`${this.URL}/corporate/update/corporate`, corporate);
    }

    deleteCorporate(reg) {
        return this.http.delete(`${this.URL}/corporate/delete/corporate?registrationNumber=${reg}`);
    }
}
