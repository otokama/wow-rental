import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {Vehicle} from '../../_models/vehicle';
import {VehicleType} from '../../_models/vehicleType';
import {AuthService} from '../../_services/auth.service';
import {NotificationService} from '../../_services/notification.service';
import {Role} from '../../_models/role';

@Component({
  selector: 'app-vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.css']
})
export class VehicleItemComponent implements OnInit {


  @Input() reserveDays: number;
  @Input() vehicle: Vehicle;
  @Output() reserveEvent: EventEmitter<Vehicle> = new EventEmitter<Vehicle>();
  constructor(private authService: AuthService, private notif: NotificationService) { }
  ngOnInit(): void {
  }

  reserve() {
    if (this.authService.currentUserValue) {
      if (this.authService.currentUserValue.role === Role.customer) {
        this.reserveEvent.emit(this.vehicle);
      } else {
        this.notif.showNotif('Only customers can make reservations.', 'Dismiss');
      }
    } else {
      this.notif.showNotif('Please log in to reserve', 'Dismiss');
    }
  }
}
