import { Component, OnInit } from '@angular/core';
import {Time} from '@angular/common';

@Component({
  selector: 'app-reserve-gadget',
  templateUrl: './reserve-gadget.component.html',
  styleUrls: ['./reserve-gadget.component.css']
})
export class ReserveGadgetComponent implements OnInit {

  pickUpDate: Date;
  dropOffDate: Date;
  pickUpTime: Time;
  dropOffTime: Time;

  constructor() { }

  ngOnInit(): void {
  }

}
