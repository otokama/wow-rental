import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import {User} from '../../_models/user';
import {Role} from '../../_models/role';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';
import {EmpLocationComponent} from '../emp-location/emp-location.component';
import {EmpVehicleClassComponent} from '../emp-vehicle-class/emp-vehicle-class.component';
import {VehicleType} from "../../_models/vehicleType";
import {BranchLocation} from "../../_models/branch";
import {LocationService} from "../../_services/location.service";
import {VehicleService} from "../../_services/vehicle.service";
import {NotificationService} from "../../_services/notification.service";
import {EmpVehicleComponent} from "../emp-vehicle/emp-vehicle.component";
import {EmpCompanyComponent} from "../emp-company/emp-company.component";
import {EmpCouponComponent} from "../emp-coupon/emp-coupon.component";

@Component({
  selector: 'app-emp-home',
  templateUrl: './emp-home.component.html',
  styleUrls: ['./emp-home.component.css']
})
export class EmpHomeComponent implements OnInit {
  currentUser: User;
  page: number;
  vehicleType: VehicleType[];
  branchLocations: BranchLocation[];
  @ViewChild(EmpCouponComponent, {static:false}) CouponComponent: EmpCouponComponent;
  @ViewChild(EmpCompanyComponent, {static: false }) CompanyComponent: EmpCompanyComponent;
  @ViewChild(EmpLocationComponent, { static: false }) LocationComponent: EmpLocationComponent;
  @ViewChild(EmpVehicleClassComponent, {static: false}) VehicleClassComponent: EmpVehicleClassComponent;
  @ViewChild(EmpVehicleComponent, {static: false}) VehicleComponent: EmpVehicleComponent;
  constructor(public dialog: MatDialog, private authService: AuthService, private locationService: LocationService,
              private vehicleService: VehicleService, private notif: NotificationService) {
    this.currentUser = this.authService.currentUserValue;
    this.page = 0;
    this.locationService.getAllBranchLocation().subscribe(
        locations => {
          if (locations) {
            this.branchLocations = locations;
          }
        }, error => {this.notif.showNotification('Cannot fetch locations', 'Dismiss', true);}
    );
    this.vehicleService.getAllVehicleClass().subscribe(
        vehicleClass => {
          if (vehicleClass) {
            this.vehicleType = vehicleClass;
          }
        }, error => {this.notif.showNotification('Cannot fetch vehicle class', 'Dismiss', true);}
    );
  }

  ngOnInit(): void {
  }


  switchPage(page) {
    this.page = page;
  }

  get isManager() {
    return this.currentUser.role === Role.manager;
  }

  add() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '450px';
    if (this.page === 0) { // location
      dialogConfig.data = {form: 2};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.LocationComponent.fetchLocation();
        }
      });
    } else if (this.page === 1) { // company
      dialogConfig.data = {form: 0};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.CompanyComponent.fetchCompany();
        }
      });
    } else if (this.page === 2) { // corporate customer
      dialogConfig.data = {form: 3};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    } else if (this.page === 3) { // coupon
      dialogConfig.data = {form: 1};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe( result => {
        if (result) {
          this.CouponComponent.fetchCoupon();
        }
      })
    } else if (this.page === 5) { // vehicle
      if (this.branchLocations.length === 0) {
        this.notif.showNotification('Branch location empty. At least one branch location is required.',
            'Dismiss', true);
        return;
      } else if (this.vehicleType.length === 0) {
        this.notif.showNotification('Vehicle class empty. At least one vehicle class is required.',
            'Dismiss', true);
        return;
      }
      dialogConfig.data = {form: 4};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.VehicleComponent.fetchVehicle();
        }
      });
    } else if (this.page === 6) { // vehicle class
      dialogConfig.data = {form: 6};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.VehicleClassComponent.fetchVehicleClass();
        }
      });
    } else if (this.page === 7) { // employee
      dialogConfig.data = {form: 5};
      const dialogRef = this.dialog.open(AddDialogComponent, dialogConfig);

    }

  }
}
