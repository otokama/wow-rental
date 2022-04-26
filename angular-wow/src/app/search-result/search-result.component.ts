import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReserveService } from '../_services/reserve.service';
import { ReserveTimeService } from '../_services/reserve-time.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SelectLocationComponent} from '../home/reserve-gadget/select-location/select-location.component';
import {Time} from '@angular/common';

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
  bodyTypeFilter: string | null;
  constructor(private route: ActivatedRoute, private router: Router, private timeService: ReserveTimeService,
              private reserveService: ReserveService, private dialog: MatDialog) { }

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
      // TODO: display search result once receives all search parameters.
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

  filterBodyType(typeID: number){
    if (typeID === 0) {
      this.bodyTypeFilter = null;
    } else {
      this.bodyTypeFilter = this.reserveService.getBodyTypeName(Number(typeID));
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

    } else {

    }
  }


  displayTime(t: Time): string {
    return this.timeService.displayTime(t);
  }


}
