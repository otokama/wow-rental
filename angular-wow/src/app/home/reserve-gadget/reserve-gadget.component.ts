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

  constructor(private notif: NotificationService, private reserveService: ReserveService,
              private dialog: MatDialog) { }

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
    if (this.dropOffDate < this.pickUpDate) {
      this.dropOffDate = this.pickUpDate;
    }
  }

}
