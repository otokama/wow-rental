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
  selectedPickUpDate: Date;
  selectedDropOffDate: Date;
  selectedPickUpLoc: number;
  selectedDropOffLoc: number;
  sort: string[];
  sortOrder: number;
  typeFilters: Map<number, VehicleFilter>;
  selectedFilters: number[] | null;
  vehicleReservable: Vehicle[] | null;
  filteredVehicles: Vehicle[] | null;
  reserveDuration: number;
  constructor(private route: ActivatedRoute, private router: Router, private timeService: ReserveTimeService,
              private reserveService: ReserveService, private dialog: MatDialog,
              private notif: NotificationService) {
    this.sortOrder = 2;
  }

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
      this.sort = [
        'Sort by price - High to Low','Sort by price - Low to High'
      ];
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
    if (sort === 1) {
      this.sortOrder = 1;
      this.sortVehicle(false);
    } else {
      this.sortOrder = 0;
      this.sortVehicle(true);
    }
  }

  private sortVehicle(desc: boolean) {
    if (desc) { // sort by high to low
      this.filteredVehicles = this.filteredVehicles.sort((v1, v2) => {
        if (v1.vehicleType.serviceRate * this.reserveDuration > v2.vehicleType.serviceRate * this.reserveDuration) {
          return -1;
        } else {
          return 1;
        }
      }
      );
    } else {
      this.filteredVehicles = this.filteredVehicles.sort((v1, v2) => {
            if (v1.vehicleType.serviceRate * this.reserveDuration > v2.vehicleType.serviceRate * this.reserveDuration) {
              return 1;
            } else {
              return -1;
            }
          }
      );
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
        this.filteredVehicles = [];
        this.vehicleReservable = this.reserveService.getVehicleReservable(null, this.pickUpDate, this.dropOffDate,
            this.pickUpLoc, this.dropOffLoc);
        this.filteredVehicles = this.vehicleReservable;
        this.initVehicleFilters();

        // set reserveDuration:
        this.pickUpDate.setHours(this.pickUpTime.hours);
        this.pickUpDate.setMinutes(this.pickUpTime.minutes);
        this.dropOffDate.setHours(this.dropOffTime.hours);
        this.dropOffDate.setMinutes(this.dropOffTime.minutes);
        this.reserveDuration = this.timeService.getDuration(this.pickUpDate, this.dropOffDate);

        this.selectedPickUpDate = this.pickUpDate;
        this.selectedPickUpLoc = this.pickUpLoc;
        this.selectedDropOffDate = this.dropOffDate;
        this.selectedDropOffLoc = this.dropOffLoc;
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
        if( this.typeFilters.has(this.vehicleReservable[i].vehicleType.vehicleTypeId) ) {
          const filter = this.typeFilters.get(this.vehicleReservable[i].vehicleType.vehicleTypeId);
          filter.qty += 1;
          this.typeFilters.set(this.vehicleReservable[i].vehicleType.vehicleTypeId,
              filter);
        } else {
          const filter = new VehicleFilter(this.vehicleReservable[i].vehicleType.vehicleTypeId, false,
              this.vehicleReservable[i].vehicleType.vehicleType, 1, this.vehicleReservable[i].vehicleType.serviceRate);
          this.typeFilters.set(this.vehicleReservable[i].vehicleType.vehicleTypeId, filter);
        }
      }
      this.typeFilters = new Map<number, VehicleFilter>([...this.typeFilters.entries()].sort((a, b) => {
        if (a[1].price > b[1].price) {
          return 1;
        } else {
          return -1;
        }
      }));
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
    // apply filter
    if (this.selectedFilters.length > 0) {
      this.filteredVehicles = [];
      let i;
      for (i = 0; i < this.vehicleReservable.length; ++i) {
        if (this.selectedFilters.indexOf(this.vehicleReservable[i].vehicleType.vehicleTypeId) >= 0) {
          this.filteredVehicles.push(this.vehicleReservable[i]);
        }
      }
    } else {
      this.filteredVehicles = this.vehicleReservable;
      if (this.sortOrder === 1) {
        this.sortVehicle(false)
      } else if (this.sortOrder === 0) {
        this.sortVehicle(true);
      }
    }
  }

  reserve(vehicle: Vehicle) {
    // redirect to reserve page
    this.router.navigate(['/reserve'], {queryParams: {
      pickUpLoc: Number(this.selectedPickUpLoc),
      pickUpDate: this.selectedPickUpDate,
      dropOffLoc: Number(this.selectedDropOffLoc),
      dropOffDate: this.selectedDropOffDate,
      vehicleDetail: vehicle.VIN
    }
    });
  }


  displayTime(t: Time): string {
    return this.timeService.displayTime(t);
  }

}
