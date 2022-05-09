import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NotificationService} from '../../_services/notification.service';
import {ReserveService} from "../../_services/reserve.service";
@Component({
  selector: 'app-emp-reservation',
  templateUrl: './emp-reservation.component.html',
  styleUrls: ['../displayTable.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class EmpReservationComponent {
  reservations;
  displayColumns: string[] = ['Pick-up Location', 'Drop-Off Location', 'Vehicle Class', 'Vehicle Brand', 'Vehicle Model',
    'Customer Firstname', 'Customer Lastname', 'Status'];
  namingColumns: string[] = ['pickUpLoc', 'dropOffLoc', 'vehicleType', 'make', 'model', 'firstName', 'lastName', 'status'];
  expandedElement: any | null;
  constructor(private reserveService: ReserveService, private notif: NotificationService) {
    this.fetchReservation();
  }

  fetchReservation() {
    this.reserveService.getAllReservationCustomer().subscribe(
      reservations => {
        this.reservations = reservations;
      }, error => {this.notif.showNotification('Cannot fetch reservations', 'Dismiss', true);}
    );
  }

  updateReservation(reservation) {
    console.log(reservation);
  }

}
