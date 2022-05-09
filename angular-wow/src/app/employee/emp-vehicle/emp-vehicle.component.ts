import { Component } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {VehicleService} from '../../_services/vehicle.service';
import {NotificationService} from '../../_services/notification.service';
import {LocationService} from "../../_services/location.service";
import {VehicleInfo} from "../../_models/vehicleinfo";

@Component({
  selector: 'app-emp-vehicle',
  templateUrl: './emp-vehicle.component.html',
  styleUrls: ['../displayTable.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class EmpVehicleComponent {

  displayColumns: string[] = ['Vehicle Class', 'Year', 'Make', 'Model', 'Tag', 'Branch Location'];
  namingColumns: string[] = ['vehicleTypeName', 'year', 'brand', 'model', 'licensePlate', 'locationName'];
  expandedElement: VehicleInfo | null;
  vehiclesInfo: VehicleInfo[];
  constructor(private vehicleService: VehicleService, private notif: NotificationService, private locationService: LocationService) {
    this.fetchVehicle();
  }



  fetchVehicle() {
    this.vehicleService.getAllVehicleInfo().subscribe(
        vehiclesInfo => {
          if (vehiclesInfo) {
            this.vehiclesInfo = vehiclesInfo;
          }
        }, error => {this.notif.showNotification('Cannot fetch vehicles', 'Dismiss', true)}
    )
  }


  updateVehicle(vehicle) {
    console.log(vehicle);
  }

  deleteVehicle(vehicle) {
    console.log(vehicle);
  }

}
