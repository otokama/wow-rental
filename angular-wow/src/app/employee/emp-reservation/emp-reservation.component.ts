import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NotificationService} from '../../_services/notification.service';
import {ReserveService} from "../../_services/reserve.service";
@Component({
  selector: 'app-emp-reservation',
  templateUrl: './emp-reservation.component.html',
  styleUrls: ['./emp-reservation.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class EmpReservationComponent {

  constructor(private reserveService: ReserveService) { }


}
