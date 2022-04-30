import {Component, Input, OnInit} from '@angular/core';
import {Vehicle} from '../../_models/vehicle';
import {VehicleType} from '../../_models/vehicleType';

@Component({
  selector: 'app-vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.css']
})
export class VehicleItemComponent implements OnInit {

  vehicleType: VehicleType;
  year: number;
  model: string;
  make: string;
  mileage: number;
  @Input() reserveDays: number;
  @Input() vehicle:Vehicle;
  constructor() { }
  ngOnInit(): void {
    this.vehicleType = this.vehicle.vehicleType;
    this.year = this.vehicle.year;
    this.model = this.vehicle.model;
    this.make = this.vehicle.make;
    this.mileage = this.vehicle.mileage;
  }

}
