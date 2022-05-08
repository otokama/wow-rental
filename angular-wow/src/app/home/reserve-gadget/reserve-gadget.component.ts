import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Time} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../_services/notification.service';
import {ReserveService} from '../../_services/reserve.service';
import {ReserveTimeService} from '../../_services/reserve-time.service'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SelectLocationComponent} from './select-location/select-location.component';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {BranchLocation} from '../../_models/branch';

@Component({
  selector: 'app-reserve-gadget',
  templateUrl: './reserve-gadget.component.html',
  styleUrls: ['./reserve-gadget.component.css']
})
export class ReserveGadgetComponent implements OnInit {


  fieldControl = new FormControl('', [Validators.required]);
  rangeControl = new FormGroup({start: new FormControl(), end: new FormControl()});
  dateModel: NgbDateStruct;

  pickUpLoc: number | null;
  dropOffLoc: number | null;
  pickUpLocObj: BranchLocation | null;
  dropOffLocObj: BranchLocation | null;
  pickUpDate: Date | null;
  dropOffDate: Date | null;
  minDate: Date;
  maxDate: Date;
  minDropOffDate: Date | null;
  pickUpTime: Time | null;
  dropOffTime: Time | null;
  timeOptions: Time[];
  pickUpTimeOptions: Time[];
  dropOffTimeOptions: Time[];
  constructor(private notif: NotificationService, private reserveService: ReserveService,
              private dialog: MatDialog, private router: Router, private timeService: ReserveTimeService) {
    this.timeOptions = timeService.getTimeOptions();
    this.dropOffTimeOptions = this.timeOptions.filter((ele) => ele.hours > 8);
    this.pickUpTimeOptions = this.timeOptions.slice(0, 24);

  }

  ngOnInit(): void {
    this.minDate = new Date((new Date().getTime()));
    this.maxDate = new Date();
    this.maxDate.setMonth(this.minDate.getMonth() + 3);
    this.minDropOffDate = new Date((new Date().getTime()));
  }

  openLocSelectorPickup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {location: this.pickUpLoc, pickup: true};
    const dialogRef = this.dialog.open(SelectLocationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pickUpLoc = result.location.locationId;
        this.pickUpLocObj = result.location;
        if (result.sameLoc) {
          this.dropOffLoc = this.pickUpLoc;
          this.dropOffLocObj = result.location;
        }
      }
    }, error => {console.log(error); } );
  }

  openLocSelectorDropOff() {
    const dialogConfigDropOff = new MatDialogConfig();
    dialogConfigDropOff.autoFocus = false;
    dialogConfigDropOff.width = '500px';
    dialogConfigDropOff.data = {location: this.pickUpLoc, pickup: false};
    const dialogRef = this.dialog.open(SelectLocationComponent, dialogConfigDropOff);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dropOffLoc = result.location.locationId;
        this.dropOffLocObj = result.location;
      }
    }, error => {console.log(error); } );
  }

  pickUpDateChange(event: MatDatepickerInputEvent<Date>) {
    this.pickUpDate = new Date(event.value);
    this.minDropOffDate = this.pickUpDate;
    this.dropOffTime = null;
    // adjust dropOffDate since it can't be earlier than pickup date.
    if (this.dropOffDate) {

      if (this.dropOffDate < this.pickUpDate ||
          this.dropOffDate.toISOString() === this.pickUpDate.toISOString()) {
        console.log('same pickup and drop off');
        this.dropOffDate = this.pickUpDate;
        if (this.pickUpTime) {
          this.filterDropOffTime(this.pickUpTime.hours, this.pickUpTime.minutes);
        }
      } else {
        this.resetDropOffTimeOptions();
      }
    }
  }

  dropOffDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dropOffDate = new Date(event.value);
    console.log(this.dropOffDate);
    this.dropOffTime = null;
    if (this.dropOffDate.toISOString() === this.pickUpDate.toISOString() && this.pickUpTime ) {
      console.log('same pickup and drop off');
      this.filterDropOffTime(this.pickUpTime.hours, this.pickUpTime.minutes);
    } else {
      this.resetDropOffTimeOptions();
    }
  }

  filterDropOffTime(hours, minutes) {
    this.dropOffTimeOptions = this.timeOptions.filter(
          (ele) => (ele.hours > hours) ||
              (ele.hours === hours && ele.minutes > minutes)
      );
  }

  selectTime(option, pickUp) {

    if (pickUp) {
      this.pickUpTime = {
        hours: option.hours,
        minutes: option.minutes
      };
      this.dropOffTime = null;
      if (this.pickUpDate && this.pickUpDate.toISOString() === this.dropOffDate.toISOString()) {
        this.dropOffTimeOptions = this.timeOptions.filter(
            (ele) => (ele.hours > option.hours) ||
                (ele.hours === option.hours && ele.minutes > option.minutes)
        );
      }
    } else {
      this.dropOffTime = {
        hours: option.hours,
        minutes: option.minutes
      };
    }
  }

  search() {
    if (this.pickUpLoc && this.pickUpDate && this.pickUpTime
      && this.dropOffLoc && this.dropOffDate && this.dropOffTime) {
      this.pickUpDate.setHours(this.pickUpTime.hours);
      this.pickUpDate.setMinutes(this.pickUpTime.minutes);
      this.dropOffDate.setHours(this.dropOffTime.hours);
      this.dropOffDate.setMinutes(this.dropOffTime.minutes);
      this.router.navigate(['/search'], {queryParams: {
        pickUpLoc: this.pickUpLoc,
        dropOffLoc: this.dropOffLoc,
        pickUpDate: this.pickUpDate,
        dropOffDate: this.dropOffDate }
      });

    } else {
      this.notif.showNotif('Please fill in all fields', 'Dismiss');
    }
  }

  displayTime(t: Time): string {
    return this.timeService.displayTime(t);
  }

  private resetDropOffTimeOptions() {
    this.dropOffTimeOptions = this.timeOptions.filter((ele) => ele.hours > 8);
  }
}
