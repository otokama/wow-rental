import { Component, OnInit } from '@angular/core';
import {Time} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../_services/notification.service';
import {ReserveService} from '../../_services/reserve.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {SelectLocationComponent} from './select-location/select-location.component';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

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
  pickUpDate: Date | null;
  dropOffDate: Date | null;
  minDate: Date;
  minDropOffDate: Date | null;
  pickUpTime: Time | null;
  dropOffTime: Time | null;
  timeOptions: Time[];
  pickUpTimeOptions: Time[];
  dropOffTimeOptions: Time[];
  constructor(private notif: NotificationService, private reserveService: ReserveService,
              private dialog: MatDialog) {
    this.timeOptions = [
      {hours: 8, minutes: 30}, {hours: 9, minutes: 0}, {hours: 9, minutes: 30}, {hours: 10, minutes: 0},
      {hours: 10, minutes: 30}, {hours: 11, minutes: 0}, {hours: 11, minutes: 30}, {hours: 12, minutes: 0},
      {hours: 12, minutes: 30}, {hours: 13, minutes: 0}, {hours: 13, minutes: 30}, {hours: 14, minutes: 0},
      {hours: 14, minutes: 30}, {hours: 15, minutes: 0}, {hours: 15, minutes: 30}, {hours: 16, minutes: 0},
      {hours: 16, minutes: 30}, {hours: 17, minutes: 0}, {hours: 17, minutes: 30}, {hours: 18, minutes: 0},
      {hours: 18, minutes: 30}, {hours: 19, minutes: 0}, {hours: 19, minutes: 30}, {hours: 20, minutes: 0},
      {hours: 20, minutes: 30}
    ];
    this.dropOffTimeOptions = this.timeOptions.filter((ele) => ele.hours > 8);
    this.pickUpTimeOptions = this.timeOptions.slice(0, 24);

  }

  ngOnInit(): void {
    this.minDate = new Date((new Date().getTime()))
    this.minDropOffDate = new Date((new Date().getTime()));
  }

  displayBranchName(key: number): string {
    return this.reserveService.getBranchName(key);
  }

  openLocSelectorPickup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {location: this.pickUpLoc, pickup: true};
    const dialogRef = this.dialog.open(SelectLocationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pickUpLoc = result.locationID;
        if (result.sameLoc) {
          this.dropOffLoc = this.pickUpLoc;
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
        this.dropOffLoc = result.locationID;
      }
    }, error => {console.log(error); } );
  }

  pickUpDateChange(event: MatDatepickerInputEvent<Date>) {
    this.minDropOffDate = new Date(event.value);
    // adjust dropOffDate since it can't be earlier than pickup date.
    if (this.dropOffDate < this.pickUpDate) {
      this.dropOffDate = this.pickUpDate;
    }
  }

  selectTime(option, pickUp) {
    if (pickUp) {
      this.pickUpTime = {
        hours: option.hours,
        minutes: option.minutes
      };
      this.dropOffTime = null;
      this.dropOffTimeOptions = this.timeOptions.filter(
          (ele) => (ele.hours > option.hours) ||
          (ele.hours === option.hours && ele.minutes > option.minutes)
      );
    } else {
      this.dropOffTime = {
        hours: option.hours,
        minutes: option.minutes
      };
    }
  }

  private displayHour(num: number): string {
    if (num < 10) {
      return '0' + num.toString();
    } else {
      return num.toString();
    }
  }

  private displayMin(num: number): string {
    if (num !== 30) {
      return '00';
    } else {
      return num.toString();
    }
  }

  private displayTime(t: Time): string {
    return this.displayHour(t.hours) + ' : ' + this.displayMin(t.minutes);
  }
}
