import { Component, OnInit } from '@angular/core';
import {User} from '../../_models/user';
import {AuthService} from '../../_services/auth.service';
import {ReserveService} from '../../_services/reserve.service';
import {Trip} from '../../_models/trip';
import {TripService} from "../../_services/trip.service";

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  upComingTrips: Trip[];
  previousTrips: Trip[];
  currentTrips: Trip[];
  currentUser: User;
  page: number;
  constructor(private authService: AuthService, private tripService: TripService) {
    this.page = 0;
  }

  ngOnInit(): void {
    this.previousTrips = this.tripService.getPreviousTrip();
  }

  switchPage(page) {
    this.page = page;
    if (page === 0) {
      this.previousTrips = this.tripService.getPreviousTrip();
    } else if (page === 1) {
      this.upComingTrips = this.tripService.getUpcomingTrip();
    } else {
      this.currentTrips = this.tripService.getCurrentTrip();
    }
  }

}
