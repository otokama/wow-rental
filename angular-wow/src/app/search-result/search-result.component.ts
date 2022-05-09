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
import {LocationService} from '../_services/location.service';
import {VehicleType} from '../_models/vehicleType';
import {VehicleService} from '../_services/vehicle.service';

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
  vehicleTypes: Map<string, VehicleType>;
  typeFilters: Map<string, VehicleFilter>;
  selectedFilters: string[] | null;
  vehicleReservable: Vehicle[] | null;
  filteredVehicles: Vehicle[] | null;
  reserveDuration: number;
  constructor(private route: ActivatedRoute, private router: Router, private timeService: ReserveTimeService,
              private reserveService: ReserveService, private dialog: MatDialog,
              private notif: NotificationService, private locationService: LocationService, private vehicleService:VehicleService) {
    this.sortOrder = 2;
    this.sort = [
      'Sort by price - High to Low','Sort by price - Low to High'
    ];
    this.timeOptions = this.timeService.getTimeOptions();
    this.minDate = new Date((new Date().getTime()));
    this.maxDate = new Date();
    this.maxDate.setMonth(this.minDate.getMonth() + 3);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pickUpLoc = params.pickUpLoc;
      this.dropOffLoc = params.dropOffLoc;
      this.initBranchName();
      this.pickUpDate = new Date(params.pickUpDate);
      this.dropOffDate = new Date(params.dropOffDate);
      this.minDropOffDate = this.pickUpDate;
      this.pickUpTime = {hours: this.pickUpDate.getHours(), minutes: this.pickUpDate.getMinutes()};
      this.dropOffTime = {hours: this.dropOffDate.getHours(), minutes: this.dropOffDate.getMinutes()};
      this.search();
    })
    if (!this.pickUpLoc || !this.pickUpDate
        || !this.dropOffLoc || !this.dropOffDate) {
      this.router.navigate(['/']); // redirect to home page. search parameters incomplete
    }
  }

  initBranchName() {
    if (this.pickUpLoc && this.dropOffLoc) {
      this.locationService.getBranchByID(this.pickUpLoc).subscribe(
          pickupLoc => {
            if (pickupLoc) {
              this.pickupBranch = pickupLoc.locationName;
            }
          }, error => {this.notif.showNotification('Cannot fetch locations.', 'Dismiss', true);}
      );
      this.locationService.getBranchByID(this.dropOffLoc).subscribe(
          dropOffLoc => {
            if (dropOffLoc) {
              this.dropOffBranch = dropOffLoc.locationName;
            }
          }, error => {this.notif.showNotification('Cannot fetch locations.', 'Dismiss', true);}
      );
      // console.log(this.pickUpLoc, this.dropOffLoc);
      // this.pickupBranch = this.reserveService.getBranchName((this.pickUpLoc));
      // this.dropOffBranch = this.reserveService.getBranchName(this.dropOffLoc);
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
        if (this.vehicleTypes.get(v1.vehicleTypeId).serviceRate * this.reserveDuration >
              this.vehicleTypes.get(v2.vehicleTypeId).serviceRate * this.reserveDuration) {
          return -1;
        } else {
          return 1;
        }
      }
      );
    } else {
      this.filteredVehicles = this.filteredVehicles.sort((v1, v2) => {
            if (this.vehicleTypes.get(v1.vehicleTypeId).serviceRate * this.reserveDuration >
                  this.vehicleTypes.get(v2.vehicleTypeId).serviceRate * this.reserveDuration) {
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
        this.pickUpLoc = result.location.locationId;
        this.pickupBranch = result.location.locationName;
        if (result.sameLoc) {
          this.dropOffLoc = this.pickUpLoc;
          this.dropOffBranch = this.pickupBranch;
        }
      } else if (result && !pickup) {
        this.dropOffLoc = result.location.locationId;
        this.dropOffBranch = result.location.locationName;
      }
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

        if (this.sortOrder !== 2){
          this.sortPrice(this.sortOrder);
        }
      }
    } else {
      this.notif.showNotif('Please fill in all fields', 'Dismiss');
    }
  }



  initVehicleFilters() {
    this.vehicleTypes = new Map<string, VehicleType>();
    this.vehicleService.getAllVehicleClass().subscribe(
        allVehicleClass => {
          if (allVehicleClass) {
            let i;
            for (i = 0; i < allVehicleClass.length; ++i) {
              this.vehicleTypes.set(allVehicleClass[i].vehicleTypeId, allVehicleClass[i]);
            }
            this.typeFilters = new Map<string, VehicleFilter>();
            this.selectedFilters = [];
            if (this.vehicleReservable.length >= 1) {
              let j;
              for (j = 0; j < this.vehicleReservable.length; ++j) {
                if( this.typeFilters.has(this.vehicleReservable[j].vehicleTypeId) ) {
                  const filter = this.typeFilters.get(this.vehicleReservable[j].vehicleTypeId);
                  filter.qty += 1;
                  this.typeFilters.set(this.vehicleReservable[j].vehicleTypeId,
                      filter);
                } else {
                  const filter = new VehicleFilter(this.vehicleReservable[j].vehicleTypeId, false,
                      this.vehicleTypes.get(this.vehicleReservable[j].vehicleTypeId).vehicleType, 1,
                      this.vehicleTypes.get(this.vehicleReservable[j].vehicleTypeId).serviceRate);
                  this.typeFilters.set(this.vehicleReservable[j].vehicleTypeId, filter);
                }
              }
              this.typeFilters = new Map<string, VehicleFilter>([...this.typeFilters.entries()].sort((a, b) => {
                if (a[1].price > b[1].price) {
                  return 1;
                } else {
                  return -1;
                }
              }));
            }
          }
        }, error => {this.notif.showNotification('Cannot fetch vehicle class', 'Dismiss', true);}
    );

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
        if (this.selectedFilters.indexOf(this.vehicleReservable[i].vehicleTypeId) >= 0) {
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
      vehicleDetail: vehicle.vehicleId
    }
    });
  }


  displayTime(t: Time): string {
    return this.timeService.displayTime(t);
  }

}
