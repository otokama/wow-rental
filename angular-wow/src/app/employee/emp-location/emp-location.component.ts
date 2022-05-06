import { Component, OnInit } from '@angular/core';
import {BranchLocation} from '../../_models/branch';
import {LocationService} from '../../_services/location.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-emp-location',
  templateUrl: './emp-location.component.html',
  styleUrls: ['./emp-location.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class EmpLocationComponent implements OnInit {
  locations: BranchLocation[];
  displayColumns: string[] = ['Branch Name', 'Street', 'City', 'State', 'Phone'];
  namingColumns: string[] = ['locationName', 'street', 'city', 'state', 'phoneNumber'];
  expandedElement: BranchLocation | null;
  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    this.locationService.getAllBranchLocation().subscribe(
        locations => {
          this.locations = locations;
          console.log('got locations: ', this.locations.length);
        }, error => {console.log('cannot load branch locations');}
    );
  }

  addLocation() {
      console.log('adding new location');
  }


  updateLocation(location) {
      console.log(location);
  }

  deleteLocation(location) {
      console.log(location);
  }


}
