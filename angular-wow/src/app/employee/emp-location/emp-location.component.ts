import { Component, OnInit } from '@angular/core';
import {BranchLocation} from '../../_models/branch';
import {LocationService} from '../../_services/location.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NotificationService} from '../../_services/notification.service';

@Component({
  selector: 'app-emp-location',
  templateUrl: './emp-location.component.html',
  styleUrls: ['../displayTable.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})

export class EmpLocationComponent  {
  locations: BranchLocation[];
  displayColumns: string[] = ['Branch Name', 'Street', 'City', 'State', 'Phone'];
  namingColumns: string[] = ['locationName', 'street', 'city', 'state', 'phoneNumber'];
  expandedElement: BranchLocation | null;
  constructor(private locationService: LocationService, private notif: NotificationService) {
      this.fetchLocation();
  }

  fetchLocation() {
      this.locationService.getAllBranchLocation().subscribe(
          locations => {
              this.locations = locations;
          }, error => {this.notif.showNotification('Cannot fetch branch location', 'Dismiss', true)}
      );
  }

  updateLocation(location) {
      console.log(location);
  }

  deleteLocation(location) {
      console.log(location);
  }


}
