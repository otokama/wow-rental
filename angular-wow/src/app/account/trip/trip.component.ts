import { Component, OnInit } from '@angular/core';
import {User} from '../../_models/user';
import {AuthService} from '../../_services/auth.service';
import {ReserveService} from '../../_services/reserve.service';
import {Trip} from '../../_models/trip';
import {TripService} from '../../_services/trip.service';
import {NotificationService} from '../../_services/notification.service';
import {ReservationStatus} from "../../_models/reservationStatus";

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  reservations;
  upComingReserve;
  previousReserve;
  currentReserve;
  currentUser: User;
  page: number;
  constructor(private authService: AuthService, private reserveService: ReserveService, private notif: NotificationService) {
    this.page = 0;
    this.currentUser = this.authService.currentUserValue;
    this.reserveService.getReservationByCustomer(this.currentUser.customerId).subscribe(
        reservations => {
          if (reservations){
            this.reservations = reservations;
            this.previousReserve = this.getPreviousReserve();
          }
        }, error => {this.notif.showNotification('Cannot fetch reservations', 'Dismiss', true);}
    );
  }

  ngOnInit(): void {
  }

  getPreviousReserve() {
    const prevTrip = [];
    let i;
    for (i = 0; i < this.reservations.length; ++i) {
      if (this.reservations[i].status === ReservationStatus.dropOff) {
        prevTrip.push(this.reservations[i]);
      }
    }
    return prevTrip;
  }

  getCurrentReserve() {
    const currTrip = [];
    let i;
    for (i = 0; i < this.reservations.length; ++i) {
      if (this.reservations[i].status === ReservationStatus.pickedUp) {
        currTrip.push(this.reservations[i]);
      }
    }
    return currTrip;
  }

  getUpcomingReserve() {
    const upComingTrip = [];
    let i;
    for (i = 0; i < this.reservations.length; ++i) {
      if (this.reservations[i].status === ReservationStatus.pendingPickUp) {
        upComingTrip.push(this.reservations[i]);
      }
    }
    return upComingTrip;
  }

  switchPage(page) {
    this.page = page;
    if (page === 0) {
      if (!this.previousReserve) {this.previousReserve = this.getPreviousReserve()}
    } else if (page === 1) {
      if (!this.currentReserve) {this.currentReserve = this.getCurrentReserve()}
      if (!this.upComingReserve) {this.upComingReserve = this.getUpcomingReserve()}
    } else {
      if (!this.currentReserve) {this.currentReserve = this.getCurrentReserve()}
    }
  }

}
