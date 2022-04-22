import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BranchLocation} from '../_models/branch';

@Injectable({ providedIn: 'root' })
export class ReserveService {
    branchMap;
    branchLocation: BranchLocation[];

    constructor() {
        this.branchLocation = [
            { val: 1, name: 'New York (JFK - John F. Kennedy Intl.)'},
            { val: 2, name: 'San Francisco (SFO - San Francisco Intl.)'},
            { val: 3, name: 'Chicago (ORD - O\'Hare Intl.)'},
            { val: 4, name: 'Philadelphia (PHL - Philadelphia Intl.)'},
            { val: 5, name: 'Dallas (DFW - Dallas-Fort Worth Intl.)'}
        ];
    }

    getAllBranchLocation(): BranchLocation[] {
        return this.branchLocation;
    }

    getBranchName(key: number): string {
        let i;
        for (i = 0; i < this.branchLocation.length; ++i) {
            if (this.branchLocation[i].val === key) {
                return this.branchLocation[i].name;
            }
        }
        return 'No such branch ID';
    }

}
