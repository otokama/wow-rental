import { Component } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {VehicleService} from '../../_services/vehicle.service';
import {VehicleType} from '../../_models/vehicleType';
import {NotificationService} from '../../_services/notification.service';

@Component({
  selector: 'app-emp-vehicle-class',
  templateUrl: './emp-vehicle-class.component.html',
  styleUrls: ['../displayTable.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class EmpVehicleClassComponent {
  vehicleClass: VehicleType[];
  displayColumns: string[] = ['Vehicle Type', 'Service Rate($)', 'Excess Mileage Fee($)'];
  namingColumns: string[] = ['vehicleType', 'serviceRate', 'excessMileageFee'];
  expandedElement: VehicleType | null;
  constructor(private vehicleService: VehicleService, private notif: NotificationService) {
    this.fetchVehicleClass();
  }

  fetchVehicleClass() {
    this.vehicleService.getAllVehicleClass().subscribe(
        vehicleClass => {
          this.vehicleClass = vehicleClass;
        }, error => {
          this.notif.showNotification('Cannot fetch vehicle classes', 'Dismiss', true);
        }
    )
  }

    updateVehicleClass(vehicleClass) {
        console.log(vehicleClass);
    }

    deleteVehicleClass(vehicleClass) {
        console.log(vehicleClass);
    }

}
