import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReserveService } from '../_services/reserve.service';
import { ReserveTimeService } from '../_services/reserve-time.service';
import { NotificationService } from '../_services/notification.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SelectLocationComponent } from '../home/reserve-gadget/select-location/select-location.component';
import { Time } from '@angular/common';
import { VehicleFilter } from '../_models/vehiclefilter';
import { Vehicle } from '../_models/vehicle';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  pickUpLoc; pickupBranch: string;
  dropOffLoc; dropOffBranch: string;
  pickUpDate: Date;
  dropOffDate: Date;
  minDate: Date;
  minDropOffDate: Date | null;
  maxDate: Date;
  pickUpTime: Time;
  dropOffTime: Time;
  timeOptions: Time[];
  sort: string | null;
  typeFilters: Map<number, VehicleFilter>;
  selectedFilters: number[] | null;
  vehicleReservable: Vehicle[] | null;
  reserveDuration: number;
  constructor(private route: ActivatedRoute, private router: Router, private timeService: ReserveTimeService,
              private reserveService: ReserveService, private dialog: MatDialog,
              private notif: NotificationService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pickUpLoc = params.pickUpLoc;
      this.dropOffLoc = params.dropOffLoc;
      this.initBranchName();
      this.pickUpDate = new Date(params.pickUpDate);
      this.dropOffDate = new Date(params.dropOffDate);
      this.minDropOffDate = this.pickUpDate;
      this.minDate = new Date((new Date().getTime()));
      this.maxDate = new Date();
      this.maxDate.setMonth(this.minDate.getMonth() + 3);
      this.pickUpTime = {hours: this.pickUpDate.getHours(), minutes: this.pickUpDate.getMinutes()};
      this.dropOffTime = {hours: this.dropOffDate.getHours(), minutes: this.dropOffDate.getMinutes()};
      this.timeOptions = this.timeService.getTimeOptions();
      this.search();
    })
    if (!this.pickUpLoc || !this.pickUpDate
        || !this.dropOffLoc || !this.dropOffDate) {
      this.router.navigate(['/']); // redirect to home page. search parameters incomplete
    }
  }

  initBranchName() {
    if (this.pickUpLoc && this.dropOffLoc) {
      this.pickupBranch = this.reserveService.getBranchName((this.pickUpLoc));
      this.dropOffBranch = this.reserveService.getBranchName(this.dropOffLoc);
    }
  }

  // TODO: add sorting here
  sortPrice(sort: number) {
    if (sort === 0) {
      this.sort = null;
    } else if (sort === 1) {
      this.sort = 'Sort by price - Low to High';
    } else {
      this.sort = 'Sort by price - High to Low';
    }
  }



  openLocSelector(pickup: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    if (pickup) {
      dialogConfig.data = {location: this.pickUpLoc, pickup: true};
    } else {
      dialogConfig.data = {location: this.dropOffLoc, pickup: false};
    }
    const dialogRef = this.dialog.open(SelectLocationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result && pickup) {
        this.pickUpLoc = result.locationID;
        if (result.sameLoc) {
          this.dropOffLoc = this.pickUpLoc;
        }
      } else if (result && !pickup) {
        this.dropOffLoc = result.locationID;
      }
      this.initBranchName();
    }, error => {console.log(error); } );
  }

  selectDate(option, isPickup) {
    if (isPickup) {
      this.pickUpDate = new Date(option.value);
      if (this.dropOffDate && this.dropOffDate < this.pickUpDate) {
        this.dropOffDate = this.pickUpDate;
      }
      this.minDropOffDate = this.pickUpDate;
    } else {
      this.dropOffDate = new Date(option.value);
    }
  }

  selectTime(option, isPickup) {
    if (isPickup) {
      this.pickUpTime = {hours: option.hours, minutes: option.minutes};
    } else {
      this.dropOffTime = {hours: option.hours, minutes: option.minutes};
    }
  }

  search() {
    if (this.pickUpLoc && this.dropOffLoc && this.pickUpDate && this.dropOffDate
      && this.pickUpTime && this.dropOffTime) {
      if ( this.timeService.compareDate(this.pickUpDate, this.dropOffDate)
        && this.timeService.compareTime(this.dropOffTime, this.pickUpTime) < 0) {
        this.notif.showNotif('Invalid time or date', 'Dismiss');
      } else {
        this.vehicleReservable = this.reserveService.getVehicleReservable(null, this.pickUpDate, this.dropOffDate,
            this.pickUpLoc, this.dropOffLoc);
        this.initVehicleFilters();
        this.reserveDuration = this.timeService.getDuration(this.pickUpDate, this.dropOffDate);
      }
    } else {
      this.notif.showNotif('Please fill in all fields', 'Dismiss');
    }
  }


  initVehicleFilters() {
    this.typeFilters = new Map<number, VehicleFilter>();
    this.selectedFilters = [];
    if (this.vehicleReservable.length >= 1) {
      let i;
      for (i = 0; i < this.vehicleReservable.length; ++i) {
        if( this.typeFilters.has(this.vehicleReservable[i].vehicleType.typeID) ) {
          const filter = this.typeFilters.get(this.vehicleReservable[i].vehicleType.typeID);
          filter.qty += 1;
          this.typeFilters.set(this.vehicleReservable[i].vehicleType.typeID,
              filter);
        } else {
          const filter = new VehicleFilter(this.vehicleReservable[i].vehicleType.typeID, false,
              this.vehicleReservable[i].vehicleType.typeName, 1, this.vehicleReservable[i].vehicleType.serviceRate);
          this.typeFilters.set(this.vehicleReservable[i].vehicleType.typeID, filter);
        }
      }

    }
  }

  updateFilter() {
    for (const typeID of this.typeFilters.keys()) {
      if (this.typeFilters.get(typeID).checked && this.selectedFilters.indexOf(typeID) < 0) {
        this.selectedFilters.push(typeID);
      } else if (!this.typeFilters.get(typeID).checked && this.selectedFilters.indexOf(typeID) >= 0) {
        this.selectedFilters.splice(this.selectedFilters.indexOf(typeID), 1);
      }
    }
    // TODO: apply filter
  }

  displayTime(t: Time): string {
    return this.timeService.displayTime(t);
  }


}
